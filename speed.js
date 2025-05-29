document.addEventListener("DOMContentLoaded", () => {
  const downloadEl = document.getElementById("downloadSpeed");
  const uploadEl = document.getElementById("uploadSpeed");
  const startBtn = document.getElementById("startTestBtn");

  const s = new Speedtest();

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
    startBtn.textContent = "Start Test";
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.textContent = "Testing...";
    s.start("dlul"); // download + upload
  });
});
