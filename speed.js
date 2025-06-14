document.addEventListener("DOMContentLoaded", () => {
  const downloadEl = document.getElementById("downloadSpeed");
  const uploadEl = document.getElementById("uploadSpeed");
  const startBtn = document.getElementById("startSpeedBtn");
  const downloadChartCtx = document.getElementById("downloadChart")?.getContext("2d");
  const uploadChartCtx = document.getElementById("uploadChart")?.getContext("2d");

  if (!downloadEl || !uploadEl || !startBtn || !downloadChartCtx || !uploadChartCtx) {
    console.warn("Елементи інтерфейсу не знайдено. Перевірте HTML.");
    return;
  }

  const userEmail = localStorage.getItem("netpulse_user_email");

  const downloadData = [], uploadData = [];
  const downloadLabels = [], uploadLabels = [];
  let indexDL = 0, indexUL = 0;

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text') || '#ffffff';

  const downloadChart = new Chart(downloadChartCtx, {
    type: "line",
    data: {
      labels: downloadLabels,
      datasets: [{
        label: "Завантаження (Mbps)",
        data: downloadData,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 1000
        }
      },
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    }
  });

  const uploadChart = new Chart(uploadChartCtx, {
    type: "line",
    data: {
      labels: uploadLabels,
      datasets: [{
        label: "Вивантаження (Mbps)",
        data: uploadData,
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 1000
        }
      },
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    }
  });

  const s = new Speedtest({
    server: {
      url: "https://netpulse-backend.onrender.com/"
    }
  });

  let latestDownload = 0;
  let latestUpload = 0;

  s.onupdate = data => {
    if (data.testState === 1 && data.dlStatus) {
      const dl = parseFloat(data.dlStatus);
      latestDownload = dl;
      downloadEl.textContent = `${dl.toFixed(2)} Mbps`;
      downloadData.push(dl);
      downloadLabels.push(`T${indexDL++}`);
      downloadChart.update();
    }

    if (data.testState === 3 && data.ulStatus) {
      const ul = parseFloat(data.ulStatus);
      latestUpload = ul;
      uploadEl.textContent = `${ul.toFixed(2)} Mbps`;
      uploadData.push(ul);
      uploadLabels.push(`T${indexUL++}`);
      uploadChart.update();
    }
  };

  s.onend = () => {
    startBtn.disabled = false;
    startBtn.innerHTML = "Запустити тест";

    fetch("https://netpulse-server.onrender.com/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        download: latestDownload,
        upload: latestUpload,
        timestamp: new Date().toISOString(),
        ip: null,
        ping: null,
        jitter: null,
        email: userEmail
      })
    }).then(res => {
      if (!res.ok) throw new Error("Неможливо зберегти результат");
    }).catch(err => console.error("❌ Помилка збереження:", err));
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.innerHTML = `Тестування<span class="spinner"></span>`;

    // Очистка графіків
    downloadData.length = 0;
    uploadData.length = 0;
    downloadLabels.length = 0;
    uploadLabels.length = 0;
    indexDL = 0;
    indexUL = 0;

    downloadChart.update();
    uploadChart.update();

    s.start("dlul");
  });
});
