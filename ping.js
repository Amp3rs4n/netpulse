document.getElementById("testPingBtn").addEventListener("click", function () {
    document.getElementById("pingTime").textContent = "Вимірювання...";

    measurePing("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png");
});

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
            document.getElementById("pingTime").textContent = `${avg.toFixed(2)} ms`;
        }
    }

    pingOnce();
}
