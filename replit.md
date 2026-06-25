# Dev27 — Developer Template & Theme Download Website

A static, multi-page website for downloading free HTML templates, WordPress themes, landing pages, coming soon pages, and email templates.

## Stack
- **Pure HTML5 + CSS3 + Vanilla JS** — zero frameworks, zero dependencies
- **Data-driven**: all product data lives in `data/products.json`
- **Deployment**: Cloudflare Pages (or Netlify/Vercel)

## File Structure
```
index.html          — Homepage (product grid + sidebar)
product.html        — Single product page
category.html       — Category archive page
about.html          — About page
contact.html        — Contact page (FormSubmit.co integration)
thank-you.html      — Download confirmation page
css/style.css       — All styles (CSS variables, responsive)
js/main.js          — All JS (router, search, downloads, confetti)
data/products.json  — Product data (add new products here)
_redirects          — Cloudflare Pages routing
_headers            — Cloudflare Pages security/cache headers
```

## How to Add a New Product
1. Open `data/products.json`
2. Add a new object to the `"products"` array following the existing schema
3. Update `stats.totalProducts` and `stats.totalDownloads` if needed

## How to Change Colors
Edit CSS variables at the top of `css/style.css`:
- `--primary` → Carrot Red (main brand)
- `--green` → Download button
- `--coal` → Jump-to-download button / footer background

## Contact Form
The contact form uses [FormSubmit.co](https://formsubmit.co). Replace `YOUR_GMAIL_HERE@gmail.com` in `contact.html` with your real Gmail address.

## Newsletter (Mailchimp)
Replace `YOUR_MAILCHIMP_U` and `YOUR_MAILCHIMP_ID` in all HTML files with your real Mailchimp form credentials.

## Deployment to Cloudflare Pages
1. Push this repo to GitHub
2. Go to Cloudflare Pages → Create project → Connect GitHub
3. Build command: (leave empty — it's pure static)
4. Output directory: `/` (root)
5. Deploy!

## User Preferences
- Brand name: Dev27
- Primary color: Carrot Red (#E8432D)
- Download button: Grass Green (#22C55E)
- Jump-to-download: Coal Black (#1a1a2e)
- Fonts: Inter (body), JetBrains Mono (code/mono)
- All data managed via JSON — no build step required
