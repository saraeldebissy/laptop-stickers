// notification.js

// Windows XP Startup → Critical Stop
try {
  const startup = new Audio(chrome.runtime.getURL('sounds/startup.wav'));
  startup.volume = 0.7;
  startup.onended = () => {
    const stop = new Audio(chrome.runtime.getURL('sounds/critical-stop.wav'));
    stop.volume = 0.7;
    stop.play().catch(() => {});
  };
  startup.play().catch(() => {});
} catch (e) {}

function dismissAll(e) {
  if (e) e.stopPropagation();
  window.close();
}

// ── Random window placement ──
// Each dialog is ~360px wide × ~165px tall
const DW = 360, DH = 165, MARGIN = 30;

function randPos() {
  const maxX = Math.max(MARGIN, window.innerWidth  - DW - MARGIN);
  const maxY = Math.max(MARGIN, window.innerHeight - DH - MARGIN);
  return {
    left: Math.round(MARGIN + Math.random() * (maxX - MARGIN)),
    top:  Math.round(MARGIN + Math.random() * (maxY - MARGIN))
  };
}

function place(el, left, top) {
  el.style.left = left + 'px';
  el.style.top  = top  + 'px';
}

// win-1 and win-2 — fully independent random spots
const p1 = randPos(), p2 = randPos();
place(document.querySelector('.win-1'), p1.left, p1.top);
place(document.querySelector('.win-2'), p2.left, p2.top);

// win-3 cascade — random base for the frontmost (win-3a), rest step back 14px each
const base = randPos();
const STEP = 14;
['.win-3e', '.win-3d', '.win-3c', '.win-3b', '.win-3a'].forEach((sel, i) => {
  const offset = (4 - i) * STEP; // e=56, d=42, c=28, b=14, a=0
  place(document.querySelector(sel), base.left + offset, base.top + offset);
});

// Wire up all dismiss buttons
document.querySelectorAll('.xp-close, .xp-action').forEach(btn => {
  btn.addEventListener('click', dismissAll);
});

// Click anywhere on the desktop backdrop closes everything
document.getElementById('overlay').addEventListener('click', () => {
  window.close();
});
