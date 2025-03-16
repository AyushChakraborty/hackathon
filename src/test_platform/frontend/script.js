import { tabSwitch } from "./tabSwitch.js";
import { behavior } from "./behavior.js";

const apiBaseUrl = "http://127.0.0.1:5000";

const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get("test_id");

document.getElementById("submit-button").style.display = "none";

if (!testId) {
  alert("Missing test ID in URL. Use ?test_id=your_test_id");
  throw new Error("Missing test_id");
}

function saveProgress() {
  const answers = {};
  document
    .querySelectorAll(".question input, .question textarea")
    .forEach((el) => {
      if (el.type === "radio") {
        if (el.checked) answers[el.name] = el.value;
      } else {
        answers[el.name] = el.value;
      }
    });

  localStorage.setItem("testProgress", JSON.stringify(answers));
}

function loadProgress() {
  const savedAnswers = JSON.parse(localStorage.getItem("testProgress")) || {};
  document
    .querySelectorAll(".question input, .question textarea")
    .forEach((el) => {
      if (el.type === "radio" && savedAnswers[el.name] === el.value) {
        el.checked = true;
      } else if (el.type !== "radio" && savedAnswers[el.name]) {
        el.value = savedAnswers[el.name];
      }
    });
}

function handleFullscreenExit() {
  if (!document.fullscreenElement) {
    document.getElementById("submit-button").style.display = "none";

    document
      .querySelectorAll("input, textarea, button, select")
      .forEach((el) => {
        el.disabled = true;
      });

    saveProgress();
    alert("You have exited fullscreen mode! Click 'Restart Test' to continue.");

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Test";
    restartButton.id = "restart-button";
    restartButton.style.padding = "12px 20px";
    restartButton.style.fontSize = "18px";
    restartButton.style.margin = "20px auto";
    restartButton.style.display = "block";
    restartButton.style.cursor = "pointer";

    document.body.appendChild(restartButton);

    restartButton.addEventListener("click", function () {
      const docElem = document.documentElement;
      docElem.requestFullscreen?.();

      document
        .querySelectorAll("input, textarea, button, select")
        .forEach((el) => {
          el.disabled = false;
        });

      document.getElementById("submit-button").style.display = "block";
      restartButton.remove();
      loadProgress();
    });
  }
}

document.addEventListener("fullscreenchange", handleFullscreenExit);
document.addEventListener("webkitfullscreenchange", handleFullscreenExit);
document.addEventListener("mozfullscreenchange", handleFullscreenExit);
document.addEventListener("MSFullscreenChange", handleFullscreenExit);

function startTest() {
  return new Promise((resolve, reject) => {
    const fullScreenButton = document.createElement("button");
    fullScreenButton.textContent = "Start Test (Full Screen)";
    fullScreenButton.id = "fullscreen-button";
    fullScreenButton.style.padding = "12px 20px";
    fullScreenButton.style.fontSize = "18px";
    fullScreenButton.style.margin = "20px auto";
    fullScreenButton.style.display = "block";
    fullScreenButton.style.cursor = "pointer";

    document.body.appendChild(fullScreenButton);

    fullScreenButton.addEventListener("click", function () {
      const docElem = document.documentElement;

      const fullScreenPromise =
        docElem.requestFullscreen?.() ||
        docElem.mozRequestFullScreen?.() ||
        docElem.webkitRequestFullscreen?.() ||
        docElem.msRequestFullscreen?.();

      if (fullScreenPromise) {
        fullScreenPromise
          .then(() => {
            fullScreenButton.remove();

            const submitBtn = document.getElementById("submit-button");
            if (submitBtn) {
              submitBtn.style.display = "block";
            }

            resolve();
          })
          .catch((err) => {
            console.error("Fullscreen failed:", err);
            reject(err);
          });
      } else {
        alert("Fullscreen API not supported");
        reject(new Error("Fullscreen API not supported"));
      }
    });
  });
}

startTest()
  .then(() => {
    tabSwitch();
    behavior();
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
          radio.className = q.type;
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
        textarea.className = q.type;
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
