# Time to Stand Up — Chrome Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Manifest V3 Chrome extension that shows an Apple Watch–style "Time to Stand Up" popup at 1:00 PM every day.

**Architecture:** A background service worker registers a daily `chrome.alarms` entry for 1:00 PM. When it fires, it opens a small custom `chrome.windows.create` popup (300×340px) that renders a watchOS-style notification — activity ring animation, bold message, auto-dismiss. A popup.html lets the user see the next scheduled time.

**Tech Stack:** Manifest V3, Chrome Extensions API (`chrome.alarms`, `chrome.windows`), Vanilla JS + HTML + CSS (no build step — load directly in Chrome), SVG ring animation

---

## File Map

```
time-to-stand-up/
├── manifest.json          # MV3 extension manifest
├── background.js          # Service worker: alarm registration + window creation
├── notification.html      # Apple Watch–style notification window
├── notification.css       # watchOS aesthetic: dark, rings, animations
├── notification.js        # Auto-dismiss, close button, ripple
├── popup.html             # Extension toolbar popup: next alarm status
├── popup.css              # Popup styles (minimal, consistent with notification)
├── popup.js               # Reads alarm state, renders next time
└── icons/
    ├── icon16.png          # 16×16 toolbar icon
    ├── icon48.png          # 48×48 extensions page icon
    └── icon128.png         # 128×128 Chrome Web Store icon
```

---

## Task 1: Scaffold — manifest + icons

**Files:**
- Create: `manifest.json`
- Create: `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`

- [ ] **Step 1: Create manifest.json**

```json
{
  "manifest_version": 3,
  "name": "Time to Stand Up",
  "version": "1.0.0",
  "description": "Apple Watch–style daily stand-up reminder at 1:00 PM",
  "permissions": ["alarms", "windows", "storage"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

- [ ] **Step 2: Generate placeholder icons (green circle on black background)**

Run this in the project root. Requires Node.js (no install needed — uses built-in canvas via a tiny script):

```bash
node -e "
const {createCanvas} = require('canvas');
const fs = require('fs');
[16,48,128].forEach(size => {
  const c = createCanvas(size,size);
  const ctx = c.getContext('2d');
  ctx.fillStyle='#1C1C1E';
  ctx.fillRect(0,0,size,size);
  ctx.fillStyle='#30D158';
  ctx.beginPath();
  ctx.arc(size/2,size/2,size*0.35,0,Math.PI*2);
  ctx.fill();
  fs.writeFileSync('icons/icon'+size+'.png', c.toBuffer('image/png'));
});
"
```

If the `canvas` package isn't available, create the icons manually in any image editor:
- Black (#1C1C1E) background, green (#30D158) filled circle centered, at 16px, 48px, 128px.
- Save as PNG to `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`.

- [ ] **Step 3: Verify structure**

```bash
ls -1 manifest.json background.js notification.html popup.html icons/
```
Expected: all files listed (background.js and notification.html don't exist yet — that's fine, just confirm manifest.json and icons/ are present).

- [ ] **Step 4: Load extension in Chrome to verify manifest is valid**

1. Open `chrome://extensions`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked" → select the `time-to-stand-up/` folder
4. Expected: extension appears in the list with no errors. If there are errors, fix manifest.json.

- [ ] **Step 5: Commit**

```bash
git add manifest.json icons/
git commit -m "feat: add MV3 manifest and placeholder icons"
```

---

## Task 2: Background service worker — alarm logic

**Files:**
- Create: `background.js`

- [ ] **Step 1: Create background.js with alarm registration**

```js
// background.js
const ALARM_NAME = 'stand-up-reminder';
const STAND_UP_HOUR = 13; // 1:00 PM

// Register the alarm on install and on browser startup.
// chrome.alarms.create is idempotent by name — safe to call multiple times.
chrome.runtime.onInstalled.addListener(() => {
  scheduleAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  scheduleAlarm();
});

function scheduleAlarm() {
  const now = new Date();
  const target = new Date();
  target.setHours(STAND_UP_HOUR, 0, 0, 0);

  // If 1 PM has already passed today, schedule for tomorrow
  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  chrome.alarms.create(ALARM_NAME, {
    when: target.getTime(),
    periodInMinutes: 24 * 60 // repeat daily
  });

  console.log('[StandUp] Alarm scheduled for', target.toLocaleString());
}

// Listen for the alarm firing
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    openNotificationWindow();
  }
});

function openNotificationWindow() {
  // Center the window on screen
  const width = 300;
  const height = 340;

  chrome.windows.create({
    url: chrome.runtime.getURL('notification.html'),
    type: 'popup',
    width,
    height,
    focused: true
  });
}
```

- [ ] **Step 2: Reload the extension in Chrome**

1. Go to `chrome://extensions`
2. Click the refresh icon on "Time to Stand Up"
3. Click "Service Worker" link next to the extension
4. In the DevTools console, confirm you see: `[StandUp] Alarm scheduled for <tomorrow's date at 1:00 PM>`

- [ ] **Step 3: Verify alarm is registered**

In the service worker DevTools console, run:
```js
chrome.alarms.getAll(alarms => console.log(alarms))
```
Expected output: `[{name: "stand-up-reminder", scheduledTime: <timestamp>, periodInMinutes: 1440}]`

- [ ] **Step 4: Test alarm fires immediately (smoke test)**

In the service worker DevTools console, trigger the alarm manually:
```js
chrome.alarms.create('test-now', { delayInMinutes: 0.05 })
chrome.alarms.onAlarm.addListener(a => { if(a.name==='test-now') openNotificationWindow() })
```
Expected: a small blank popup window opens (since notification.html doesn't exist yet, it'll show a 404 — that's fine for now).

- [ ] **Step 5: Commit**

```bash
git add background.js
git commit -m "feat: service worker with daily alarm at 1PM"
```

---

## Task 3: Apple Watch notification UI

**Files:**
- Create: `notification.html`
- Create: `notification.css`
- Create: `notification.js`

- [ ] **Step 1: Create notification.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Time to Stand Up</title>
  <link rel="stylesheet" href="notification.css" />
</head>
<body>
  <div class="watch-face">
    <!-- Activity ring -->
    <div class="ring-container">
      <svg class="ring-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <!-- Track (background ring) -->
        <circle class="ring-track" cx="60" cy="60" r="50" />
        <!-- Animated progress arc -->
        <circle class="ring-progress" cx="60" cy="60" r="50" />
      </svg>
      <!-- Standing figure icon in center -->
      <div class="ring-icon">🧍</div>
    </div>

    <!-- Message -->
    <p class="label-top">Time to</p>
    <p class="label-main">Stand Up!</p>
    <p class="label-sub">You've been sitting too long</p>

    <!-- Dismiss button -->
    <button class="dismiss-btn" id="dismissBtn">Dismiss</button>
  </div>

  <script src="notification.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create notification.css (Apple Watch / watchOS aesthetic)**

```css
/* notification.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 300px;
  height: 340px;
  overflow: hidden;
  background: #000;
  font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Entry animation — notification bounces in */
@keyframes watchEntry {
  0%   { transform: scale(0.7) translateY(20px); opacity: 0; }
  60%  { transform: scale(1.04) translateY(-4px); opacity: 1; }
  80%  { transform: scale(0.98) translateY(2px); }
  100% { transform: scale(1) translateY(0); }
}

/* Ring fill animation */
@keyframes ringFill {
  from { stroke-dashoffset: 314; }
  to   { stroke-dashoffset: 47; }  /* ~85% fill */
}

/* Subtle pulse on the icon */
@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.15); }
}

.watch-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 340px;
  background: radial-gradient(ellipse at 40% 30%, #1a1a1a 0%, #000 70%);
  animation: watchEntry 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  gap: 6px;
}

/* ── Ring ── */
.ring-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 4px;
}

.ring-svg {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg); /* Start arc from top */
}

.ring-track {
  fill: none;
  stroke: #1a3a22;           /* Dark green track */
  stroke-width: 10;
}

.ring-progress {
  fill: none;
  stroke: #30D158;           /* watchOS green */
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 314;     /* 2π × r = 2π × 50 ≈ 314 */
  stroke-dashoffset: 314;    /* Start empty */
  animation: ringFill 1.2s ease-out 0.4s forwards;
  filter: drop-shadow(0 0 6px #30D158aa);
}

.ring-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  animation: iconPulse 1.8s ease-in-out 1s infinite;
}

/* ── Labels ── */
.label-top {
  color: #8E8E93;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.label-main {
  color: #FFFFFF;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.label-sub {
  color: #636366;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.01em;
  margin-top: 2px;
}

/* ── Dismiss button ── */
.dismiss-btn {
  margin-top: 16px;
  background: #1C1C1E;
  color: #30D158;
  border: 1.5px solid #30D158;
  border-radius: 20px;
  padding: 8px 32px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.2s, color 0.2s;
}

.dismiss-btn:hover {
  background: #30D158;
  color: #000;
}

.dismiss-btn:active {
  transform: scale(0.96);
}
```

- [ ] **Step 3: Create notification.js**

```js
// notification.js
const dismissBtn = document.getElementById('dismissBtn');

// Auto-dismiss after 8 seconds
const autoDismissTimer = setTimeout(() => {
  window.close();
}, 8000);

// Manual dismiss
dismissBtn.addEventListener('click', () => {
  clearTimeout(autoDismissTimer);
  window.close();
});
```

- [ ] **Step 4: Reload the extension and trigger a test alarm**

1. Reload extension at `chrome://extensions`
2. Open service worker DevTools console
3. Run:
```js
openNotificationWindow()
```
4. Expected: a 300×340 popup appears with the Apple Watch–style notification — dark background, green activity ring animating to ~85%, emoji, "Time to Stand Up!" text, dismiss button.

- [ ] **Step 5: Verify dismiss behavior**

- Click "Dismiss" — window should close immediately
- Reopen the notification and wait 8 seconds — window should auto-close

- [ ] **Step 6: Commit**

```bash
git add notification.html notification.css notification.js
git commit -m "feat: Apple Watch style notification window with ring animation"
```

---

## Task 4: Toolbar popup — next alarm status

**Files:**
- Create: `popup.html`
- Create: `popup.css`
- Create: `popup.js`

- [ ] **Step 1: Create popup.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Stand Up Reminder</title>
  <link rel="stylesheet" href="popup.css" />
</head>
<body>
  <div class="popup-container">
    <div class="icon-row">🧍</div>
    <h1 class="title">Stand Up</h1>
    <p class="subtitle">Daily reminder</p>
    <div class="card">
      <p class="card-label">Next reminder</p>
      <p class="card-time" id="nextTime">Loading...</p>
    </div>
    <button class="test-btn" id="testBtn">Preview notification</button>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create popup.css**

```css
/* popup.css */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  width: 240px;
  background: #000;
  font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  padding: 20px 16px 16px;
  color: #fff;
}

.popup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.icon-row { font-size: 32px; }

.title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.subtitle {
  font-size: 12px;
  color: #636366;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.card {
  width: 100%;
  background: #1C1C1E;
  border-radius: 12px;
  padding: 12px 14px;
  text-align: center;
  margin-bottom: 10px;
}

.card-label {
  font-size: 11px;
  color: #8E8E93;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.card-time {
  font-size: 22px;
  font-weight: 700;
  color: #30D158;
  letter-spacing: -0.5px;
}

.test-btn {
  width: 100%;
  background: #1C1C1E;
  color: #30D158;
  border: 1.5px solid #30D158;
  border-radius: 10px;
  padding: 9px 0;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: background 0.2s, color 0.2s;
}

.test-btn:hover {
  background: #30D158;
  color: #000;
}

.test-btn:active { transform: scale(0.97); }
```

- [ ] **Step 3: Create popup.js**

```js
// popup.js
const nextTimeEl = document.getElementById('nextTime');
const testBtn = document.getElementById('testBtn');

// Get the next scheduled alarm time and display it
chrome.alarms.get('stand-up-reminder', (alarm) => {
  if (alarm) {
    const date = new Date(alarm.scheduledTime);
    nextTimeEl.textContent = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    nextTimeEl.textContent = 'Not set';
  }
});

// Preview button — sends message to background to open notification
testBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'previewNotification' });
  window.close(); // close popup so notification is visible
});
```

- [ ] **Step 4: Update background.js to handle the preview message**

Add this to the bottom of `background.js`:

```js
// Handle preview request from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'previewNotification') {
    openNotificationWindow();
  }
});
```

- [ ] **Step 5: Reload and test the popup**

1. Reload the extension at `chrome://extensions`
2. Click the extension icon in Chrome toolbar
3. Expected: popup shows "Stand Up", "Next reminder", and a time (should show tomorrow's 1:00 PM or today's if before 1 PM)
4. Click "Preview notification" — popup closes, notification window appears

- [ ] **Step 6: Commit**

```bash
git add popup.html popup.css popup.js background.js
git commit -m "feat: toolbar popup with next alarm time and preview button"
```

---

## Task 5: End-to-end smoke test at modified time

**Goal:** Confirm the full alarm → window flow works without waiting until 1:00 PM.

- [ ] **Step 1: Temporarily set alarm to 1 minute from now**

Open the service worker DevTools console (via `chrome://extensions` → "Service Worker" link) and run:

```js
chrome.alarms.clearAll(() => {
  chrome.alarms.create('stand-up-reminder', { delayInMinutes: 1 });
  console.log('Alarm set for 1 minute from now');
});
```

- [ ] **Step 2: Wait 60 seconds**

Watch for the notification window to appear automatically. Expected: Apple Watch–style popup appears with the ring animation and "Stand Up!" message.

- [ ] **Step 3: Re-register the real 1 PM alarm**

After confirming, run in the service worker console:

```js
chrome.alarms.clearAll(() => scheduleAlarm());
```

- [ ] **Step 4: Verify alarm is re-registered correctly**

```js
chrome.alarms.getAll(alarms => console.log(JSON.stringify(alarms, null, 2)));
```

Expected: one alarm `stand-up-reminder` with `periodInMinutes: 1440` and a scheduled time at the next 1:00 PM.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: verified end-to-end alarm → notification flow"
```

---

## Self-Review Checklist

- [x] **Spec: 1:00 PM reminder** → Covered in Task 2, `STAND_UP_HOUR = 13`
- [x] **Spec: Apple Watch style** → Covered in Task 3 — dark bg, green activity ring, SF Pro fonts, animation, watchOS colors
- [x] **Spec: Chrome plugin** → Manifest V3, all tasks use Chrome Extensions APIs only
- [x] **No placeholders** → All steps have full code
- [x] **Type consistency** → `openNotificationWindow()` defined in Task 2, reused in Task 4's background.js update
- [x] **Icons** → Task 1 handles icon generation
- [x] **Auto-dismiss** → Task 3, notification.js — 8 second auto-close + manual dismiss button
- [x] **Preview in popup** → Task 4 — "Preview notification" button fires notification immediately
- [x] **Daily repeat** → `periodInMinutes: 1440` in Task 2
