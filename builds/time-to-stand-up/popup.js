// popup.js
const enabledToggle = document.getElementById('enabledToggle');
const hourSel       = document.getElementById('hourSel');
const minSel        = document.getElementById('minSel');
const ampmSel       = document.getElementById('ampmSel');
const addBtn        = document.getElementById('addBtn');
const pillsArea     = document.getElementById('pillsArea');
const previewBtn    = document.getElementById('previewBtn');
const closeBtn      = document.getElementById('closeBtn');

buildSelects();
loadTimes();

chrome.storage.sync.get({ remindersEnabled: true }, ({ remindersEnabled }) => {
  enabledToggle.checked = remindersEnabled;
  applyDim(!remindersEnabled);
});

enabledToggle.addEventListener('change', () => {
  const enabled = enabledToggle.checked;
  applyDim(!enabled);
  chrome.storage.sync.set({ remindersEnabled: enabled }, () => {
    chrome.runtime.sendMessage({ action: 'rescheduleAlarms' });
  });
});

function applyDim(dim) {
  document.getElementById('timesSection').classList.toggle('xp-dimmed', dim);
}

function buildSelects() {
  for (let h = 1; h <= 12; h++) {
    const opt = document.createElement('option');
    opt.value = h;
    opt.textContent = h;
    hourSel.appendChild(opt);
  }
  for (let m = 0; m < 60; m += 5) {
    const opt = document.createElement('option');
    opt.value = String(m).padStart(2, '0');
    opt.textContent = String(m).padStart(2, '0');
    minSel.appendChild(opt);
  }
  hourSel.value = '1';
  minSel.value  = '00';
  ampmSel.value = 'PM';
}

function getSelectedTime() {
  let h = parseInt(hourSel.value);
  const m = minSel.value;
  const ampm = ampmSel.value;
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}`;
}

closeBtn.addEventListener('click', () => window.close());

addBtn.addEventListener('click', () => {
  const time = getSelectedTime();
  if (!time) return;

  chrome.storage.sync.get({ reminderTimes: [] }, ({ reminderTimes }) => {
    if (reminderTimes.includes(time)) return;
    const updated = [...reminderTimes, time].sort();
    chrome.storage.sync.set({ reminderTimes: updated }, () => {
      chrome.runtime.sendMessage({ action: 'rescheduleAlarms' });
      renderPills(updated);
    });
  });
});

previewBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'previewNotification' }, () => {
    window.close();
  });
});

function loadTimes() {
  chrome.storage.sync.get({ reminderTimes: ['13:00'] }, ({ reminderTimes }) => {
    renderPills(reminderTimes);
  });
}

function removeTime(time) {
  chrome.storage.sync.get({ reminderTimes: [] }, ({ reminderTimes }) => {
    const updated = reminderTimes.filter(t => t !== time);
    chrome.storage.sync.set({ reminderTimes: updated }, () => {
      chrome.runtime.sendMessage({ action: 'rescheduleAlarms' });
      renderPills(updated);
    });
  });
}

function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function renderPills(times) {
  pillsArea.innerHTML = '';
  if (times.length === 0) {
    pillsArea.innerHTML = '<span class="no-reminders">No reminders set</span>';
    return;
  }
  times.forEach(time => {
    const pill = document.createElement('div');
    pill.className = 'xp-pill';
    pill.innerHTML = `
      <span>${formatTime(time)}</span>
      <button class="xp-pill-remove" title="Remove">✕</button>
    `;
    pill.querySelector('.xp-pill-remove').addEventListener('click', () => removeTime(time));
    pillsArea.appendChild(pill);
  });
}
