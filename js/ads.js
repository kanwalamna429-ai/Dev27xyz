/* ============================================================
   DEV27 — Centralized Ads Manager  (js/ads.js)
   Each slot renders inside an isolated srcdoc iframe so that
   the ad network's document.write() calls work correctly and
   multiple slots on the same page don't clobber each other.
   ============================================================ */

const AD1_KEY = '58e4edf527b00c2c5b4c54dc6a0da29d'; // 728×90
const AD2_KEY = '678e6675a80a24787923840118e09116'; // 300×250

function makeAdHTML(key, w, h) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;overflow:hidden}body{background:transparent}</style></head><body>` +
    `<script>atOptions={'key':'${key}','format':'iframe','height':${h},'width':${w},'params':{}};` +
    `document.write('<sc'+'ript src="https://www.highperformanceformat.com/${key}/invoke.js"><\\/sc'+'ript>');<\/script>` +
    `</body></html>`;
}

const DEV27_ADS = {

  slots: {
    'banner-top':           { enabled: true, label: 'Advertisement', pages: ['home'],                                 key: AD1_KEY, w: 728, h: 90  },
    'banner-mid':           { enabled: true, label: 'Advertisement', pages: ['home'],                                 key: AD1_KEY, w: 728, h: 90  },
    'sidebar-top':          { enabled: true, label: 'Sponsored',     pages: ['home','product','category','thankyou'], key: AD2_KEY, w: 300, h: 250 },
    'sidebar-bottom':       { enabled: true, label: 'Sponsored',     pages: ['home','product','category','thankyou'], key: AD2_KEY, w: 300, h: 250 },
    'product-above':        { enabled: true, label: 'Advertisement', pages: ['product'],                              key: AD1_KEY, w: 728, h: 90  },
    'product-in-article':   { enabled: true, label: 'Advertisement', pages: ['product'],                              key: AD1_KEY, w: 728, h: 90  },
    'product-in-article-2': { enabled: true, label: 'Advertisement', pages: ['product'],                              key: AD1_KEY, w: 728, h: 90  },
    'product-in-article-3': { enabled: true, label: 'Advertisement', pages: ['product'],                              key: AD1_KEY, w: 728, h: 90  },
    'product-below':        { enabled: true, label: 'Advertisement', pages: ['product'],                              key: AD1_KEY, w: 728, h: 90  },
    'category-banner':      { enabled: true, label: 'Advertisement', pages: ['category'],                             key: AD1_KEY, w: 728, h: 90  },
    'category-mid':         { enabled: true, label: 'Advertisement', pages: ['category'],                             key: AD1_KEY, w: 728, h: 90  },
    'thankyou-above':       { enabled: true, label: 'Advertisement', pages: ['thankyou'],                             key: AD1_KEY, w: 728, h: 90  },
    'thankyou-banner':      { enabled: true, label: 'Advertisement', pages: ['thankyou'],                             key: AD2_KEY, w: 300, h: 250 },
    'thankyou-below':       { enabled: true, label: 'Advertisement', pages: ['thankyou'],                             key: AD1_KEY, w: 728, h: 90  },
    'contact-banner':       { enabled: true, label: 'Advertisement', pages: ['contact'],                              key: AD1_KEY, w: 728, h: 90  },
  },

  init() {
    const currentPage = document.body.dataset.page || '';
    document.querySelectorAll('[data-ad-slot]').forEach(container => {
      const slotName = container.dataset.adSlot;
      const slot = this.slots[slotName];

      if (!slot || !slot.enabled) { container.style.display = 'none'; return; }
      if (slot.pages.length > 0 && !slot.pages.includes(currentPage)) { container.style.display = 'none'; return; }

      this.renderSlot(container, slot);
    });
  },

  renderSlot(container, slot) {
    const label = document.createElement('span');
    label.className = 'ad-label';
    label.textContent = slot.label || 'Advertisement';

    const iframe = document.createElement('iframe');
    iframe.width       = slot.w;
    iframe.height      = slot.h;
    iframe.frameBorder = '0';
    iframe.scrolling   = 'no';
    iframe.marginWidth  = '0';
    iframe.marginHeight = '0';
    iframe.style.cssText = 'display:block;border:0;max-width:100%';
    iframe.srcdoc = makeAdHTML(slot.key, slot.w, slot.h);

    container.style.minHeight = slot.h + 'px';
    container.style.display   = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    container.appendChild(label);
    container.appendChild(iframe);
  },
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DEV27_ADS.init());
} else {
  DEV27_ADS.init();
}
