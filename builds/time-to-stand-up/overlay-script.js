// overlay-script.js — injected into the active tab

(function () {
  const HOST_ID = '__standup-overlay-host__';
  if (document.getElementById(HOST_ID)) return;

  // ── Windows XP Startup → Critical Stop (sequential) ──
  try {
    const startup = new Audio(chrome.runtime.getURL('sounds/startup.wav'));
    startup.volume = 0.7;
    startup.onended = () => {
      const stop = new Audio(chrome.runtime.getURL('sounds/critical-stop.wav'));
      stop.volume = 0.7;
      stop.play().catch(() => {});
    };
    startup.play().catch(() => {});
  } catch (e) { /* fail silently */ }

  // ── Build shadow host ──
  const host = document.createElement('div');
  host.id = HOST_ID;
  Object.assign(host.style, {
    position: 'fixed',
    top: '0', left: '0', right: '0', bottom: '0',
    zIndex: '2147483647',
    pointerEvents: 'all',
  });

  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      #overlay {
        position: fixed;
        inset: 0;
        overflow: hidden;
        cursor: default;
        background: #5a90d0; /* fallback while image loads */
        background-size: cover;
        background-position: center;
        font-family: Tahoma, 'MS Sans Serif', Arial, sans-serif;
      }

      /* ── XP window ── */
      .xp-window {
        position: absolute;
        width: 360px;
        background: #ECE9D8;
        border: 3px solid #0A246A;
        box-shadow:
          inset 0 0 0 1px #FFFFFF,
          6px 6px 20px rgba(0,0,0,0.55);
        animation: xpPop 0.26s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      }

      @keyframes xpPop {
        from { transform: scale(0.8); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
      }

      /* Cascade — each offset 28px right + down. Later in DOM = higher z = frontmost. */
      .win-1 { top: 8%;                    left: 14%;                    animation-delay: 0s;    }
      .win-2 { top: calc(8%  + 28px);      left: calc(14% + 28px);      animation-delay: 0.11s; }
      .win-3 { top: calc(8%  + 56px);      left: calc(14% + 56px);      animation-delay: 0.22s; }
      .win-4 { top: calc(8%  + 84px);      left: calc(14% + 84px);      animation-delay: 0.33s; }

      /* ── Title bar ── */
      .xp-titlebar {
        height: 28px;
        background: linear-gradient(180deg,
          #5AAEF0 0%, #3C87E0 4%, #2369D4 10%,
          #1658C8 50%, #1D5EC8 88%, #4590E2 100%
        );
        display: flex;
        align-items: center;
        padding: 0 3px 0 6px;
        gap: 5px;
        user-select: none;
      }

      .xp-tb-title {
        flex: 1;
        color: #fff;
        font-size: 12px;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0,0,40,0.7);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .xp-btn-group { display: flex; gap: 2px; flex-shrink: 0; }

      .xp-btn {
        width: 21px; height: 21px;
        font-size: 10px;
        font-family: Tahoma, Arial, sans-serif;
        font-weight: bold;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        border-radius: 3px;
      }

      .xp-min, .xp-max {
        background: linear-gradient(180deg, #F0EEEA 0%, #D8D4CC 50%, #C8C4BC 100%);
        border: 1px solid #8A8680;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
        color: #222;
      }

      .xp-close {
        background: linear-gradient(180deg, #EE7060 0%, #CC3028 45%, #B82820 100%);
        border: 1px solid #8A1010;
        box-shadow: inset 0 1px 0 rgba(255,200,200,0.35);
        color: #fff;
        font-size: 11px;
        text-shadow: 0 1px 1px rgba(0,0,0,0.4);
      }
      .xp-close:hover {
        background: linear-gradient(180deg, #F08070 0%, #DD4038 45%, #CC3030 100%);
      }

      /* ── Body ── */
      .xp-body {
        padding: 14px 16px 10px;
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .xp-icon { font-size: 36px; flex-shrink: 0; line-height: 1; }
      .xp-text { flex: 1; }

      .xp-heading {
        font-size: 13px;
        font-weight: bold;
        color: #000;
        margin-bottom: 5px;
      }

      .xp-sub {
        font-size: 11px;
        color: #333;
        line-height: 1.55;
      }

      /* ── Footer ── */
      .xp-rule { height: 1px; background: #AEA899; margin: 0 2px; }

      .xp-footer {
        background: #D4D0C8;
        padding: 7px 12px;
        display: flex;
        justify-content: center;
        gap: 6px;
        border-top: 1px solid #fff;
      }

      .xp-action {
        min-width: 75px;
        height: 23px;
        padding: 0 14px;
        font-size: 11px;
        font-family: Tahoma, Arial, sans-serif;
        cursor: pointer;
        background: linear-gradient(180deg, #FEFEFE 0%, #F0EDE6 50%, #E2DED6 100%);
        border: 1px solid #707070;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.1);
        color: #000;
        border-radius: 3px;
      }
      .xp-action:hover {
        background: linear-gradient(180deg, #EEF2FF 0%, #C8D4F8 50%, #B8C8F0 100%);
        border-color: #316AC5;
      }
      .xp-action:active {
        background: linear-gradient(180deg, #C8D0EC 0%, #B8C4E8 100%);
      }
      .xp-action.ok {
        border-color: #316AC5;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.9),
          0 0 0 1px #316AC5,
          0 1px 2px rgba(0,0,0,0.1);
      }
    </style>

    <div id="overlay">

      <!-- Window 1 (backmost) -->
      <div class="xp-window win-1">
        <div class="xp-titlebar">
          <span class="xp-tb-title">⚠️  Time to Stand Up</span>
          <div class="xp-btn-group">
            <button class="xp-btn xp-min">&#x2013;</button>
            <button class="xp-btn xp-max">&#x25A1;</button>
            <button class="xp-btn xp-close dismiss">&#x2715;</button>
          </div>
        </div>
        <div class="xp-body">
          <span class="xp-icon">🧍</span>
          <div class="xp-text">
            <p class="xp-heading">Time to Stand Up!</p>
            <p class="xp-sub">You have been sitting for too long.<br>Stand up and stretch your legs.</p>
          </div>
        </div>
        <div class="xp-rule"></div>
        <div class="xp-footer">
          <button class="xp-action ok dismiss">OK</button>
          <button class="xp-action dismiss">Snooze</button>
        </div>
      </div>

      <!-- Window 2 -->
      <div class="xp-window win-2">
        <div class="xp-titlebar">
          <span class="xp-tb-title">💻  Break Reminder</span>
          <div class="xp-btn-group">
            <button class="xp-btn xp-min">&#x2013;</button>
            <button class="xp-btn xp-max">&#x25A1;</button>
            <button class="xp-btn xp-close dismiss">&#x2715;</button>
          </div>
        </div>
        <div class="xp-body">
          <span class="xp-icon">☕</span>
          <div class="xp-text">
            <p class="xp-heading">Take a Break!</p>
            <p class="xp-sub">Step away from your screen.<br>Your body will thank you.</p>
          </div>
        </div>
        <div class="xp-rule"></div>
        <div class="xp-footer">
          <button class="xp-action ok dismiss">OK</button>
        </div>
      </div>

      <!-- Window 3 -->
      <div class="xp-window win-3">
        <div class="xp-titlebar">
          <span class="xp-tb-title">🔔  Windows — Stand Up Reminder</span>
          <div class="xp-btn-group">
            <button class="xp-btn xp-min">&#x2013;</button>
            <button class="xp-btn xp-max">&#x25A1;</button>
            <button class="xp-btn xp-close dismiss">&#x2715;</button>
          </div>
        </div>
        <div class="xp-body">
          <span class="xp-icon">🏃</span>
          <div class="xp-text">
            <p class="xp-heading">Get up and move!</p>
            <p class="xp-sub">Sitting all day is bad for you.<br>Even a 2 minute walk helps.</p>
          </div>
        </div>
        <div class="xp-rule"></div>
        <div class="xp-footer">
          <button class="xp-action ok dismiss">OK</button>
          <button class="xp-action dismiss">Cancel</button>
        </div>
      </div>

      <!-- Window 4 (frontmost) -->
      <div class="xp-window win-4">
        <div class="xp-titlebar">
          <span class="xp-tb-title">⚠️  System Alert — Stand Up Now</span>
          <div class="xp-btn-group">
            <button class="xp-btn xp-min">&#x2013;</button>
            <button class="xp-btn xp-max">&#x25A1;</button>
            <button class="xp-btn xp-close dismiss">&#x2715;</button>
          </div>
        </div>
        <div class="xp-body">
          <span class="xp-icon">⚠️</span>
          <div class="xp-text">
            <p class="xp-heading">Stand Up Now!</p>
            <p class="xp-sub">Click anywhere to dismiss all windows.</p>
          </div>
        </div>
        <div class="xp-rule"></div>
        <div class="xp-footer">
          <button class="xp-action ok dismiss">OK</button>
          <button class="xp-action dismiss">Remind me later</button>
        </div>
      </div>

    </div>
  `;

  const overlay = shadow.getElementById('overlay');
  // Set real Bliss background — URL is only known at runtime (contains the extension ID)
  overlay.style.backgroundImage = `url("${chrome.runtime.getURL('images/bliss.png')}")`;

  // Dismiss buttons stop propagation then close
  shadow.querySelectorAll('.dismiss').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      host.remove();
    });
  });

  // Click anywhere on the backdrop closes everything
  overlay.addEventListener('click', () => host.remove());

  document.documentElement.appendChild(host);
})();
