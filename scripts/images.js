/**
 * Image pipeline for the static site. Run after adding or replacing any
 * file in images/:
 *
 *   npm run images
 *
 * - Every images/*.jpeg|jpg photo gets a compressed .webp sibling (the
 *   HTML references the .webp; the .jpeg stays as the editable original).
 * - The white/black logos get small .webp versions for the navbar/footer.
 * - Favicons, touch icons and manifest icons are built from
 *   images/brand/as5-mark-white.png.
 * - Open Graph share images (1200x630) are built for the site and for
 *   each project that has real photography.
 *
 * Outputs are committed, so hosting needs no build step.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const img = (...p) => path.join(root, "images", ...p);
const INK = "#0a0a0b";

// Wider cap for the full-bleed homepage hero; everything else is shown at
// most ~700 CSS px wide, so 1400px covers 2x screens.
const MAX_WIDTH = { "home-hero": 2400 };
const DEFAULT_MAX_WIDTH = 1400;

async function photosToWebp() {
  const files = fs.readdirSync(img()).filter((f) => /\.(jpe?g)$/i.test(f));
  for (const file of files) {
    const base = file.replace(/\.(jpe?g)$/i, "");
    const out = img(base + ".webp");
    const maxWidth = MAX_WIDTH[base] || DEFAULT_MAX_WIDTH;
    await sharp(img(file))
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 74, effort: 5 })
      .toFile(out);
    report(file, out);
  }
}

async function logos() {
  for (const name of ["logo", "logo-black"]) {
    const out = img(name + ".webp");
    // Not trimmed: the CSS sizes these by height and relies on the
    // original padding, so the aspect ratio must match the PNGs.
    await sharp(img(name + ".png"))
      .resize({ width: 480 })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(out);
    report(name + ".png", out);
  }
}

async function squareIcon(size, padding) {
  const inner = Math.round(size * (1 - padding * 2));
  const mark = await sharp(img("brand", "as5-mark-white.png"))
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
}

/** Minimal .ico writer: an ICONDIR header followed by embedded PNGs. */
function toIco(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

async function icons() {
  fs.mkdirSync(img("icons"), { recursive: true });
  const icoSizes = [16, 32, 48];
  const icoPngs = [];
  for (const size of icoSizes) {
    icoPngs.push({ size, data: await squareIcon(size, 0.12) });
  }
  fs.writeFileSync(path.join(root, "favicon.ico"), toIco(icoPngs));
  console.log("favicon.ico");

  const outputs = [
    ["icons/favicon-32.png", 32, 0.12],
    ["icons/favicon-16.png", 16, 0.12],
    ["icons/icon-192.png", 192, 0.16],
    ["icons/icon-512.png", 512, 0.16],
    // Maskable icons need the mark inside the central 80% safe zone.
    ["icons/icon-maskable-512.png", 512, 0.24],
  ];
  for (const [file, size, padding] of outputs) {
    fs.writeFileSync(img(file), await squareIcon(size, padding));
    console.log("images/" + file);
  }
  // iOS requests /apple-touch-icon.png at the root even without a <link>.
  fs.writeFileSync(path.join(root, "apple-touch-icon.png"), await squareIcon(180, 0.16));
  console.log("apple-touch-icon.png");
}

async function ogImage(source, out, { position = "centre" } = {}) {
  const W = 1200;
  const H = 630;
  const logo = await sharp(img("logo.png")).trim().resize({ height: 120 }).toBuffer();
  const scrim = Buffer.from(
    `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${INK}" stop-opacity="0.25"/>` +
      `<stop offset="1" stop-color="${INK}" stop-opacity="0.85"/></linearGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#g)"/></svg>`
  );
  await sharp(img(source))
    .resize(W, H, { fit: "cover", position })
    .composite([
      { input: scrim, left: 0, top: 0 },
      { input: logo, left: 64, top: H - 120 - 56 },
    ])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(img("og", out));
  console.log("images/og/" + out);
}

async function ogImages() {
  fs.mkdirSync(img("og"), { recursive: true });
  await ogImage("home-hero.jpeg", "default.jpg");
  await ogImage("project-three-of-us-01-hero.jpeg", "three-of-us.jpg");
  await ogImage("project-soho-boulevard-01-hero.jpeg", "soho-boulevard.jpg");
  await ogImage("project-keystone-polo-partnership-03-event-action.jpeg", "keystone-polo-partnership.jpg");
}

/** Branded stand-in for portfolio entries that have no photography yet. */
async function institutionalPlaceholder() {
  const W = 1600;
  const H = 1200;
  const pattern = await sharp(img("pattern-tile.png")).resize(400).negate({ alpha: false }).toBuffer();
  const faded = await sharp({ create: { width: W, height: H, channels: 4, background: INK } })
    .composite([{ input: pattern, tile: true, left: 0, top: 0 }])
    .png()
    .toBuffer();
  const dim = Buffer.from(
    `<svg width="${W}" height="${H}"><rect width="100%" height="100%" fill="${INK}" fill-opacity="0.82"/></svg>`
  );
  const logo = await sharp(img("logo.png")).trim().resize({ width: 520 }).toBuffer();
  await sharp(faded)
    .composite([{ input: dim }, { input: logo, gravity: "center" }])
    .webp({ quality: 78 })
    .toFile(img("project-institutional-placeholder.webp"));
  console.log("images/project-institutional-placeholder.webp");
}

function report(from, to) {
  const before = fs.statSync(img(from)).size;
  const after = fs.statSync(to).size;
  console.log(`${from} -> ${path.basename(to)}  ${kb(before)} -> ${kb(after)}`);
}

const kb = (n) => Math.round(n / 1024) + " KB";

(async () => {
  await photosToWebp();
  await logos();
  await icons();
  await ogImages();
  await institutionalPlaceholder();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
