document.addEventListener("DOMContentLoaded", () => {
  const pingEl = document.getElementById("pingValue");
  const jitterEl = document.getElementById("jitterValue");
  const startBtn = document.getElementById("startPingBtn");

  startBtn.addEventListener("click", async () => {
    pingEl.textContent = "N/A";
    jitterEl.textContent = "N/A";
    startBtn.disabled = true;
    startBtn.textContent = "Тестування...";

    const results = [];
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const attempts = isMobile ? 4 : 10;

    for (let i = 0; i < attempts; i++) {
      const ping = await measureWebRTCPing();
      results.push(ping);
      await delay(250);
    }

    const avgPing = average(results);
    const jitter = standardDeviation(results);

    pingEl.textContent = isNaN(avgPing) ? "N/A" : avgPing.toFixed(2) + " ms";
    jitterEl.textContent = isNaN(jitter) ? "N/A" : jitter.toFixed(2) + " ms";

    startBtn.disabled = false;
    startBtn.textContent = "Розпочати перевірку";
  });

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function average(arr) {
    const valid = arr.filter(n => n !== 999);
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : NaN;
  }

  function standardDeviation(values) {
    const valid = values.filter(n => n !== 999);
    const avg = average(valid);
    const squareDiffs = valid.map(value => Math.pow(value - avg, 2));
    return valid.length ? Math.sqrt(average(squareDiffs)) : NaN;
  }

  function measureWebRTCPing() {
    return new Promise(resolve => {
      const start = performance.now();
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      let resolved = false;

      function finalize(success) {
        if (!resolved) {
          resolved = true;
          pc.close();
          const end = performance.now();
          resolve(success ? end - start : 999);
        }
      }

      try {
        pc.createDataChannel("ping");

        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === "complete") finalize(true);
        };

        pc.oniceconnectionstatechange = () => {
          if (["failed", "disconnected", "closed"].includes(pc.iceConnectionState)) {
            finalize(false);
          }
        };

        pc.onicecandidate = event => {
          if (!event.candidate) finalize(true);
        };

        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(() => finalize(false));

        setTimeout(() => finalize(false), 2500); // мобільний таймаут
      } catch (err) {
        finalize(false);
      }
    });
  }
});
