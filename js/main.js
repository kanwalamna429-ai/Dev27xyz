/* ============================================
   DEV27 — Main JavaScript
   ============================================ */

const DEV27 = {
  products: [],
  currentPage: 1,
  perPage: 8,
  currentFilter: 'all',
  currentCategory: 'all',

  async init() {
    await this.loadProducts();
    this.initSearch();
    this.initNav();
    this.initScrollTop();
    this.initPageRouter();
  },

  async loadProducts() {
    try {
      const res = await fetch('data/products.json');
      const data = await res.json();
      this.products = data.products;
      this.stats = data.stats;
    } catch (e) {
      console.error('Failed to load products:', e);
      this.products = [];
      this.stats = { totalDownloads: 0, totalProducts: 0 };
    }
  },

  initPageRouter() {
    const page = document.body.dataset.page;
    if (page === 'home') this.initHome();
    else if (page === 'product') this.initProduct();
    else if (page === 'thankyou') this.initThankYou();
    else if (page === 'category') this.initCategory();
    else if (page === 'contact') this.initContact();
    else if (page === 'about') this.initAbout();
  },

  /* ========= SEARCH ========= */
  initSearch() {
    const overlay = document.getElementById('searchOverlay');
    const field = document.getElementById('searchField');
    const triggers = document.querySelectorAll('.search-trigger');
    const closeBtn = document.getElementById('searchClose');
    if (!overlay) return;

    const open = () => {
      overlay.classList.add('active');
      setTimeout(() => field && field.focus(), 100);
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (field) field.value = '';
      this.renderSearchResults([]);
    };

    triggers.forEach(t => t.addEventListener('click', open));
    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    document.addEventListener('keydown', e => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault(); open();
      }
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });

    if (field) {
      field.addEventListener('input', () => {
        const q = field.value.trim().toLowerCase();
        if (!q) { this.renderSearchResults([]); return; }
        const results = this.products.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          (p.tags || []).some(t => t.toLowerCase().includes(q))
        ).slice(0, 6);
        this.renderSearchResults(results, q);
      });
    }
  },

  renderSearchResults(results, q = '') {
    const container = document.getElementById('searchResults');
    if (!container) return;
    if (!results.length && !q) { container.innerHTML = ''; return; }
    if (!results.length) {
      container.innerHTML = `<div class="search-no-results"><i class="fa-solid fa-magnifying-glass" style="margin-bottom:8px;font-size:24px;display:block;"></i>No results for "<strong>${q}</strong>"</div>`;
      return;
    }
    container.innerHTML = results.map(p => `
      <a href="product.html?id=${p.id}" class="search-result-item">
        <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
        <div class="search-result-info">
          <h4>${p.title}</h4>
          <span>${p.categoryLabel} &bull; ${this.fmt(p.downloads)} downloads</span>
        </div>
      </a>
    `).join('');
  },

  /* ========= NAV ========= */
  initNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    const page = window.location.pathname;

    const openNav = () => {
      mobileNav && mobileNav.classList.add('open');
      mobileOverlay && mobileOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };
    const closeNav = () => {
      mobileNav && mobileNav.classList.remove('open');
      mobileOverlay && mobileOverlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    hamburger && hamburger.addEventListener('click', openNav);
    mobileClose && mobileClose.addEventListener('click', closeNav);
    mobileOverlay && mobileOverlay.addEventListener('click', closeNav);

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (page.includes(href) && href !== '#') link.classList.add('active');
    });
  },

  /* ========= SCROLL TOP ========= */
  initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  },

  /* ========= HOME ========= */
  initHome() {
    this.renderFooterStats();
    this.renderProductGrid();
    this.renderPopularProducts();
    this.initFilters();
    this.initNewsletter();
    this.updateGridStats();
  },

  renderProductGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    const filtered = this.getFiltered();
    const start = (this.currentPage - 1) * this.perPage;
    const page = filtered.slice(start, start + this.perPage);

    if (!page.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon"><i class="fa-solid fa-box-open"></i></div>
        <h3>No products found</h3>
        <p>Try a different filter or check back later.</p>
      </div>`;
    } else {
      grid.innerHTML = page.map((p, i) => this.cardHTML(p, i)).join('');
    }
    this.renderPagination(filtered.length);
    this.updateGridStats(filtered.length);
  },

  cardHTML(p, i) {
    return `
    <article class="product-card animate-in" style="animation-delay:${i * 0.07}s">
      <a href="product.html?id=${p.id}" class="card-link" aria-label="${p.title}"></a>
      <div class="card-thumb">
        <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
        <span class="card-cat"><span class="badge badge-primary"><i class="fa-solid fa-tag" style="font-size:9px"></i> ${p.categoryLabel}</span></span>
        ${p.popular ? '<span style="position:absolute;top:10px;right:10px"><span class="badge badge-green"><i class="fa-solid fa-fire" style="font-size:9px"></i> Popular</span></span>' : ''}
      </div>
      <div class="card-body">
        <h2 class="card-title">${p.title}</h2>
        <div class="card-meta">
          <div class="card-author">
            <div class="card-author-avatar"><i class="fa-solid fa-code"></i></div>
            <span>${p.developer}</span>
          </div>
          <div class="card-downloads">
            <i class="fa-solid fa-download"></i>
            ${this.fmt(p.downloads)}
          </div>
        </div>
      </div>
    </article>`;
  },

  getFiltered() {
    return this.products.filter(p => {
      if (this.currentFilter === 'all' && this.currentCategory === 'all') return true;
      if (this.currentCategory !== 'all') return p.category === this.currentCategory;
      if (this.currentFilter === 'popular') return p.popular;
      return true;
    });
  },

  updateGridStats(count) {
    const el = document.getElementById('gridCount');
    const total = count !== undefined ? count : this.products.length;
    if (el) el.textContent = `${total} template${total !== 1 ? 's' : ''}`;
  },

  initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter || 'all';
        this.currentCategory = btn.dataset.cat || 'all';
        this.currentPage = 1;
        this.renderProductGrid();
      });
    });
  },

  renderPagination(total) {
    const container = document.getElementById('pagination');
    if (!container) return;
    const pages = Math.ceil(total / this.perPage);
    if (pages <= 1) { container.innerHTML = ''; return; }

    let html = `<button class="page-btn prev-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="DEV27.goPage(${this.currentPage - 1})">
      <i class="fa-solid fa-chevron-left"></i> Prev
    </button>`;

    for (let i = 1; i <= pages; i++) {
      if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - this.currentPage) > 1) {
        if (i === 3 || i === pages - 2) html += `<span class="page-btn" style="border:none;cursor:default">…</span>`;
        continue;
      }
      html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="DEV27.goPage(${i})">${i}</button>`;
    }

    html += `<button class="page-btn next-btn" ${this.currentPage === pages ? 'disabled' : ''} onclick="DEV27.goPage(${this.currentPage + 1})">
      Next <i class="fa-solid fa-chevron-right"></i>
    </button>`;

    container.innerHTML = html;
  },

  goPage(p) {
    this.currentPage = p;
    this.renderProductGrid();
    document.getElementById('productsGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  renderPopularProducts() {
    const container = document.getElementById('popularList');
    if (!container) return;
    const popular = this.products.filter(p => p.popular).slice(0, 5);
    container.innerHTML = popular.map(p => `
      <a href="product.html?id=${p.id}" class="popular-item">
        <img class="popular-thumb" src="${p.thumbnail}" alt="${p.title}" loading="lazy">
        <div class="popular-info">
          <div class="popular-title">${p.title}</div>
          <div class="popular-meta"><i class="fa-solid fa-download"></i>${this.fmt(p.downloads)} downloads</div>
        </div>
      </a>
    `).join('');
  },

  renderFooterStats() {
    const s = this.stats;
    document.querySelectorAll('[data-stat="downloads"]').forEach(el => {
      el.innerHTML = this.fmt(s.totalDownloads) + '<span>+</span>';
    });
    document.querySelectorAll('[data-stat="products"]').forEach(el => {
      el.textContent = s.totalProducts + '+';
    });
  },

  initNewsletter() {
    document.querySelectorAll('.newsletter-form, .footer-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input || !input.value) return;
        const success = form.closest('.widget-body')?.querySelector('.newsletter-success') ||
                        form.parentElement?.querySelector('.newsletter-success');
        if (success) { success.style.display = 'block'; }
        form.style.display = 'none';
      });
    });
  },

  /* ========= CATEGORY ========= */
  initCategory() {
    this.renderFooterStats();
    this.renderPopularProducts();
    this.initNewsletter();

    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('cat') || 'all';
    this.currentCategory = cat;

    const catInfo = {
      'html-templates': { label: 'HTML Templates', icon: 'fa-code', desc: 'Professional HTML templates for websites, portfolios, and web apps.' },
      'coming-soon': { label: 'Coming Soon Pages', icon: 'fa-clock', desc: 'Beautiful countdown and coming soon templates for your upcoming projects.' },
      'landing-page': { label: 'Landing Pages', icon: 'fa-rocket', desc: 'High-converting landing page templates for products and startups.' },
      'email-templates': { label: 'Email Templates', icon: 'fa-envelope', desc: 'Professional HTML email templates compatible with all major email clients.' },
    };

    const info = catInfo[cat] || { label: 'All Products', icon: 'fa-grid-2', desc: 'Browse all free developer templates and themes.' };
    const iconEl = document.getElementById('catIcon');
    const titleEl = document.getElementById('catTitle');
    const descEl = document.getElementById('catDesc');

    if (iconEl) iconEl.innerHTML = `<i class="fa-solid ${info.icon}"></i>`;
    if (titleEl) titleEl.textContent = info.label;
    if (descEl) descEl.textContent = info.desc;

    this.renderProductGrid();
  },

  /* ========= SINGLE PRODUCT ========= */
  initProduct() {
    this.renderFooterStats();
    this.renderPopularProducts();
    this.initNewsletter();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const product = this.products.find(p => p.id === id || p.slug === id);

    if (!product) {
      document.getElementById('productContent')?.insertAdjacentHTML('afterbegin',
        '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-file-circle-xmark"></i></div><h3>Product not found</h3><p><a href="index.html" style="color:var(--primary)">Go back home</a></p></div>');
      return;
    }

    document.title = `${product.title} — Dev27`;

    const pageUrl = `https://dev27.xyz/product.html?id=${product.slug}`;
    const ogImage = `https://dev27.xyz/${product.featuredImage}`;
    const setMeta = (sel, val) => { const el = document.querySelector(sel); if (el) el.setAttribute('content', val); };
    setMeta('meta[property="og:url"]', pageUrl);
    setMeta('meta[property="og:title"]', `${product.title} — Dev27`);
    setMeta('meta[property="og:description"]', product.description);
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[name="twitter:title"]', `${product.title} — Dev27`);
    setMeta('meta[name="twitter:description"]', product.description);
    setMeta('meta[name="twitter:image"]', ogImage);
    setMeta('meta[name="description"]', product.description);

    const featImg = document.getElementById('featuredImage');
    if (featImg) featImg.src = product.featuredImage;

    document.querySelectorAll('[data-product="title"]').forEach(el => el.textContent = product.title);
    document.querySelectorAll('[data-product="cat"]').forEach(el => el.textContent = product.categoryLabel);
    document.querySelectorAll('[data-product="version"]').forEach(el => el.textContent = product.version);
    document.querySelectorAll('[data-product="fileSize"]').forEach(el => el.textContent = product.fileSize);
    document.querySelectorAll('[data-product="fileType"]').forEach(el => el.textContent = product.fileType);
    document.querySelectorAll('[data-product="downloads"]').forEach(el => el.textContent = this.fmt(product.downloads));
    document.querySelectorAll('[data-product="date"]').forEach(el => el.textContent = this.fmtDate(product.date));
    document.querySelectorAll('[data-product="desc"]').forEach(el => el.textContent = product.description);
    document.querySelectorAll('[data-product="breadcrumb"]').forEach(el => el.textContent = product.title);

    const featList = document.getElementById('featureList');
    if (featList && product.features) {
      featList.innerHTML = product.features.map(f =>
        `<div class="feature-item"><i class="fa-solid fa-circle-check"></i>${f}</div>`
      ).join('');
    }

    const tagsList = document.getElementById('tagsList');
    if (tagsList && product.tags) {
      tagsList.innerHTML = product.tags.map(t => `<span class="tag">${t}</span>`).join('');
    }

    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) previewBtn.href = product.livePreview;

    const jumpBtn = document.getElementById('jumpBtn');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('downloadSection')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.handleDownload(product);
      });
    });

    const sectionTitle = document.getElementById('downloadTitle');
    if (sectionTitle) sectionTitle.textContent = product.title;
    const sectionSize = document.getElementById('downloadSize');
    if (sectionSize) sectionSize.textContent = product.fileSize;
    const sectionType = document.getElementById('downloadType');
    if (sectionType) sectionType.textContent = product.fileType;
    const sectionVer = document.getElementById('downloadVersion');
    if (sectionVer) sectionVer.textContent = product.version;

    const thumbImg = document.getElementById('downloadThumb');
    if (thumbImg) thumbImg.src = product.thumbnail;

    document.getElementById('breadcrumbCat') && (document.getElementById('breadcrumbCat').textContent = product.categoryLabel);
    document.getElementById('breadcrumbCatLink') && (document.getElementById('breadcrumbCatLink').href = `category.html?cat=${product.category}`);
  },

  handleDownload(product) {
    localStorage.setItem('lastDownload', JSON.stringify({
      id: product.id, title: product.title, thumbnail: product.thumbnail,
      category: product.categoryLabel, fileSize: product.fileSize
    }));
    if (product.downloadFile && product.downloadFile !== '#') {
      const a = document.createElement('a');
      a.href = product.downloadFile;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.location.href = 'thank-you.html';
  },

  /* ========= THANK YOU ========= */
  initThankYou() {
    this.spawnConfetti();
    const raw = localStorage.getItem('lastDownload');
    if (!raw) return;
    try {
      const p = JSON.parse(raw);
      const imgEl = document.getElementById('tyProductImg');
      const titleEl = document.getElementById('tyProductTitle');
      const catEl = document.getElementById('tyProductCat');
      if (imgEl) imgEl.src = p.thumbnail;
      if (titleEl) titleEl.textContent = p.title;
      if (catEl) catEl.textContent = `${p.category} · ${p.fileSize}`;

      const siteUrl = 'https://dev27.xyz';
      const shareText = encodeURIComponent(`Just downloaded "${p.title}" for free from Dev27! 🔥 Get free HTML templates, landing pages & more:`);
      const shareUrl = encodeURIComponent(siteUrl);

      const xBtn = document.getElementById('shareX');
      const fbBtn = document.getElementById('shareFb');
      if (xBtn) xBtn.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
      if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    } catch(e) {}
  },

  spawnConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;
    const colors = ['#E8432D','#22C55E','#FFD166','#6BCB77','#4ECDC4','#FF6B6B','#A8DADC'];
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${Math.random() * 3 + 2}s;
        animation-delay: ${Math.random() * 2}s;
        opacity: ${Math.random() * 0.7 + 0.3};
      `;
      container.appendChild(piece);
    }
    setTimeout(() => container.innerHTML = '', 8000);
  },

  /* ========= ABOUT ========= */
  initAbout() {
    this.renderFooterStats();
  },

  /* ========= CONTACT ========= */
  initContact() {
    this.renderFooterStats();
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-send');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      await new Promise(r => setTimeout(r, 1200));

      const successMsg = document.getElementById('formSuccess');
      if (successMsg) successMsg.style.display = 'block';
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    });
  },

  /* ========= HELPERS ========= */
  fmt(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return n.toString();
  },

  fmtDate(dateStr) {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch(e) { return dateStr; }
  }
};

document.addEventListener('DOMContentLoaded', () => DEV27.init());
