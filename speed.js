document.addEventListener("DOMContentLoaded", () => {
  const downloadEl = document.getElementById("downloadSpeed");
  const uploadEl = document.getElementById("uploadSpeed");
  const startBtn = document.getElementById("startSpeedBtn");

  if (!downloadEl || !uploadEl || !startBtn) {
    console.warn("Елементи інтерфейсу не знайдено. Перевірте HTML.");
    return;
  }

  const s = new Speedtest({
    server: {
      url: "https://netpulse-backend.onrender.com/"
    }
  });

  s.onupdate = data => {
    if (data.dlStatus) {
      downloadEl.textContent = `${parseFloat(data.dlStatus).toFixed(2)} Mbps`;
    }
    if (data.ulStatus) {
      uploadEl.textContent = `${parseFloat(data.ulStatus).toFixed(2)} Mbps`;
    }
  };

  s.onend = () => {
    startBtn.disabled = false;
    startBtn.textContent = "Запустити тест";
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.textContent = "Тестування...";
    s.start("dlul");
  });
});
