import { tabSwitch } from "./tabSwitch.js";
import { behavior } from "./behavior.js";
const apiBaseUrl = "http://127.0.0.1:5000";

const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get("test_id");

if (!testId) {
  alert("Missing test ID in URL. Use ?test_id=your_test_id");
  throw new Error("Missing test_id");
}
function startTest() {
  return new Promise((resolve) => {
    // Create "Start Test" button
    const fullScreenButton = document.createElement("button");
    fullScreenButton.textContent = "Start Test (Full Screen)";
    fullScreenButton.id = "fullscreen-button";
    fullScreenButton.style.padding = "12px 20px";
    fullScreenButton.style.fontSize = "18px";
    fullScreenButton.style.margin = "20px auto";
    fullScreenButton.style.display = "block";
    fullScreenButton.style.cursor = "pointer";

    document.body.appendChild(fullScreenButton);

    // Button click event
    fullScreenButton.addEventListener("click", function () {
      // Enter fullscreen mode
      const docElem = document.documentElement;
      if (docElem.requestFullscreen) {
        docElem.requestFullscreen();
      } else if (docElem.mozRequestFullScreen) {
        docElem.mozRequestFullScreen();
      } else if (docElem.webkitRequestFullscreen) {
        docElem.webkitRequestFullscreen();
      } else if (docElem.msRequestFullscreen) {
        docElem.msRequestFullscreen();
      }

     // Remove button after entering fullscreen
      fullScreenButton.remove();

      // ✅ Resolve the promise to continue execution
      resolve();
    });
  });
}

// ✅ Only fetch the test **after** the promise resolves
startTest().then(() => {
  return fetch(`${apiBaseUrl}/test/${testId}`);
})
  .then((res) => {
    if (!res.ok) {
      console.error("Server returned status:", res.status);
      throw new Error("Test not found or server error");
    }
    return res.json();
  })
  .then((test) => {
    document.getElementById("test-title").textContent = test.title;

    const questionsContainer = document.getElementById("questions-container");

    test.questions.forEach((q) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("question");

      const label = document.createElement("label");
      label.textContent = q.question;
      label.setAttribute("for", q.id);
      questionDiv.appendChild(label);

      if (q.type === "mcq") {
        q.options.forEach((option, idx) => {
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = q.id;
          radio.value = option;
          radio.id = `${q.id}_option_${idx}`;

          const optionLabel = document.createElement("label");
          optionLabel.textContent = option;
          optionLabel.setAttribute("for", radio.id);

          const wrapper = document.createElement("div");
          wrapper.classList.add("option");
          wrapper.appendChild(radio);
          wrapper.appendChild(optionLabel);

          questionDiv.appendChild(wrapper);
        });
      } else if (q.type === "text") {
        const textarea = document.createElement("textarea");
        textarea.name = q.id;
        textarea.id = q.id;
        textarea.rows = 4;
        textarea.cols = 50;
        questionDiv.appendChild(textarea);
      }

      questionsContainer.appendChild(questionDiv);
    });
  })


  .catch((err) => {
    console.error("Failed to fetch test:", err);
    document.getElementById("questions-container").innerHTML = `
      <p style="color: red;">Failed to load the test. Please check the test ID.</p>
    `;
  });


const form = document.getElementById("test-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const answers = [];

  const formData = new FormData(form);

  for (let [key, value] of formData.entries()) {
    answers.push({
      question_id: key,
      answer: value,
    });
  }

  fetch(`${apiBaseUrl}/test/${testId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("response-message").textContent = data.message;
      document.getElementById("response-message").style.color = "green";
    })
    .catch((err) => {
      console.error("Submission failed:", err);
      document.getElementById("response-message").textContent =
        "Failed to submit. Try again.";
      document.getElementById("response-message").style.color = "red";
    });
});

tabSwitch();
behavior();
