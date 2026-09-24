# AS5 Group launch checklist

## Done in the launch-prep pass
- Domain switched to `as5group.com` (canonicals, OG URLs, sitemap, robots, JSON-LD).
- Email is now `info@as5group.com` everywhere, as a `mailto:` link. Phone is a `tel:` link, with a WhatsApp link (`wa.me/2347042377442`).
- Titles standardised to "… — AS5 Group" with development/construction positioning.
- Descriptive alt text on every image; no "TODO" alt text left.
- Portfolio, homepage carousel and related cards are prerendered into the HTML (they work without JS); filters are an enhancement.
- Copyright year is hardcoded (JS still keeps it current).
- OG/Twitter tags, `GeneralContractor` (LocalBusiness) JSON-LD, favicon set + web manifest, sitemap.xml, robots.txt, 404 page, and a no-JS thank-you page.
- Footer: full address line, icon links (LinkedIn, Instagram, WhatsApp), tracking parameters removed from the Instagram URL.
- All Unsplash hotlinks removed; images self-hosted as WebP; below-fold images lazy-loaded.
- Accessibility: skip link, visible focus, footer contrast, heading order, valid `<dl>`s, Escape closes the mobile menu, content visible without JS, contact page no longer overflows on phones.
- Contact form: honeypot, no-JS fallback, and a 503 error (not a false "sent") when email isn't configured in production. Resend is configured and delivery verified live.
- Em dashes removed from all site copy; page titles use "Page | AS5 Group".
- Homepage hero upscaled 2x (Lanczos + sharpening) from the 793px source. This is interpolation, not real detail: a native high-resolution landscape photo is still needed.

## Needed from the client before launch
1. **Resend credentials**: `RESEND_API_KEY` in Vercel, and `as5group.com` verified as a sending domain in Resend (DNS records). Until then the form shows an "email/call us" error in production.
2. **Confirm inbox**: `info@as5group.com` exists and should receive inquiries (or set `INQUIRY_RECIPIENT_EMAIL`).
3. **Street address** in Mabushi (and map coordinates) for the footer, contact page and JSON-LD. Only "Mabushi, Abuja, FCT" is shown today.
4. **Confirm WhatsApp** is active on +234 704 237 7442.
5. **Confirm social URLs**: `instagram.com/as5_group/` and `linkedin.com/company/as5-group/` (the LinkedIn URL is unverified).
6. **Hero photo**: `home-hero.jpeg` is 793×1080 (portrait, soft when full-screen). Supply a landscape image of at least 2400×1600.
7. **FMWR&S photography** (2024 and 2025): no images exist, so those galleries were removed and the heroes are typographic.
8. **Photos for** `home-about`, `about-approach` and the Insights articles (currently borrowing other AS5 photos).
9. **Privacy policy and legal terms**: both pages say "being finalized". The contact form collects personal data, so a privacy notice is needed under Nigeria's NDPA.
10. **Legal entity name** for the copyright line (the site says "AS5 Group"; the FMWR&S pages say "AS5 Enterprises Company Limited").
11. **Content approval**: Insights articles (3 are in-house placeholders), Careers, and the About "Company Timeline" (it has no dates). These pages are `noindex` and not linked from the navigation until approved.
12. Earlier open items still stand: Three of Us specs/district, Soho Boulevard scope and the "first members-only club" claim, Keystone Polo official naming/role, leadership bios, and partner logo permissions.

## Deployment definition of done
Form delivery verified with a real send; responsive QA at 375/768/1024/1440px; Chrome/Safari/Firefox check; Lighthouse pass; social previews checked (e.g. opengraph.xyz); sitemap submitted in Google Search Console; final client sign-off.
