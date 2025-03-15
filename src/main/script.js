const USERS = {
  test1: [
    { id: "user_123", risk: 0.2 },
    { id: "user_456", risk: 0.7 },
  ],
  test2: [{ id: "user_789", risk: 0.1 }],
};

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

function loadUsers(testId) {
  const container = document.getElementById("users-container");
  container.innerHTML = "";

  if (!USERS[testId]) return;

  USERS[testId].forEach((user) => {
    const div = document.createElement("div");
    div.className = "user-node";
    div.innerHTML = `<strong>User ID:</strong> ${user.id}<br><strong>Risk Score:</strong> ${user.risk}`;
    container.appendChild(div);
  });
}
