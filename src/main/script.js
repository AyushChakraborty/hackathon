const API_BASE_URL = "http://127.0.0.1:5000";

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin") {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadUser(); // Load user on login
  } else {
    alert("Invalid credentials");
  }
}

async function loadUser() {
  const container = document.getElementById("users-container");
  container.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE_URL}/risk`);
    if (!response.ok) throw new Error("Failed to fetch risk scores");

    const riskScores = await response.json(); // Expecting [0.2, 0.3, 0.6]

    const div = document.createElement("div");
    div.className = "user-node";
    const labels = ["Low Risk", "Medium Risk", "High Risk"];

    div.innerHTML = `
  <strong>User ID:</strong> user_001
  <div class="risk-details">
    <strong>Risk Scores:</strong>
    <ul>
      ${riskScores
        .map((score, index) => `<li>${labels[index]}: ${score}</li>`)
        .join("")}
    </ul>
  </div>
`;

    container.appendChild(div);
  } catch (error) {
    console.error("Error loading risk scores:", error);
    container.innerHTML = "Error loading risk scores.";
  }
}
