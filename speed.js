document.addEventListener("DOMContentLoaded", () => {
  const testSpeedBtn = document.getElementById("startTestBtn");
  const speedResult = document.getElementById("downloadSpeed");

  testSpeedBtn.addEventListener("click", async () => {
    speedResult.textContent = "Вимірювання...";
    const fileUrl = "https://netpulse-ping-api.onrender.com/testfile";

    try {
      const startTime = performance.now();
      const response = await fetch(`${fileUrl}?cacheBuster=${Math.random()}`);
      const blob = await response.blob();
      const endTime = performance.now();

      const fileSizeBytes = blob.size;
      const durationSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = fileSizeBytes * 8;
      const speedMbps = (bitsLoaded / durationSeconds) / 1_000_000;

      speedResult.textContent = `Швидкість завантаження: ${speedMbps.toFixed(2)} Mbit/s`;
    } catch (error) {
      speedResult.textContent = "Помилка вимірювання";
    }
  });
});
