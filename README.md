# AS5 — Static HTML/CSS/JS Site

A premium corporate site for AS5, a structural engineering and real estate
development firm. Plain HTML/CSS/JS — no build step, no framework, no
bundler. Every page is a static file.

## Structure

- `index.html`, `philosophy/`, `capabilities/`, `portfolio/`, `contact/`,
  `careers/`, `legal/`, `privacy/`, `404.html` — one folder per route, each
  containing an `index.html`.
- `css/styles.css` — the full design system (tokens, type scale, layout,
  components) as plain CSS, hand-ported from the Next.js app's Tailwind
  setup.
- `js/main.js` — shared behavior: navbar scroll/mobile-menu state, hero
  parallax, and scroll-triggered reveal animations (`IntersectionObserver`,
  respects `prefers-reduced-motion`).
- `js/portfolio-filter.js` — client-side status/type filtering on the
  Portfolio page, URL-synced via `?status=` / `?type=` query params.
- `js/contact-form.js` — client-side validation for the inquiry form, posts
  to `/api/inquire`, and pre-fills the project dropdown from a `?project=`
  query param.
- `server/` — a minimal Express server. Static HTML/CSS/JS has no backend
  of its own, so this is the one piece of server code in this bundle: it
  serves every file above *and* exposes `POST /api/inquire`, since that
  endpoint needs to validate input (Zod) and send email (Resend).

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

## Deploying without the server

Every file outside `server/` is plain static HTML/CSS/JS and can be hosted
anywhere (Netlify, S3, GitHub Pages, etc.) with zero build step. The only
thing that won't work without a backend is the contact form's actual send —
either keep `server/` running somewhere reachable at `/api/inquire`, or
point the form at a different backend (e.g. a serverless function or a
third-party form service) and update the `fetch` call in
`js/contact-form.js`.

## Known gaps

- No image optimization/resizing/lazy-loading — images are loaded directly
  from Unsplash at fixed widths (clearly marked `TODO: replace with client
  photography`).
- No build-time HTML generation — every page's navbar/footer markup is
  duplicated by hand across files rather than shared via a template.
- All content is placeholder/TODO copy — replace with client-approved
  content before launch.
