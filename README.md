# AS5 — Static HTML/CSS/JS Site

A premium corporate site for AS5, a structural engineering and real estate
development firm. Plain HTML/CSS/JS — no build step, no framework, no
bundler. Every page is a static file.

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
- `js/portfolio-filter.js` — client-side status/type filtering on the
  Portfolio page, URL-synced via `?status=` / `?type=` query params.
- `js/contact-form.js` — client-side validation for the inquiry form, posts
  to `/api/inquire`, and pre-fills the project dropdown from a `?project=`
  query param.
- `api/inquire.js` — a Vercel serverless function implementing the same
  `POST /api/inquire` logic (Zod validation + Resend). Vercel auto-detects
  anything under `api/` with zero config, so this is what actually serves
  the contact form in production on Vercel.
- `server/` — a minimal standalone Express server with the *same*
  `/api/inquire` logic, plus `express.static` to serve every file above.
  This is for running the whole site locally or on any non-Vercel host
  (a VPS, Netlify with a rewrite, etc.) where there's no serverless
  functions convention to hook into.

Both `api/inquire.js` and `server/server.js` implement the same
validation/send logic independently — there's no shared module between them
because they run under different conventions (Vercel's `(req, res)` handler
vs. an Express route). Keep them in sync if the validation rules change.

## Running locally

```
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
needed. Set `RESEND_API_KEY` and `INQUIRY_RECIPIENT_EMAIL` in the Vercel
project's Environment Variables so the function can actually send email
(without them it validates and logs instead, same as local dev).

**Anywhere else**: every file outside `api/` and `server/` is plain static
HTML/CSS/JS and can be hosted anywhere (Netlify, S3, GitHub Pages, etc.)
with zero build step. The only thing that won't work without a backend is
the contact form's actual send — either run `server/` somewhere reachable
at `/api/inquire`, or point the form at a different backend and update the
`fetch` call in `js/contact-form.js`.

## Known gaps

- No image optimization/resizing/lazy-loading — images are loaded directly
  from Unsplash at fixed widths (clearly marked `TODO: replace with client
  photography`).
- No build-time HTML generation — every page's navbar/footer markup is
  duplicated by hand across files rather than shared via a template.
- All content is placeholder/TODO copy — replace with client-approved
  content before launch.
