document.addEventListener("DOMContentLoaded", function () {
  const testPingBtn = document.getElementById("testPingBtn");
  const pingTime = document.getElementById("pingTime");

  testPingBtn.addEventListener("click", () => {
  pingTime.textContent = "Вимірювання...";
  measurePing("ping.txt");
});

  function measurePing(url = "ping.txt", count = 5) {
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
        document.getElementById("pingTime").textContent = "Помилка: пінг не виміряно";
        return;
      }
      const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
      document.getElementById("pingTime").textContent = `${avg.toFixed(2)} ms`;
      console.log(`Ping: ${avg.toFixed(2)} ms`);
    }
  }

  pingOnce();
}
});
