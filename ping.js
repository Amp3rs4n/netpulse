document.addEventListener("DOMContentLoaded", () => {
  const pingEl = document.getElementById("pingValue");
  const jitterEl = document.getElementById("jitterValue");
  const startBtn = document.getElementById("startPingBtn");

  const s = new Speedtest({
    server: {
      url: "https://netpulse-backend.onrender.com/"
    }
  });

  s.setParameter("count_ping", 20);


  s.onupdate = data => {
    console.log("Update:", data);
    if (data.pingStatus) {
      pingEl.textContent = `${parseFloat(data.pingStatus).toFixed(2)} ms`;
    }
    if (data.jitterStatus) {
      jitterEl.textContent = `${parseFloat(data.jitterStatus).toFixed(2)} ms`;
    }
  };

  s.onend = () => {
    console.log("END reached");
    startBtn.disabled = false;
    startBtn.textContent = "Start Ping Test";
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.textContent = "Testing...";
    startBtn.disabled = true;
    startBtn.textContent = "Testing...";
    s.start("ping");

// Примусовий fallback
    setTimeout(() => {
      if (startBtn.disabled) {
        s.abort(); // зупинити тест, якщо завис
        startBtn.disabled = false;
        startBtn.textContent = "Start Ping Test";
      } 
    }, 3000);
    s.start("ping");
  });
});
