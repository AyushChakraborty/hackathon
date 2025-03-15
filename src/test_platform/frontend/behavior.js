export function behavior() {
  let wordCount = 0;
  let startTime = null;
  let keyTimestamps = [];
  let keystrokeLatencies = [];
  let lastActivityTime = null;
  let idleTime = 0;

  const apiBaseUrl = "http://127.0.0.1:5000";
  let tracking = false;
  let idleInterval = null;

  function resetData() {
    wordCount = 0;
    keyTimestamps = [];
    keystrokeLatencies = [];
    idleTime = 0;
    startTime = Date.now();
    lastActivityTime = Date.now();
  }

  function startTracking() {
    if (tracking) return;
    tracking = true;
    resetData();

    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("input", inputHandler);

    idleInterval = setInterval(idleTimeHandler, 5000);
  }

  function stopTracking() {
    if (!tracking) return;
    tracking = false;

    document.removeEventListener("keydown", keydownHandler);
    document.removeEventListener("input", inputHandler);

    clearInterval(idleInterval);

    sendBehaviorData(); // Send data immediately on focusout
  }

  function keydownHandler(e) {
    const now = Date.now();
    if (e.key.length === 1 || e.key === "Backspace") {
      keyTimestamps.push(now);
      if (keyTimestamps.length > 1) {
        const latency = now - keyTimestamps[keyTimestamps.length - 2];
        keystrokeLatencies.push(latency);
      }
      lastActivityTime = now;
    }
  }

  function inputHandler(e) {
    const words = e.target.value
      .trim()
      .split(/\s+/)
      .filter((w) => w !== "");
    wordCount = words.length;
    lastActivityTime = Date.now();
  }

  function idleTimeHandler() {
    const now = Date.now();
    if (now - lastActivityTime > 5000) {
      idleTime += now - lastActivityTime;
    }
    lastActivityTime = now;
  }

  function sendBehaviorData() {
    const currentTime = Date.now();
    const minutesElapsed = (currentTime - startTime) / (1000 * 60);
    const wpm = wordCount / minutesElapsed;
    const avgLatency = keystrokeLatencies.length
      ? keystrokeLatencies.reduce((a, b) => a + b) / keystrokeLatencies.length
      : 0;

    const data = {
      wpm: wpm.toFixed(2),
      keystrokeLatency: avgLatency.toFixed(2),
      idleTime: Math.round(idleTime / 1000),
    };

    console.log("Sending behavioral data:", data);

    fetch(`${apiBaseUrl}/api/behavior`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    resetData();
  }

  // --- Start tracking on text area focus ---
  document.addEventListener("focusin", (e) => {
    if (e.target.classList.contains("text")) {
      startTracking();
    }
  });

  // --- Stop and send data on focusout ---
  document.addEventListener("focusout", (e) => {
    if (e.target.classList.contains("text")) {
      stopTracking();
    }
  });
}
