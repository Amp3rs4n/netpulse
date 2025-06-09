// network.js

// Отримуємо дані про IP, ISP та геолокацію
async function fetchNetworkDetails() {
  const token = '8e1b9b121035fb';
  const url = `https://ipinfo.io/json?token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('⛔ Не вдалося отримати дані про мережу');
    return await response.json();
  } catch (err) {
    console.error('❌ Помилка під час отримання IP-інформації:', err);
    return null;
  }
}

// Визначення типу з’єднання (WiFi, 4G тощо)
function detectNetworkType() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return connection?.effectiveType || 'Невідомо';
}

// Відображення всіх мережевих даних на сторінці
async function displayNetworkInfo() {
  const ipEl = document.getElementById('ipValue');
  const ispEl = document.getElementById('ispValue');
  const locationEl = document.getElementById('locationValue');

  const data = await fetchNetworkDetails();

  if (data) {
    ipEl.textContent = data.ip || 'Невідомо';
    ispEl.textContent = data.org || 'Невідомо';

    if (data.city && data.country) {
      locationEl.textContent = `${data.city}, ${data.country}`;
    } else if (data.loc) {
      locationEl.textContent = data.loc;
    } else {
      locationEl.textContent = 'Невідомо';
    }

    // 💡 Якщо потрібно — виводимо тип з'єднання в консоль або в окреме місце
    console.log('Тип з’єднання:', detectNetworkType());
  } else {
    ipEl.textContent = ispEl.textContent = locationEl.textContent = 'Помилка';
  }
}

// Старт після завантаження сторінки
displayNetworkInfo();
