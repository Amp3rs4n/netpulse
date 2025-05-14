// speed.js

// DOM Elements
const startTestBtn = document.getElementById('startTestBtn');
const downloadSpeedElement = document.getElementById('downloadSpeed');
const uploadSpeedElement = document.getElementById('uploadSpeed');
const progressBar = document.querySelector('.progress-bar');

// Function to simulate a speed test
function simulateSpeedTest() {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const downloadSpeed = (Math.random() * 100).toFixed(2); // Random download speed (0-100 Mbps)
      const uploadSpeed = (Math.random() * 50).toFixed(2); // Random upload speed (0-50 Mbps)
      resolve({ downloadSpeed, uploadSpeed });
    }, 3000); // Simulate a 3-second delay
  });
}

// Function to update the progress bar
function updateProgressBar(progress) {
  progressBar.style.background = `conic-gradient(#00ff88 ${progress}%, transparent 0%)`;
}

// Function to run the speed test
async function runSpeedTest() {
  // Reset results
  downloadSpeedElement.textContent = '0 Mbps';
  uploadSpeedElement.textContent = '0 Mbps';
  updateProgressBar(0);

  // Disable the button during the test
  startTestBtn.disabled = true;
  startTestBtn.textContent = 'Testing...';

  // Simulate progress (0% to 100%)
  for (let i = 0; i <= 100; i++) {
    updateProgressBar(i);
    await new Promise((resolve) => setTimeout(resolve, 30)); // 30ms delay per step
  }

  // Get the speed results
  const { downloadSpeed, uploadSpeed } = await simulateSpeedTest();

  // Update the results
  downloadSpeedElement.textContent = `${downloadSpeed} Mbps`;
  uploadSpeedElement.textContent = `${uploadSpeed} Mbps`;

  // Re-enable the button
  startTestBtn.disabled = false;
  startTestBtn.textContent = 'Start Test';
}

// Event Listener
startTestBtn.addEventListener('click', runSpeedTest);