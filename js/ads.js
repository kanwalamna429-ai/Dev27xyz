/* ============================================================
   DEV27 — Centralized Ads Manager  (js/ads.js)
   ============================================================ */

const AD1 = `<script>atOptions={'key':'58e4edf527b00c2c5b4c54dc6a0da29d','format':'iframe','height':90,'width':728,'params':{}};<\/script><script src="https://www.highperformanceformat.com/58e4edf527b00c2c5b4c54dc6a0da29d/invoke.js"><\/script>`;
const AD2 = `<script>atOptions={'key':'678e6675a80a24787923840118e09116','format':'iframe','height':250,'width':300,'params':{}};<\/script><script src="https://www.highperformanceformat.com/678e6675a80a24787923840118e09116/invoke.js"><\/script>`;

const DEV27_ADS = {

  slots: {
    'banner-top':           { enabled: true, label: 'Advertisement', pages: ['home'],                              code: AD1 },
    'banner-mid':           { enabled: true, label: 'Advertisement', pages: ['home'],                              code: AD1 },
    'sidebar-top':          { enabled: true, label: 'Sponsored',     pages: ['home','product','category','thankyou'], code: AD2 },
    'sidebar-bottom':       { enabled: true, label: 'Sponsored',     pages: ['home','product','category','thankyou'], code: AD2 },
    'product-above':        { enabled: true, label: 'Advertisement', pages: ['product'],                           code: AD1 },
    'product-in-article':   { enabled: true, label: 'Advertisement', pages: ['product'],                           code: AD1 },
    'product-in-article-2': { enabled: true, label: 'Advertisement', pages: ['product'],                           code: AD1 },
    'product-in-article-3': { enabled: true, label: 'Advertisement', pages: ['product'],                           code: AD1 },
    'product-below':        { enabled: true, label: 'Advertisement', pages: ['product'],                           code: AD1 },
    'category-banner':      { enabled: true, label: 'Advertisement', pages: ['category'],                          code: AD1 },
    'category-mid':         { enabled: true, label: 'Advertisement', pages: ['category'],                          code: AD1 },
    'thankyou-above':       { enabled: true, label: 'Advertisement', pages: ['thankyou'],                          code: AD1 },
    'thankyou-banner':      { enabled: true, label: 'Advertisement', pages: ['thankyou'],                          code: AD2 },
    'thankyou-below':       { enabled: true, label: 'Advertisement', pages: ['thankyou'],                          code: AD1 },
    'contact-banner':       { enabled: true, label: 'Advertisement', pages: ['contact'],                           code: AD1 },
  },

  init() {
    const currentPage = document.body.dataset.page || '';
    const containers = document.querySelectorAll('[data-ad-slot]');

    containers.forEach(container => {
      const slotName = container.dataset.adSlot;
      const slot = this.slots[slotName];

      if (!slot || !slot.enabled) { container.style.display = 'none'; return; }
      if (slot.pages.length > 0 && !slot.pages.includes(currentPage)) { container.style.display = 'none'; return; }

      const label = document.createElement('span');
      label.className = 'ad-label';
      label.textContent = slot.label || 'Advertisement';
      container.appendChild(label);

      this.injectCode(container, slot.code);
    });
  },

  injectCode(container, htmlString) {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlString;

    Array.from(tmp.childNodes).forEach(node => {
      if (node.nodeName === 'SCRIPT') {
        const s = document.createElement('script');
        if (node.src) { s.src = node.src; s.async = true; }
        else { s.textContent = node.textContent; }
        container.appendChild(s);
      } else {
        container.appendChild(node.cloneNode(true));
      }
    });
  },

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DEV27_ADS.init());
} else {
  DEV27_ADS.init();
}
