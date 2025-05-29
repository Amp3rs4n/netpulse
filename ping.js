document.addEventListener("DOMContentLoaded", function () {
  const testPingBtn = document.getElementById("testPingBtn");
  const pingTime = document.getElementById("pingTime");

  testPingBtn.addEventListener("click", function () {
    pingTime.textContent = "Вимірювання...";
    measurePing("https://netpulse-backend.onrender.com/ping");
  });

  function measurePing(url, count = 5) {
    const results = [];

    function pingOnce() {
      const start = performance.now();
      fetch(`${url}?cacheBuster=${Math.random()}`)
        .then(() => {
          const duration = performance.now() - start;
          results.push(duration);
          next();
        })
        .catch(() => {
          results.push(null);
          next();
        });
    }

    function next() {
      if (results.length < count) {
        setTimeout(pingOnce, 200);
      } else {
        const valid = results.filter(r => r !== null);
        if (valid.length === 0) {
          pingTime.textContent = "Помилка: пінг не виміряно";
          return;
        }
        const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
        pingTime.textContent = `${avg.toFixed(2)} ms`;
        console.log(`Ping: ${avg.toFixed(2)} ms`);
      }
    }

    pingOnce();
  }
});
