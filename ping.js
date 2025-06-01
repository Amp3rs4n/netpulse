document.addEventListener("DOMContentLoaded", () => {
  const pingEl = document.getElementById("pingValue");
  const jitterEl = document.getElementById("jitterValue");
  const startBtn = document.getElementById("startPingBtn");

  startBtn.addEventListener("click", async () => {
    pingEl.textContent = "Очікування...";
    jitterEl.textContent = "Очікування...";
    startBtn.disabled = true;
    startBtn.textContent = "Тестування...";

    const results = [];
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const attempts = isMobile ? 4 : 10;

    for (let i = 0; i < attempts; i++) {
      const ping = await measureWebRTCPing();
      results.push(ping);
      if (isMobile) console.log(`📱 Ping #${i + 1}: ${ping} ms`);
      await delay(300);
    }

    const valid = results.filter(r => r !== 999);
    const avgPing = valid.length ? average(valid) : NaN;
    const jitter = valid.length ? standardDeviation(valid) : NaN;

    pingEl.textContent = isNaN(avgPing) ? "N/A" : avgPing.toFixed(2) + " ms";
    jitterEl.textContent = isNaN(jitter) ? "N/A" : jitter.toFixed(2) + " ms";

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
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        iceCandidatePoolSize: 1
      });

      let resolved = false;
      const finalize = (success) => {
        if (!resolved) {
          resolved = true;
          pc.close();
          const end = performance.now();
          resolve(success ? end - start : 999);
        }
      };

      try {
        // ✅ обов’язково до offer
        pc.createDataChannel("ping");

        pc.onicecandidate = (e) => {
          if (!e.candidate) finalize(true);
        };

        pc.oniceconnectionstatechange = () => {
          if (["failed", "disconnected", "closed"].includes(pc.iceConnectionState)) {
            finalize(false);
          }
        };

        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === "complete") finalize(true);
        };

        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(() => finalize(false));

        setTimeout(() => finalize(false), 3000); // мобільний fallback
      } catch (err) {
        resolve(999);
      }
    });
  }
});
