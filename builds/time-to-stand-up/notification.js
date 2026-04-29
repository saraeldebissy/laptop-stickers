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
