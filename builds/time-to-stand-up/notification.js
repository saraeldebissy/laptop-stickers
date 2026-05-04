// notification.js

// Center window on screen
window.moveTo(
  Math.round((screen.width - 380) / 2),
  Math.round((screen.height - 420) / 2)
);

const dismissBtn = document.getElementById('dismissBtn');

// Auto-dismiss after 12 seconds
const autoDismissTimer = setTimeout(() => {
  window.close();
}, 12000);

// X button dismiss
dismissBtn.addEventListener('click', () => {
  clearTimeout(autoDismissTimer);
  window.close();
});
