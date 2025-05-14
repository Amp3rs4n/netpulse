// ping.js

// DOM Elements
const testPingBtn = document.getElementById('testPingBtn');
const pingTimeElement = document.getElementById('pingTime');

// Function to simulate a ping test
function simulatePingTest() {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const pingTime = (Math.random() * 100).toFixed(0); // Random ping time (0-100 ms)
      resolve(pingTime);
    }, 1000); // Simulate a 1-second delay
  });
}

// Function to run the ping test
async function runPingTest() {
  // Reset results
  pingTimeElement.textContent = '0 ms';

  // Disable the button during the test
  testPingBtn.disabled = true;
  testPingBtn.textContent = 'Testing...';

  // Get the ping result
  const pingTime = await simulatePingTest();

  // Update the result
  pingTimeElement.textContent = `${pingTime} ms`;

  // Re-enable the button
  testPingBtn.disabled = false;
  testPingBtn.textContent = 'Test Ping';
}

// Event Listener
testPingBtn.addEventListener('click', runPingTest);