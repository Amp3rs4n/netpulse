// theme.js

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;
  const metaThemeColor = document.querySelector("meta[name=theme-color]");

  const isLight = savedTheme === 'light-mode';
  body.classList.toggle('light-mode', isLight);
  updateThemeButtonText(isLight ? 'light-mode' : 'dark-mode');

  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isLight ? '#f4f4f4' : '#0f0f1b');
  }
}

function updateThemeButtonText(theme) {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === 'light-mode' ? '🌞 Light Mode' : '🌙 Dark Mode';
  }
}

function initializeThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;
  const metaThemeColor = document.querySelector("meta[name=theme-color]");

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isNowLight = !body.classList.contains('light-mode');
      body.classList.toggle('light-mode', isNowLight);
      localStorage.setItem('theme', isNowLight ? 'light-mode' : '');
      updateThemeButtonText(isNowLight ? 'light-mode' : 'dark-mode');

      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isNowLight ? '#f4f4f4' : '#0f0f1b');
      }
    });
  }
}

// Init
applySavedTheme();
initializeThemeToggle();
