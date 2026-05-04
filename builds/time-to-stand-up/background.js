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
  const width = 380;
  const height = 420;

  chrome.windows.create({
    url: chrome.runtime.getURL('notification.html'),
    type: 'popup',
    width,
    height,
    focused: true
  });
}

// Handle preview request from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'previewNotification') {
    openNotificationWindow();
  }
});
