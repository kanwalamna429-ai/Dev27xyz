/* ============================================================
   DEV27 — Centralized Ads Manager  (js/ads.js)
   ============================================================

   HOW TO USE THIS FILE
   ─────────────────────────────────────────────────────────────
   This file controls ALL ad placements across the entire Dev27
   website from one single location.

   Each ad slot has a unique name (e.g. "banner-top") and its
   own code block. To activate an ad, replace the placeholder
   comment inside the `code` field with your real ad tag.

   SUPPORTED AD NETWORKS:
   ──────────────────────
   • Google AdSense   → replace code with your <ins> tag
   • Google Ad Manager (DFP) → replace with googletag.display()
   • Media.net        → replace with your Media.net script block
   • Carbon Ads       → replace with their <script> snippet
   • BuySellAds       → replace with their embed code
   • Amazon Associates → replace with banner embed
   • Custom HTML      → paste any HTML banner code directly

   HOW TO ADD YOUR GOOGLE ADSENSE CODE
   ─────────────────────────────────────
   1. Go to your AdSense account → Ads → By ad unit
   2. Create a new ad unit (or use existing)
   3. Copy the <ins class="adsbygoogle"> block
   4. Paste it as the `code` value for the matching slot below
   5. Save this file — the ad will appear site-wide instantly

   EXAMPLE — Replacing a placeholder with AdSense:
   ─────────────────────────────────────────────────
   BEFORE (placeholder):
     code: DEV27_ADS.placeholder('728x90', 'banner-top'),

   AFTER (real AdSense):
     code: `
       <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
         data-ad-slot="1234567890"
         data-ad-format="auto"
         data-full-width-responsive="true">
       </ins>
       <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
     `,

   TO DISABLE A SPECIFIC AD SLOT:
   ────────────────────────────────
   Set  enabled: false  on any slot to hide it without deleting code.

   TO SHOW ADS ONLY ON CERTAIN PAGES:
   ─────────────────────────────────────
   Use the  pages  array. Example: pages: ['home', 'category']
   Available page names: 'home', 'product', 'category', 'about',
                         'contact', 'thankyou'
   Leave pages as [] or omit it to show on ALL pages.

   ============================================================ */


/* ============================================================
   GLOBAL ADSENSE SCRIPT LOADER
   ─────────────────────────────────────────────────────────────
   If you're using Google AdSense, uncomment the line below and
   replace XXXXXXXXXXXXXXXX with your AdSense Publisher ID.
   This loads the AdSense library once for the entire site.
   ============================================================ */

// DEV27_ADS.loadAdSenseScript('ca-pub-XXXXXXXXXXXXXXXX');


const DEV27_ADS = {

  /* ==========================================================
     AD SLOT DEFINITIONS
     ──────────────────────────────────────────────────────────
     Add, edit, or disable slots here.
     Each slot maps to a  data-ad-slot="slot-name"  attribute
     in the HTML. The slot name must match exactly.
     ========================================================== */
  slots: {

    /* ── HOMEPAGE TOP BANNER ─────────────────────────────────
       Location: Homepage, just above the product grid
       Size: 728×90 (Leaderboard)
       HTML attribute: data-ad-slot="banner-top"
    ─────────────────────────────────────────────────────────── */
    'banner-top': {
      enabled: true,
      label: 'Advertisement',
      pages: ['home'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('728×90', 'Top Banner — Homepage'),
    },

    /* ── HOMEPAGE MID-CONTENT BANNER ─────────────────────────
       Location: Homepage, between the product grid rows
       Size: 728×90 (Leaderboard)
       HTML attribute: data-ad-slot="banner-mid"
    ─────────────────────────────────────────────────────────── */
    'banner-mid': {
      enabled: true,
      label: 'Advertisement',
      pages: ['home'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('728×90', 'Mid-Content Banner — Homepage'),
    },

    /* ── SIDEBAR TOP AD ──────────────────────────────────────
       Location: Right sidebar, top widget (all pages)
       Size: 300×250 (Medium Rectangle) — most profitable size
       HTML attribute: data-ad-slot="sidebar-top"
    ─────────────────────────────────────────────────────────── */
    'sidebar-top': {
      enabled: true,
      label: 'Sponsored',
      pages: [],  // [] = all pages
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('300×250', 'Sidebar Top — All Pages'),
    },

    /* ── SIDEBAR BOTTOM AD ───────────────────────────────────
       Location: Right sidebar, bottom widget (all pages)
       Size: 300×250 (Medium Rectangle)
       HTML attribute: data-ad-slot="sidebar-bottom"
    ─────────────────────────────────────────────────────────── */
    'sidebar-bottom': {
      enabled: true,
      label: 'Sponsored',
      pages: [],  // [] = all pages
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('300×250', 'Sidebar Bottom — All Pages'),
    },

    /* ── PRODUCT PAGE — ABOVE CONTENT ────────────────────────
       Location: Single product page, above the article content
       Size: 728×90 (Leaderboard)
       HTML attribute: data-ad-slot="product-above"
    ─────────────────────────────────────────────────────────── */
    'product-above': {
      enabled: true,
      label: 'Advertisement',
      pages: ['product'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('728×90', 'Above Content — Product Page'),
    },

    /* ── PRODUCT PAGE — IN-ARTICLE ───────────────────────────
       Location: Single product page, inside the article body
       Size: 728×90 or Responsive
       HTML attribute: data-ad-slot="product-in-article"
       NOTE: "In-article" ads perform very well on content pages
    ─────────────────────────────────────────────────────────── */
    'product-in-article': {
      enabled: true,
      label: 'Advertisement',
      pages: ['product'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('728×90', 'In-Article — Product Page'),
    },

    /* ── PRODUCT PAGE — BELOW CONTENT ────────────────────────
       Location: Single product page, below the full article
       Size: 728×90 (Leaderboard)
       HTML attribute: data-ad-slot="product-below"
    ─────────────────────────────────────────────────────────── */
    'product-below': {
      enabled: true,
      label: 'Advertisement',
      pages: ['product'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('728×90', 'Below Content — Product Page'),
    },

    /* ── CATEGORY PAGE BANNER ────────────────────────────────
       Location: Category archive pages, top of content area
       Size: 728×90 (Leaderboard)
       HTML attribute: data-ad-slot="category-banner"
    ─────────────────────────────────────────────────────────── */
    'category-banner': {
      enabled: true,
      label: 'Advertisement',
      pages: ['category'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('728×90', 'Top Banner — Category Page'),
    },

    /* ── CATEGORY PAGE MID BANNER ────────────────────────────
       Location: Category archive pages, mid-content area
       Size: 728×90 (Leaderboard)
       HTML attribute: data-ad-slot="category-mid"
    ─────────────────────────────────────────────────────────── */
    'category-mid': {
      enabled: true,
      label: 'Advertisement',
      pages: ['category'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('728×90', 'Mid Banner — Category Page'),
    },

    /* ── THANK YOU PAGE BANNER ───────────────────────────────
       Location: Thank You / Download confirmation page
       Size: 300×90 (custom)
       HTML attribute: data-ad-slot="thankyou-banner"
       TIP: This placement converts well for affiliate offers
    ─────────────────────────────────────────────────────────── */
    'thankyou-banner': {
      enabled: true,
      label: 'Advertisement',
      pages: ['thankyou'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('300×90', 'Thank You Page Banner'),
    },

    /* ── CONTACT PAGE BANNER ─────────────────────────────────
       Location: Contact page, below the form
       Size: 728×90 (Leaderboard)
       HTML attribute: data-ad-slot="contact-banner"
    ─────────────────────────────────────────────────────────── */
    'contact-banner': {
      enabled: true,
      label: 'Advertisement',
      pages: ['contact'],
      // ↓ REPLACE THIS with your ad code ↓
      code: DEV27_ADS_PLACEHOLDER('728×90', 'Below Form — Contact Page'),
    },

  },

  /* ==========================================================
     RENDER ENGINE — do not edit below unless customizing
     ========================================================== */

  init() {
    const currentPage = document.body.dataset.page || '';
    const containers = document.querySelectorAll('[data-ad-slot]');

    containers.forEach(container => {
      const slotName = container.dataset.adSlot;
      const slot = this.slots[slotName];

      if (!slot) {
        container.style.display = 'none';
        return;
      }

      // Respect the enabled flag
      if (!slot.enabled) {
        container.style.display = 'none';
        return;
      }

      // Respect page targeting (empty array = all pages)
      if (slot.pages && slot.pages.length > 0 && !slot.pages.includes(currentPage)) {
        container.style.display = 'none';
        return;
      }

      // Inject the ad HTML
      container.innerHTML = `
        <span class="ad-label">${slot.label || 'Advertisement'}</span>
        ${slot.code}
      `;
    });
  },

  /* Helper: load Google AdSense script globally (call once)
     Usage: DEV27_ADS.loadAdSenseScript('ca-pub-XXXXXXXXXXXXXXXX');
  */
  loadAdSenseScript(publisherId) {
    if (document.querySelector('script[data-adsense]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.crossOrigin = 'anonymous';
    script.dataset.adsense = '1';
    document.head.appendChild(script);
  },

};


/* ==========================================================
   PLACEHOLDER RENDERER
   ──────────────────────────────────────────────────────────
   Generates the "Ad placeholder" block shown before you add
   real ad code. You do NOT need to edit this function.
   ========================================================== */
function DEV27_ADS_PLACEHOLDER(size, label) {
  return `
    <div class="ad-inner">
      <div class="ad-placeholder-icon"><i class="fa-solid fa-rectangle-ad"></i></div>
      <div class="ad-placeholder-text">${size} — ${label}</div>
    </div>
  `;
}


/* Boot: run as soon as DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DEV27_ADS.init());
} else {
  DEV27_ADS.init();
}
