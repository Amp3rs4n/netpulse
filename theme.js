// theme.js

// Function to apply the saved theme
function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;
  const metaThemeColor = document.querySelector("meta[name=theme-color]");

  if (savedTheme === 'light-mode') {
    body.classList.add('light-mode');
    updateThemeButtonText('light-mode');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#f4f4f4');
  } else {
    body.classList.remove('light-mode');
    updateThemeButtonText('dark-mode');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#0f0f1b');
  }
}

// Function to update the theme toggle button text
function updateThemeButtonText(theme) {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === 'light-mode' ? '🌞 Light Mode' : '🌙 Dark Mode';
  }
}

// Function to initialize the theme toggle button
function initializeThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;
  const metaThemeColor = document.querySelector("meta[name=theme-color]");

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');

      const isLight = body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light-mode' : '');
      updateThemeButtonText(isLight ? 'light-mode' : 'dark-mode');
      if (metaThemeColor)
        metaThemeColor.setAttribute('content', isLight ? '#f4f4f4' : '#0f0f1b');
    });
  }
}

// Apply the saved theme when the page loads
applySavedTheme();

// Initialize the theme toggle button
initializeThemeToggle();