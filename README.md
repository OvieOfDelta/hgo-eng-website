# H.G.O ENG RESOURCES LIMITED Website

Static website (HTML, CSS, JS). No build step, no framework, no third-party hosts: fonts, icons and media are all in this folder.

```
index.html     page markup, legal dialogs, cookie banner, forms
css/style.css  all styles (hand-written; colours and spacing are variables at the top)
js/main.js     site settings, quote estimator, Web3Forms sending, Talk to Sales control, cookie consent
images/        logo, hero video + poster, section photos, favicons (see table)
assets/fonts/  Manrope + Sora (open-source, SIL OFL licences included), self-hosted
favicon.ico    browser-tab icon
CNAME          custom domain for GitHub Pages (HIDDEN FILE - see warning)
.nojekyll      tells GitHub Pages to serve files as they are (HIDDEN FILE - see warning)
```

> **Hidden-file warning:** `CNAME` and `.nojekyll` can be skipped by drag-and-drop uploads in the browser. After uploading, check both are in the repo root. GitHub Desktop or `git push` avoids the problem.

## Placeholders and assumptions to confirm (search `TO CONFIRM` in `index.html`)

1. **Data-retention period** in the Privacy Policy (section 7) - the only `TO CONFIRM` left.
2. **`CNAME`** says `REPLACE-WITH-YOUR-DOMAIN.com`. Put the real domain on one line (e.g. `www.example.com`), or delete the file if there is no custom domain yet.
3. **C.E.O. photo** (`images/ceo.jpg`) is a placeholder silhouette.
4. **LPG imagery** (`images/lpg.jpg`) is an illustration. Replace with real photos of the client's LPG storage or cylinders.
5. **LPG unit is kilograms** in the quote estimator (presets 500 to 20,000 kg). This is an assumption; change `CFG.lpg` and `PRESETS.lpg` in `js/main.js` if the client sells by another unit.
6. **Industry product tags** (e.g. "Aviation: ATK") and the three **Insights supply guides** are suggested copy based on the product descriptions. The client should review them.
7. Legal text is drafted for Nigeria (NDPA 2023, NDPC, NMDPRA, Lagos courts). **Have a Nigerian lawyer review it**, including how LPG supply is covered.

## Where contact details live (keep in sync)

| Detail | Where |
|---|---|
| Email `hgoengresources@gmail.com` | `index.html` (contact, footer, Talk to Sales menu, legal pages) - use find and replace |
| Calls `0802 277 1017`, `0803 993 9697` | `index.html` (contact, footer, Talk to Sales menu, messages, legal pages) |
| WhatsApp `2348022771017` | `WA` constant in `js/main.js` (sets every WhatsApp link and the quote hand-off); the visible number is in `index.html` |
| Web3Forms key | `WEB3FORMS_KEY` in `js/main.js` |
| Company, CAC `RC-9904336`, office address | `index.html` (about, footer, legal pages) |

## Media

| File | Where it shows |
|---|---|
| `hero-loop.mp4` + `hero-loop.webm` | Hero background loop (muted, silent, 5 s, seamless loop). Skipped for visitors with reduced-motion or Data Saver on. Source clip is 720p; a 1080p source would look sharper. Keep both files in step. |
| `hero-bg.jpg` | Hero poster and fallback while the video loads (a frame of the clip) |
| `fleet.jpg`, `drive.jpg` | Logistics photo and final call-to-action background (frames of the clip) |
| `lpg.jpg` | LPG feature section (illustration, see above) |
| `logo.png` | Header and footer logo (transparent PNG). The product bar now reads PMS, AGO, DPK, LPG, ATK. It was repainted from the original JPEG; ask the designer for a vector original for best quality. |
| `ceo.jpg` | About section leader photo (square, about 400x400) |
| `favicon-*.png`, `apple-touch-icon.png`, `favicon.ico` | Tab and phone icons |

Replace a file and keep the SAME name. GitHub Pages caches for a few minutes; hard-refresh to see changes. To re-encode a video: `ffmpeg -i in.mp4 -an -c:v libx264 -crf 28 -pix_fmt yuv420p -movflags +faststart hero-loop.mp4`.

## Contact and quote forms (email)

Both forms are delivered by Web3Forms; the quote form also opens WhatsApp with the details pre-filled.
1. Go to https://web3forms.com, enter `hgoengresources@gmail.com`, and copy the access key emailed to you.
2. Paste it into `WEB3FORMS_KEY` in `js/main.js`.
3. Publish, send a test from the live site, check the inbox and spam folder.

The key is public by design. Free plan (checked Oct 2026 via third-party pricing trackers; verify at web3forms.com/pricing): 250 submissions a month, 30 days of history, no dashboard, so Gmail is your record of enquiries.

## Quote estimator

Products: PMS, AGO, DPK, ATK (liters, presets 10,000 / 33,000 / 45,000 / 60,000 / 100,000 L, with the equivalent in 33,000 L tankers), LPG (kilograms) and Tanker Haulage (1 to 50 tankers). Settings are at the top of `js/main.js` (`TANKER`, `FUEL`, `CFG`, `PRESETS`). The "Request ... supply" links on the product cards preselect the matching product.

## Talk to Sales

One floating button (bottom right) opens a small menu: WhatsApp, two call numbers, email. Edit the links in the `talk-menu` block of `index.html`. The cookie banner sits bottom-left (above the button on phones).

## Hosting (GitHub Pages) and domain

- Repo > Settings > Pages: deploy from the `main` branch, root folder, set the custom domain, tick Enforce HTTPS.
- DNS: a `CNAME` record for `www` pointing to `YOUR-USERNAME.github.io`, plus GitHub's A records for the apex domain (see GitHub docs, "Managing a custom domain").
- If you host on Netlify instead, delete `CNAME` and `.nojekyll`, and update the legal pages, which currently name GitHub as the host.
- Email on your own domain (optional): use a forwarding service (e.g. ImprovMX) or the host's email, delete old default MX records, and keep only ONE SPF record per domain. Use Cloudflare Email Routing only if the domain's DNS is on Cloudflare.

## Pre-launch checklist

- [ ] Retention period filled; `CNAME` edited
- [ ] Real C.E.O. photo, LPG photos (and ideally a 1080p hero clip) in place
- [ ] Web3Forms key pasted; live test received from BOTH forms
- [ ] WhatsApp and both call numbers tested on a phone
- [ ] Cookie banner (Accept All, Essential Only, Cookie Settings) and footer link work; legal dialogs open
- [ ] Lawyer has reviewed Privacy Policy, Cookie Policy, Terms
- [ ] `CNAME` and `.nojekyll` present in the repo; HTTPS enforced
- [ ] Client confirms: CAC number, 24/7 hours, nationwide coverage, LPG offering and units
