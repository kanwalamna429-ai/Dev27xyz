/* ============================================================
   DEV27 — GDPR Cookie Consent Banner
   Bottom-of-screen bar; remembers choice in localStorage.
   ============================================================ */

(function () {
  'use strict';

  if (localStorage.getItem('dev27_cookie_ok') === '1') return;

  /* CSS */
  const style = document.createElement('style');
  style.textContent = `
    #cc-bar {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 99990;
      background: #0f0f1a;
      border-top: 2px solid rgba(232,67,45,.5);
      padding: 14px 20px;
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
      justify-content: center;
      animation: ccSlideUp .4s cubic-bezier(.22,1,.36,1);
      font-family: 'Inter', system-ui, sans-serif;
    }
    @keyframes ccSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #cc-bar p {
      margin: 0; font-size: 13px; color: #ccc; line-height: 1.5;
      flex: 1; min-width: 200px; max-width: 680px;
    }
    #cc-bar p a { color: #E8432D; text-decoration: underline; }
    #cc-bar p strong { color: #fff; }
    #cc-actions { display: flex; gap: 8px; flex-shrink: 0; }
    #cc-accept {
      background: #E8432D; color: #fff;
      border: none; border-radius: 8px;
      padding: 9px 22px; font-size: 13px; font-weight: 700;
      cursor: pointer; transition: opacity .2s;
      white-space: nowrap;
    }
    #cc-accept:hover { opacity: .85; }
    #cc-decline {
      background: transparent; color: #888;
      border: 1.5px solid #333; border-radius: 8px;
      padding: 9px 16px; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: color .2s, border-color .2s;
      white-space: nowrap;
    }
    #cc-decline:hover { color: #ccc; border-color: #555; }
    @media (max-width: 480px) {
      #cc-bar { flex-direction: column; align-items: stretch; text-align: center; }
      #cc-actions { justify-content: center; }
    }
  `;
  document.head.appendChild(style);

  /* HTML */
  const bar = document.createElement('div');
  bar.id = 'cc-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.innerHTML = `
    <p>
      <strong>🍪 We use cookies</strong> — Dev27 uses cookies and ads to keep all templates
      <strong>100% free</strong>. By continuing to browse, you agree to our use of cookies
      for analytics and advertising.
      <a href="privacy.html" target="_blank">Privacy Policy</a>
    </p>
    <div id="cc-actions">
      <button id="cc-accept">Accept &amp; Continue</button>
      <button id="cc-decline">Decline</button>
    </div>
  `;

  function dismiss(accepted) {
    if (accepted) localStorage.setItem('dev27_cookie_ok', '1');
    else sessionStorage.setItem('dev27_cookie_dismissed', '1');
    bar.style.animation = 'ccSlideUp .3s ease reverse forwards';
    setTimeout(() => bar.remove(), 320);
  }

  /* Wait until body exists */
  function mount() {
    /* Don't show on top of the adblock modal */
    if (sessionStorage.getItem('dev27_cookie_dismissed') === '1') return;
    document.body.appendChild(bar);
    document.getElementById('cc-accept').addEventListener('click', () => dismiss(true));
    document.getElementById('cc-decline').addEventListener('click', () => dismiss(false));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
