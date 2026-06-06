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
