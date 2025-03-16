const API_BASE_URL = "http://127.0.0.1:5000";

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin") {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
  } else {
    alert("Invalid credentials");
  }
}

async function loadUsers(testId) {
  const container = document.getElementById("users-container");
  container.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE_URL}/risk/testId=${testId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch risk score");
    }

    const risk = await response.text(); // or response.json() if backend sends a JSON number

    const div = document.createElement("div");
    div.className = "user-node";
    div.innerHTML = `<strong>Risk Score:</strong> ${risk}`;
    container.appendChild(div);
  } catch (error) {
    console.error("Error loading risk score:", error);
    container.innerHTML = "Error loading risk score.";
  }
}
