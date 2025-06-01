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

  const downloadData = [];
  const uploadData = [];
  const downloadLabels = [];
  const uploadLabels = [];

  let indexDL = 0;
  let indexUL = 0;

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
            color: getComputedStyle(document.documentElement).getPropertyValue('--color-text') || '#fff'
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
            color: getComputedStyle(document.documentElement).getPropertyValue('--color-text') || '#fff'
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

  s.onupdate = data => {
    if (data.testState === 1 && data.dlStatus) {
      const dl = parseFloat(data.dlStatus);
      downloadEl.textContent = `${dl.toFixed(2)} Mbps`;
      downloadData.push(dl);
      downloadLabels.push(`T${indexDL++}`);
      downloadChart.update();
    }

    if (data.testState === 3 && data.ulStatus) {
      const ul = parseFloat(data.ulStatus);
      uploadEl.textContent = `${ul.toFixed(2)} Mbps`;
      uploadData.push(ul);
      uploadLabels.push(`T${indexUL++}`);
      uploadChart.update();
    }
  };

  s.onend = () => {
    startBtn.disabled = false;
    startBtn.innerHTML = "Запустити тест";
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.innerHTML = `Тестування<span class="spinner"></span>`;

    // очищення
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
