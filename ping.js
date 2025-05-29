document.addEventListener("DOMContentLoaded", () => {
  const pingTimeElement = document.getElementById("pingTime");
  const testPingBtn = document.getElementById("testPingBtn");

  testPingBtn.addEventListener("click", () => {
    testPingBtn.disabled = true;
    pingTimeElement.textContent = "Вимірювання...";
    measurePingLive("https://netpulse-backend.onrender.com/ping", 10, 500);
  });

  function measurePingLive(url, count = 10, interval = 500) {
    const results = [];
    let current = 0;

    const intervalId = setInterval(async () => {
      const start = performance.now();
      try {
        await fetch(`${url}?cacheBuster=${Math.random()}`);
        const end = performance.now();
        const duration = end - start;
        results.push(duration);
        current++;

        pingTimeElement.textContent = `Останній: ${Math.round(duration)} ms`;

        if (current >= count) {
          clearInterval(intervalId);

          const valid = results.filter(r => !isNaN(r));
          const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
          pingTimeElement.textContent = `Середній ping: ${avg.toFixed(2)} ms`;
          testPingBtn.disabled = false;
        }
      } catch (err) {
        results.push(NaN);
        current++;
        pingTimeElement.textContent = `Помилка: пінг не отримано`;

        if (current >= count) {
          clearInterval(intervalId);
          testPingBtn.disabled = false;
        }
      }
    }, interval);
  }
});
