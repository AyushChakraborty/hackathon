const apiBaseUrl = "http://127.0.0.1:5000";

const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get("test_id");

if (!testId) {
  alert("Missing test ID in URL. Use ?test_id=your_test_id");
  throw new Error("Missing test_id");
}

fetch(`${apiBaseUrl}/test/${testId}`)
  .then((res) => {
    if (!res.ok) {
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
      questionDiv.appendChild(label);

      if (q.type === "mcq") {
        q.options.forEach((option) => {
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = q.id;
          radio.value = option;

          const optionLabel = document.createElement("span");
          optionLabel.textContent = option;

          const wrapper = document.createElement("div");
          wrapper.appendChild(radio);
          wrapper.appendChild(optionLabel);
          questionDiv.appendChild(wrapper);
        });
      } else if (q.type === "text") {
        const input = document.createElement("textarea");
        input.name = q.id;
        questionDiv.appendChild(input);
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
