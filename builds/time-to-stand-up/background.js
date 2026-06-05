// background.js
const ALARM_PREFIX = 'standup-';
const DEFAULT_TIMES = ['13:00'];

chrome.runtime.onInstalled.addListener(() => scheduleAlarms());
chrome.runtime.onStartup.addListener(() => scheduleAlarms());

function scheduleAlarms() {
  chrome.storage.sync.get({ reminderTimes: DEFAULT_TIMES, remindersEnabled: true }, ({ reminderTimes, remindersEnabled }) => {
    chrome.alarms.getAll(existing => {
      const clears = existing
        .filter(a => a.name.startsWith(ALARM_PREFIX))
        .map(a => new Promise(r => chrome.alarms.clear(a.name, r)));

      Promise.all(clears).then(() => {
        updateBadge(remindersEnabled);
        if (!remindersEnabled) {
          console.log('[StandUp] Reminders disabled — alarms cleared');
          return;
        }
        reminderTimes.forEach(time => {
          const [hour, minute] = time.split(':').map(Number);
          const now = new Date();
          const target = new Date();
          target.setHours(hour, minute, 0, 0);
          if (now >= target) target.setDate(target.getDate() + 1);

          chrome.alarms.create(`${ALARM_PREFIX}${time.replace(':', '')}`, {
            when: target.getTime(),
            periodInMinutes: 24 * 60
          });
          console.log('[StandUp] Scheduled', time, '→', target.toLocaleString());
        });
      });
    });
  });
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name.startsWith(ALARM_PREFIX)) injectOverlay();
});

async function injectOverlay() {
  try {
    const win = await chrome.windows.getLastFocused({ windowTypes: ['normal'] });
    chrome.windows.create({
      url: chrome.runtime.getURL('notification.html'),
      type: 'popup',
      left:   win.left,
      top:    win.top,
      width:  win.width,
      height: win.height,
      focused: true
    });
  } catch (err) {
    console.log('[StandUp] Could not get window info:', err.message);
    chrome.windows.create({
      url: chrome.runtime.getURL('notification.html'),
      type: 'popup',
      width: 1280,
      height: 800,
      focused: true
    });
  }
}

function updateBadge(enabled) {
  chrome.action.setBadgeText({ text: enabled ? '' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: '#B82820' });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'previewNotification') { injectOverlay(); sendResponse({}); }
  if (message.action === 'rescheduleAlarms')    { scheduleAlarms(); sendResponse({}); }
});
