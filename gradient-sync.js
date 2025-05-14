// Тривалість анімації у мілісекундах (має відповідати CSS)
const ANIMATION_DURATION = 15000;

// При завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => {
  // Час старту анімації, збережений у localStorage
  const startTime = parseInt(localStorage.getItem('gradientStartTime'), 10);
  let offset = 0;
  if (!isNaN(startTime)) {
    // Обчислюємо, скільки часу минуло з моменту старту
    offset = (Date.now() - startTime) % ANIMATION_DURATION;
  } else {
    // Якщо ще не було збережено, зберігаємо зараз
    localStorage.setItem('gradientStartTime', Date.now());
  }
  // Встановлюємо animation-delay, щоб анімація починалась з потрібного місця
  document.body.style.animationDelay = `-${offset / 1000}s`;
});

// Перед виходом зі сторінки зберігаємо час старту, щоб синхронізувати між сторінками
window.addEventListener('beforeunload', () => {
  // Зберігаємо час старту анімації (теперішній час мінус offset)
  const computedStyle = window.getComputedStyle(document.body);
  const delay = parseFloat(computedStyle.animationDelay) || 0;
  const offset = -delay * 1000;
  const startTime = Date.now() - offset;
  localStorage.setItem('gradientStartTime', startTime);
});