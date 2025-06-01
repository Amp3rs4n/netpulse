document.addEventListener("DOMContentLoaded", () => {
  const pingEl = document.getElementById("pingValue");
  const jitterEl = document.getElementById("jitterValue");
  const startBtn = document.getElementById("startPingBtn");

  startBtn.addEventListener("click", async () => {
    startBtn.disabled = true;
    startBtn.textContent = "Тестування...";

    const results = [];

    for (let i = 0; i < 10; i++) {
      const ping = await measureWebRTCPing();
      results.push(ping);
      await delay(250);
    }

    const avgPing = average(results);
    const jitter = standardDeviation(results);

    pingEl.textContent = avgPing.toFixed(2) + " ms";
    jitterEl.textContent = jitter.toFixed(2) + " ms";

    startBtn.disabled = false;
    startBtn.textContent = "Розпочати перевірку";
  });

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function standardDeviation(values) {
    const avg = average(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(average(squareDiffs));
  }

  function measureWebRTCPing() {
    return new Promise(resolve => {
      const start = performance.now();
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      pc.createDataChannel("ping");

      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => resolve(999)); // fallback in case of error

      pc.onicecandidate = event => {
        if (!event.candidate) {
          const end = performance.now();
          pc.close();
          resolve(end - start);
        }
      };

      setTimeout(() => {
        // fallback timeout
        pc.close();
        resolve(999);
      }, 2000);
    });
  }
});
