// theme.js

// Function to apply the saved theme
function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;

  if (savedTheme === 'light-mode') {
    body.classList.add('light-mode');
    updateThemeButtonText('light-mode');
  } else {
    body.classList.remove('light-mode');
    updateThemeButtonText('dark-mode');
  }
}

// Function to update the theme toggle button text
function updateThemeButtonText(theme) {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (theme === 'light-mode') {
    themeToggleBtn.textContent = '🌞 Light Mode';
  } else {
    themeToggleBtn.textContent = '🌙 Dark Mode';
  }
}

// Function to initialize the theme toggle button
function initializeThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      // Save the current theme in localStorage
      if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light-mode');
      } else {
        localStorage.removeItem('theme');
      }
      updateThemeButtonText(body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode');
    });
  }
}

// Apply the saved theme when the page loads
applySavedTheme();

// Initialize the theme toggle button
initializeThemeToggle();