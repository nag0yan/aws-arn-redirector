document.getElementById('save').addEventListener('click', () => {
  const ssoUrl = document.getElementById('ssoUrl').value;
  const defaultAccount = document.getElementById('defaultAccount').value;

  chrome.storage.sync.set({ ssoUrl, defaultAccount }, () => {
    alert('Settings saved.');
  });
});
