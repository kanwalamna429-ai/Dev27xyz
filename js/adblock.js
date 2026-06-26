/* ============================================================
   DEV27 — Ad Blocker Detector
   Politely asks users to disable their ad blocker.
   Uses a bait-element technique (no external dependencies).
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Skip if user already chose "Continue anyway" this session
  ---------------------------------------------------------- */
  if (sessionStorage.getItem('dev27_adblock_dismissed') === '1') return;

  /* ----------------------------------------------------------
     Inject modal CSS
  ---------------------------------------------------------- */
  const style = document.createElement('style');
  style.textContent = `
    #adblock-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(10,10,20,0.82);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: abFadeIn .3s ease;
    }
    @keyframes abFadeIn { from { opacity:0 } to { opacity:1 } }

    #adblock-card {
      background: #fff;
      border-radius: 20px;
      max-width: 480px;
      width: 100%;
      padding: 40px 36px 32px;
      text-align: center;
      box-shadow: 0 32px 80px rgba(0,0,0,0.35);
      animation: abSlideUp .35s cubic-bezier(.22,1,.36,1);
    }
    @keyframes abSlideUp { from { transform:translateY(24px); opacity:0 } to { transform:none; opacity:1 } }

    #adblock-icon {
      width: 72px; height: 72px;
      background: linear-gradient(135deg,#fff0ee,#ffe4df);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      font-size: 32px;
    }
    #adblock-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: #fff0ee; color: #E8432D;
      font-size: 11px; font-weight: 700; letter-spacing: .08em;
      text-transform: uppercase; padding: 4px 12px;
      border-radius: 100px; margin-bottom: 16px;
    }
    #adblock-card h2 {
      font-size: 22px; font-weight: 800; color: #0f0f1a;
      line-height: 1.3; margin: 0 0 12px;
    }
    #adblock-card p {
      font-size: 14px; color: #555; line-height: 1.65;
      margin: 0 0 24px;
    }
    #adblock-steps {
      background: #f8f9fb;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      text-align: left;
    }
    #adblock-steps p {
      font-size: 12px; font-weight: 700; color: #0f0f1a;
      text-transform: uppercase; letter-spacing: .06em;
      margin: 0 0 10px;
    }
    #adblock-steps ol {
      margin: 0; padding-left: 18px;
      display: flex; flex-direction: column; gap: 7px;
    }
    #adblock-steps li {
      font-size: 13px; color: #444; line-height: 1.5;
    }
    #adblock-steps li strong { color: #0f0f1a; }
    #adblock-btn-primary {
      display: block; width: 100%;
      background: linear-gradient(135deg,#E8432D,#c73520);
      color: #fff; border: none; border-radius: 10px;
      padding: 14px 20px; font-size: 15px; font-weight: 700;
      cursor: pointer; margin-bottom: 10px;
      transition: opacity .2s, transform .15s;
    }
    #adblock-btn-primary:hover { opacity:.9; transform:translateY(-1px); }
    #adblock-btn-secondary {
      display: block; width: 100%;
      background: none; border: none;
      color: #999; font-size: 13px; cursor: pointer;
      padding: 6px; text-decoration: underline;
      transition: color .2s;
    }
    #adblock-btn-secondary:hover { color: #555; }
    #adblock-footer {
      margin-top: 20px;
      font-size: 11px; color: #bbb;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    #adblock-footer a { color: #E8432D; text-decoration: none; font-weight: 600; }
    @media (max-width: 480px) {
      #adblock-card { padding: 28px 20px 24px; }
      #adblock-card h2 { font-size: 19px; }
    }
  `;
  document.head.appendChild(style);

  /* ----------------------------------------------------------
     Build modal HTML
  ---------------------------------------------------------- */
  function buildModal() {
    const overlay = document.createElement('div');
    overlay.id = 'adblock-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'adblock-title');

    overlay.innerHTML = `
      <div id="adblock-card">
        <div id="adblock-icon">🙏</div>
        <div id="adblock-badge">
          <span>⚡</span> Support Dev27
        </div>
        <h2 id="adblock-title">We noticed your ad blocker is on</h2>
        <p>
          Dev27 offers <strong>100% free templates</strong> with no paywalls, no sign-ups,
          and no catches. Ads are our <em>only</em> way to keep the lights on and release
          new templates every month. Please consider whitelisting us — it takes 30 seconds
          and means the world to us. 💙
        </p>

        <div id="adblock-steps">
          <p>How to whitelist Dev27:</p>
          <ol>
            <li>Click the <strong>ad blocker icon</strong> in your browser toolbar</li>
            <li>Select <strong>"Pause on this site"</strong> or <strong>"Whitelist dev27.xyz"</strong></li>
            <li>Click <strong>"Refresh"</strong> below — ads load and you're good to go!</li>
          </ol>
        </div>

        <button id="adblock-btn-primary">
          ✅ &nbsp;I've Disabled My Ad Blocker — Refresh
        </button>
        <button id="adblock-btn-secondary">
          Continue anyway (ads help keep this site free)
        </button>

        <div id="adblock-footer">
          <span>❤️ Made with love by</span>
          <a href="https://dev27.xyz">Dev27.xyz</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('adblock-btn-primary').addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('adblock-btn-secondary').addEventListener('click', () => {
      sessionStorage.setItem('dev27_adblock_dismissed', '1');
      overlay.style.animation = 'abFadeIn .25s ease reverse forwards';
      setTimeout(() => overlay.remove(), 260);
    });
  }

  /* ----------------------------------------------------------
     Detection: bait element technique
     Ad blockers set display:none / height:0 on elements
     with class names like "adsbox", "ad-banner", etc.
  ---------------------------------------------------------- */
  function detect() {
    return new Promise(resolve => {
      const bait = document.createElement('div');
      bait.className = 'adsbox ad-banner pub_300x250 pub_300x250m textads banner-ads ad-unit';
      bait.style.cssText = 'width:1px;height:1px;position:absolute;top:-9999px;left:-9999px;opacity:0;pointer-events:none';
      document.body.appendChild(bait);

      /* Give ad blocker time to process the new node */
      setTimeout(() => {
        const cs = window.getComputedStyle(bait);
        const blocked = (
          bait.offsetHeight === 0 ||
          bait.offsetWidth  === 0 ||
          cs.display    === 'none' ||
          cs.visibility === 'hidden' ||
          cs.opacity    === '0' ||
          !bait.offsetParent
        );
        bait.remove();
        resolve(blocked);
      }, 300);
    });
  }

  /* ----------------------------------------------------------
     Run after page load
  ---------------------------------------------------------- */
  function run() {
    detect().then(blocked => {
      if (blocked) buildModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
