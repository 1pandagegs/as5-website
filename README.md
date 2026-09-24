# AS5 — Static HTML/CSS/JS Site

The site for AS5 Group (as5group.com), a real estate development and
construction company in Abuja. Plain HTML/CSS/JS, no framework, no
bundler. Every page is a static file, and the generated output is committed,
so hosting needs no build step.

## Maintenance scripts

```
npm install
npm run images     # after adding/replacing anything in images/
npm run prerender  # after editing js/data/projects.js or js/data/articles.js
```

- `scripts/images.js` writes a compressed `.webp` next to every `.jpeg` in
  `images/` (pages reference the `.webp`), plus the favicon set
  (`/favicon.ico`, `/apple-touch-icon.png`, `images/icons/`) and the Open
  Graph share images in `images/og/`.
- `scripts/prerender.js` bakes the portfolio/insight cards into the HTML
  (between `<!-- prerender -->` markers) so they render without JavaScript,
  and regenerates `sitemap.xml` from every page that isn't `noindex`.

## Structure

- `index.html`, `about/`, `services/`, `portfolio/`, `contact/`,
  `careers/`, `legal/`, `privacy/`, `404.html` — one folder per route, each
  containing an `index.html`.
- `css/styles.css` — the full design system: a monochrome (black/white/gray,
  no accent color) identity with a bold caps display font, matching AS5's
  real brand.
- `images/logo.png` (wordmark + mark, for the navbar) and
  `images/logo-mark.png` (mark only, used as the large low-opacity
  `.watermark` background on a few dark sections) — both are placeholders
  rendered from the SVG mark, **replace them with the real logo files**
  (same filenames, similar aspect ratio) and every page picks it up
  automatically.
- `js/main.js` — shared behavior: navbar scroll/mobile-menu state, hero
  parallax, and scroll-triggered reveal animations (`IntersectionObserver`,
  respects `prefers-reduced-motion`).
- `js/portfolio-filter.js` — progressive-enhancement category filter on the
  Portfolio page (the cards are already in the HTML; the filter buttons only
  appear once the script runs), URL-synced via `?category=` / `?status=`.
- `js/contact-form.js` — client-side validation for the inquiry form, posts
  to `/api/inquire`, and pre-fills the project dropdown from a `?project=`
  query param.
- `api/inquire.js` — a Vercel serverless function implementing the same
  `POST /api/inquire` logic (Zod validation + Resend). Vercel auto-detects
  anything under `api/` with zero config, so this is what actually serves
  the contact form in production on Vercel.
- `server/` — a minimal standalone Express server that mounts the same
  `api/inquire.js` handler, plus `express.static` to serve every file above.
  This is for running the whole site locally or on any non-Vercel host
  (a VPS, Netlify with a rewrite, etc.) where there's no serverless
  functions convention to hook into.

The form posts JSON via `fetch`; without JavaScript it falls back to a normal
form POST, which gets a redirect to `/contact/thank-you/`. With no
`RESEND_API_KEY` in production the endpoint returns 503 (and the form shows
the email/phone fallback) instead of pretending the inquiry was sent.

## Running locally

```
npm install            # repo root: resend/zod for api/inquire.js
cd server
npm install
cp .env.example .env   # fill in RESEND_API_KEY / INQUIRY_RECIPIENT_EMAIL when ready
npm start
```

Then open `http://localhost:4000`. Without a real `RESEND_API_KEY`, the
`/api/inquire` endpoint still validates and logs submissions server-side —
it just won't send a real email until a key is added.

## Deploying

**Vercel**: push to the connected branch. The static files deploy as-is and
`api/inquire.js` deploys automatically as a serverless function — no config
needed. Set `RESEND_API_KEY` in the Vercel project's Environment Variables
and verify the `as5group.com` domain in Resend (the default sender is
`website@as5group.com`; override with `INQUIRY_FROM_EMAIL`). Inquiries go to
`INQUIRY_RECIPIENT_EMAIL`, defaulting to `info@as5group.com`.

**Anywhere else**: every file outside `api/` and `server/` is plain static
HTML/CSS/JS and can be hosted anywhere (Netlify, S3, GitHub Pages, etc.)
with zero build step. The only thing that won't work without a backend is
the contact form's actual send — either run `server/` somewhere reachable
at `/api/inquire`, or point the form at a different backend and update the
`fetch` call in `js/contact-form.js`.

## Known gaps

- Navbar/footer markup is still duplicated by hand across pages.
- See `FINALIZATION-CHECKLIST.md` for content still owed by the client.
