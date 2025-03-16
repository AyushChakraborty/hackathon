export function behavior() {
  let wordCount = 0;
  let startTime = null;
  let keyTimestamps = [];
  let keystrokeLatencies = [];

  const apiBaseUrl = "http://127.0.0.1:5000";
  let tracking = false;

  function resetData() {
    wordCount = 0;
    keyTimestamps = [];
    keystrokeLatencies = [];
    startTime = Date.now();
  }

  function startTracking() {
    if (tracking) return;
    tracking = true;
    resetData();

    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("input", inputHandler);
  }

  function stopTracking() {
    if (!tracking) return;
    tracking = false;

    document.removeEventListener("keydown", keydownHandler);
    document.removeEventListener("input", inputHandler);

    sendBehaviorData(); // Send data immediately on focusout
  }

  //for now only tracking wpm and keystroke latency, later will take input
  //from image model as another feature and use that all to predict

  function keydownHandler(e) {
    const now = Date.now();
    if (e.key.length === 1 || e.key === "Backspace") {
      keyTimestamps.push(now);
      if (keyTimestamps.length > 1) {
        const latency = now - keyTimestamps[keyTimestamps.length - 2];
        keystrokeLatencies.push(latency);
      }
    }
  }

  function inputHandler(e) {
    const words = e.target.value
      .trim()
      .split(/\s+/)
      .filter((w) => w !== "");
    wordCount = words.length;
  }

  function sendBehaviorData() {
    const currentTime = Date.now();
    const minutesElapsed = (currentTime - startTime) / (1000 * 60);
    const safeMinutesElapsed = minutesElapsed > 0 ? minutesElapsed : 1; // Prevent division by zero

    const wpm = wordCount / safeMinutesElapsed;
    const avgLatency = keystrokeLatencies.length
      ? keystrokeLatencies.reduce((a, b) => a + b) / keystrokeLatencies.length
      : 0;

    const data = {
      wpm: wpm.toFixed(2),
      keystrokeLatency: avgLatency.toFixed(2),
    };

    console.log("Sending behavioral data:", data);

    fetch(`${apiBaseUrl}/api/behavior`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    resetData();
  }

  document.addEventListener("focusin", (e) => {
    if (e.target.classList.contains("text")) {
      startTracking();
    }
  });

  document.addEventListener("focusout", (e) => {
    if (e.target.classList.contains("text")) {
      stopTracking();
    }
  });
}
