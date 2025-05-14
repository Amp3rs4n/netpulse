const ANIMATION_DURATION = 15000;

window.addEventListener('DOMContentLoaded', () => {
  const startTime = parseInt(localStorage.getItem('gradientStartTime'), 10);
  let offset = 0;
  if (!isNaN(startTime)) {
    offset = (Date.now() - startTime) % ANIMATION_DURATION;
  } else {
    localStorage.setItem('gradientStartTime', Date.now());
  }
  document.body.style.animationDelay = `-${offset / 1000}s`;
  // Знімаємо клас preload, щоб анімація стартувала з delay
  document.body.classList.remove('preload');
});

window.addEventListener('beforeunload', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const delay = parseFloat(computedStyle.animationDelay) || 0;
  const offset = -delay * 1000;
  const startTime = Date.now() - offset;
  localStorage.setItem('gradientStartTime', startTime);
});