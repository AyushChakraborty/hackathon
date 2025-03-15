function behavior() {
  let wordCount = 0;
  let startTime = Date.now();
  let keyTimestamps = [];
  let keystrokeLatencies = [];
  let mouseMovements = [];
  let lastActivityTime = Date.now();
  let idleTime = 0;

  const apiBaseUrl = "http://127.0.0.1:5000";

  // --- Typing events ---
  document.addEventListener("keydown", (e) => {
    const now = Date.now();
    if (e.key.length === 1 || e.key === "Backspace") {
      keyTimestamps.push(now);
      if (keyTimestamps.length > 1) {
        const latency = now - keyTimestamps[keyTimestamps.length - 2];
        keystrokeLatencies.push(latency);
      }
      lastActivityTime = now;
    }
  });

  document.addEventListener("input", (e) => {
    const words = e.target.value
      .trim()
      .split(/\s+/)
      .filter((w) => w !== "");
    wordCount = words.length;
    lastActivityTime = Date.now();
  });

  // --- Mouse movement ---
  document.addEventListener("mousemove", (e) => {
    mouseMovements.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    lastActivityTime = Date.now();
  });

  // --- Idle Time Detector ---
  setInterval(() => {
    const now = Date.now();
    if (now - lastActivityTime > 5000) {
      // 5 seconds inactivity = idle
      idleTime += now - lastActivityTime;
    }
    lastActivityTime = now;
  }, 5000);

  // --- Send Data Every Minute ---
  setInterval(() => {
    const currentTime = Date.now();
    const minutesElapsed = (currentTime - startTime) / (1000 * 60);
    const wpm = wordCount / minutesElapsed;
    const avgLatency = keystrokeLatencies.length
      ? keystrokeLatencies.reduce((a, b) => a + b) / keystrokeLatencies.length
      : 0;

    const data = {
      wpm: wpm.toFixed(2),
      keystrokeLatency: avgLatency.toFixed(2),
      mouseMovements,
      idleTime: Math.round(idleTime / 1000), // in seconds
    };

    console.log("Sending behavioral data:", data); // ADD THIS LINE

    fetch(`${apiBaseUrl}/api/behavior`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Reset data
    keystrokeLatencies = [];
    mouseMovements = [];
    idleTime = 0;
    startTime = Date.now();
    wordCount = 0;
  }, 60000); // every 60 seconds
}
