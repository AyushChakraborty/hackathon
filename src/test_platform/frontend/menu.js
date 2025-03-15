const apiBaseUrl = "http://127.0.0.1:5000";
const username = localStorage.getItem("username");
document.getElementById("user").textContent = username || "User";

// Optional: Protect route if no login
if (!username || !localStorage.getItem("token")) {
  window.location.href = "login.html";
}

async function fetchTestList() {
  // For now, fetch just one test (if more, you'll loop)
  const res = await fetch(`${apiBaseUrl}/test/test_001`);
  const test = await res.json();

  const ul = document.getElementById("test-list");
  const li = document.createElement("li");

  const link = document.createElement("a");
  link.href = `index.html?test_id=${test.test_id}`;
  link.textContent = test.title;

  li.appendChild(link);
  ul.appendChild(li);
}

fetchTestList();

const res = await fetch(`${apiBaseUrl}/tests`);
const tests = await res.json();

tests.forEach((test) => {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = `index.html?test_id=${test.test_id}`;
  link.textContent = test.title;
  li.appendChild(link);
  ul.appendChild(li);
});
