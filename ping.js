document.addEventListener("DOMContentLoaded", () => {
  const pingEl = document.getElementById("pingValue");
  const jitterEl = document.getElementById("jitterValue");
  const startBtn = document.getElementById("startPingBtn");
  const pingChartCtx = document.getElementById("pingChart")?.getContext("2d");

  const pingData = [];
  const pingLabels = [];
  let pingIndex = 0;

  let pingChart;
  if (pingChartCtx) {
    pingChart = new Chart(pingChartCtx, {
      type: "line",
      data: {
        labels: pingLabels,
        datasets: [{
          label: "Пінг (ms)",
          data: pingData,
          borderColor: "rgba(107, 90, 252, 1)",
          backgroundColor: "rgba(107, 90, 252, 0.2)",
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 200,
            title: {
              display: true,
              text: "ms"
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--color-text') || '#fff'
            }
          }
        }
      }
    });
  }

  startBtn.addEventListener("click", async () => {
    pingEl.textContent = "Очікування...";
    jitterEl.textContent = "Очікування...";
    startBtn.disabled = true;
    startBtn.innerHTML = `Тестування<span class="spinner"></span>`;

    pingData.length = 0;
    pingLabels.length = 0;
    pingIndex = 0;
    if (pingChart) pingChart.update();

    const results = [];
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const attempts = isMobile ? 4 : 10;

    for (let i = 0; i < attempts; i++) {
      const ping = await measureWebRTCPing();
      results.push(ping);

      if (pingChart) {
        pingData.push(ping);
        pingLabels.push(`T${pingIndex++}`);
        pingChart.update();
      }

      if (isMobile) console.log(`📱 Ping #${i + 1}: ${ping} ms`);
      await delay(300);
    }

    const valid = results.filter(r => r !== 999);
    const avgPing = valid.length ? average(valid) : NaN;
    const jitter = valid.length ? standardDeviation(valid) : NaN;

    pingEl.textContent = isNaN(avgPing) ? "N/A" : avgPing.toFixed(2) + " ms";
    jitterEl.textContent = isNaN(jitter) ? "N/A" : jitter.toFixed(2) + " ms";

    startBtn.disabled = false;
    startBtn.innerHTML = "Розпочати перевірку";
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

        setTimeout(() => finalize(false), 3000);
      } catch (err) {
        resolve(999);
      }
    });
  }
});
