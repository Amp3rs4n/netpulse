document.addEventListener("DOMContentLoaded", () => {
  const pingEl = document.getElementById("pingValue");
  const jitterEl = document.getElementById("jitterValue");
  const startBtn = document.getElementById("startPingBtn");

  const s = new Speedtest({
    server: {
      url: "https://netpulse-backend.onrender.com/"
    }
  });

  s.onupdate = data => {
    if (data.pingStatus) {
      pingEl.textContent = `${parseFloat(data.pingStatus).toFixed(2)} ms`;
    }
    if (data.jitterStatus) {
      jitterEl.textContent = `${parseFloat(data.jitterStatus).toFixed(2)} ms`;
    }
  };

  s.onend = () => {
    startBtn.disabled = false;
    startBtn.textContent = "Start Ping Test";
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.textContent = "Testing...";
    s.start("ping");
  });
});
