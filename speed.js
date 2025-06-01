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
  const labels = [];

  const downloadChart = new Chart(downloadChartCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Завантаження (Mbps)",
        data: downloadData,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  const uploadChart = new Chart(uploadChartCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Вивантаження (Mbps)",
        data: uploadData,
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  const s = new Speedtest({
    server: {
      url: "https://netpulse-backend.onrender.com/"
    }
  });

  let index = 0;

  s.onupdate = data => {
    if (data.dlStatus) {
      const dl = parseFloat(data.dlStatus);
      downloadEl.textContent = `${dl.toFixed(2)} Mbps`;
      downloadData.push(dl);
      labels.push(`T${index++}`);
      downloadChart.update();
    }
    if (data.ulStatus) {
      const ul = parseFloat(data.ulStatus);
      uploadEl.textContent = `${ul.toFixed(2)} Mbps`;
      uploadData.push(ul);
      uploadChart.update();
    }
  };

  s.onend = () => {
    startBtn.disabled = false;
    startBtn.textContent = "Запустити тест";
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.textContent = "Тестування...";
    downloadData.length = 0;
    uploadData.length = 0;
    labels.length = 0;
    downloadChart.update();
    uploadChart.update();
    index = 0;
    s.start("dlul");
  });
});
