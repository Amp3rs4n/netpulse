window.addEventListener('DOMContentLoaded', () => {
  const offset = parseInt(localStorage.getItem('gradientOffset')) || 0;
  document.body.style.animationDelay = `-${offset / 1000}s`;
});

window.addEventListener('beforeunload', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
  const elapsed = Date.now() % 15000;
  localStorage.setItem('gradientOffset', elapsed);
});
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const computedStyle = window.getComputedStyle(document.body);
    const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
    const elapsed = Date.now() % 15000;
    localStorage.setItem('gradientOffset', elapsed);
  }
});
window.addEventListener('load', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
  const elapsed = Date.now() % 15000;
  localStorage.setItem('gradientOffset', elapsed);
});
window.addEventListener('animationiteration', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
  const elapsed = Date.now() % 15000;
  localStorage.setItem('gradientOffset', elapsed);
});
window.addEventListener('animationend', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
  const elapsed = Date.now() % 15000;
  localStorage.setItem('gradientOffset', elapsed);
});
window.addEventListener('animationstart', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
  const elapsed = Date.now() % 15000;
  localStorage.setItem('gradientOffset', elapsed);
});
window.addEventListener('animationcancel', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
  const elapsed = Date.now() % 15000;
  localStorage.setItem('gradientOffset', elapsed);
});
window.addEventListener('animationplay', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
  const elapsed = Date.now() % 15000;
  localStorage.setItem('gradientOffset', elapsed);
});
window.addEventListener('animationpause', () => {
  const computedStyle = window.getComputedStyle(document.body);
  const animTime = parseFloat(computedStyle.animationDelay) * -1000 || 0;
  const elapsed = Date.now() % 15000;
  localStorage.setItem('gradientOffset', elapsed);
});

