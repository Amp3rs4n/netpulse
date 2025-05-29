document.addEventListener("DOMContentLoaded", () => {
  const pingEl = document.getElementById("pingValue");
  const jitterEl = document.getElementById("jitterValue");
  const startBtn = document.getElementById("startPingBtn");

  const s = new Speedtest();
  s.setParameter("serverURL", "https://netpulse-backend.onrender.com/");
  s.setParameter("count_ping", 5);
  s.setParameter("time_ulGraceTime", 0.5); // додатково прискорює

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
  
  const timeout = setTimeout(() => {
    console.warn("Forcing end due to timeout");
    s.abort();
    startBtn.disabled = false;
    startBtn.textContent = "Start Ping Test";
  }, 4000); // примусово 4 секунди

  s.onend = () => {
    clearTimeout(timeout); // прибираємо таймер
    startBtn.disabled = false;
    startBtn.textContent = "Start Ping Test";
  };

  s.setParameter("getIp_ispInfo", false); // забороняє перевірку IP
  s.setParameter("getIp_ispInfo_distance", ""); // без geo IP
  s.start("ping");
});

});
