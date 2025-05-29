// ping.js

document.getElementById("startPingBtn").addEventListener("click", function () {
    document.getElementById("pingResult").textContent = "Вимірювання...";

    measurePing("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png");
});

// Function to simulate a ping test
function measurePing(url, count = 5) {
    const results = [];

    function pingOnce() {
        const start = performance.now();
        const img = new Image();
        img.onload = () => {
            const duration = performance.now() - start;
            results.push(duration);
            next();
        };
        img.onerror = () => {
            results.push(null);
            next();
        };
        img.src = `${url}?cacheBuster=${Math.random()}`;
    }

    function next() {
        if (results.length < count) {
            setTimeout(pingOnce, 200); // трошки паузи
        } else {
            const valid = results.filter(r => r !== null);
            const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
            console.log(`Ping: ${avg.toFixed(2)} ms`);
        }
    }

    pingOnce();
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