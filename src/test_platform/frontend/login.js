const apiBaseUrl = "http://127.0.0.1:5000";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${apiBaseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token or session info
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      // Instead of hardcoding test_001
      window.location.href = "menu.html";
    } else {
      document.getElementById("login-message").textContent =
        data.message || "Login failed.";
      document.getElementById("login-message").style.color = "red";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("login-message").textContent = "Server error.";
    document.getElementById("login-message").style.color = "red";
  }
});
