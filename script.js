// Cache
const plaintext = document.getElementById("plaintext");
const keyInput = document.getElementById("key");
const selectedEngine = document.getElementById("encryptionType");
const output = document.getElementById("output");
const singleTextboxCheckbox = document.getElementById("singleTextboxCheckbox");
const customEncryptionMenu = document.getElementById("customEncryptionMenu");
const openMenuBtn = document.getElementById("openMenuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const addStepBtn = document.getElementById("addStepBtn");
const stepsContainer = document.getElementById("stepsContainer");

// Function to open the custom encryption menu
openMenuBtn.addEventListener("click", () => {
  customEncryptionMenu.style.display = "block";
});

// Function to close the custom encryption menu
closeMenuBtn.addEventListener("click", () => {
  customEncryptionMenu.style.display = "none";
});

// Function to add a new step to the custom encryption menu
addStepBtn.addEventListener("click", () => {
  const stepDiv = document.createElement("div");
  stepDiv.classList.add("step");

  // Create algorithm selection
  const algorithmSelect = document.createElement("select");
  const algorithms = registeredengines.filter((engine) => engine.id !== "none");

  algorithms.forEach((engine) => {
    const option = document.createElement("option");
    option.value = engine.id;
    option.text = engine.name;
    algorithmSelect.appendChild(option);
  });

  // Create number of times input
  const timesInput = document.createElement("input");
  timesInput.type = "number";
  timesInput.placeholder = "Number of times";

  // Create custom key input
  const customKeyInput = document.createElement("input");
  customKeyInput.type = "text";
  customKeyInput.placeholder = "Custom key (optional)";

  stepDiv.appendChild(algorithmSelect);
  stepDiv.appendChild(timesInput);
  stepDiv.appendChild(customKeyInput);

  stepsContainer.appendChild(stepDiv);
});

// Function to apply the custom encryption steps
async function applyCustomEncryption(text, key, steps) {
  let result = text;

  for (const step of steps) {
    const engine = getEngine(step.algorithm);
    if (engine) {
      const stepKey = step.customKey || key;
      for (let i = 0; i < step.times; i++) {
        result = await engine.encrypt(result, stepKey);
      }
    }
  }

  return result;
}

// Function to generate a random key based on the selected encryption engine
document
  .getElementById("generateKeyBtn")
  .addEventListener("click", async () => {
    const engine = getEngine(selectedEngine.value);
    if (engine) {
      const keyLength = engine.keygen.length;
      let key;
      if (keyInput.value) {
        // Use the provided text as a seed
        key = await seedToKey(keyInput.value, keyLength);
      } else {
        // Generate a completely random key
        key = engine.keygen.func(keyLength);
      }
      keyInput.value = key;
    }
  });

// Modify the encryption button to use custom encryption
document.getElementById("encryptBtn").addEventListener("click", async () => {
  if (document.getElementById("encryptionType").value === "custom") {
    const steps = Array.from(
      document.querySelectorAll("#stepsContainer .step")
    ).map((stepDiv) => {
      const algorithm = stepDiv.querySelector("select").value;
      const times =
        parseInt(stepDiv.querySelector("input[type='number']").value) || 1;
      const customKey = stepDiv.querySelector("input[type='text']").value;
      return { algorithm, times, customKey };
    });

    output.value = await applyCustomEncryption(
      plaintext.value,
      keyInput.value,
      steps
    );
  } else {
    const engine = getEngine(selectedEngine.value);
    if (engine) {
      output.value = await engine.encrypt(plaintext.value, keyInput.value);
    }
  }
  if(singleTextboxCheckbox.checked){
    plaintext.value=output.value;
}
});

// Modify the decryption button to use custom decryption
document.getElementById("decryptBtn").addEventListener("click", async () => {
  if (document.getElementById("encryptionType").value === "custom") {
    const steps = Array.from(document.querySelectorAll("#stepsContainer .step"))
      .reverse()
      .map((stepDiv) => {
        const algorithm = stepDiv.querySelector("select").value;
        const times =
          parseInt(stepDiv.querySelector("input[type='number']").value) || 1;
        const customKey = stepDiv.querySelector("input[type='text']").value;
        return { algorithm, times, customKey };
      });

    const decryptedText = await applyCustomEncryption(
      plaintext.value,
      keyInput.value,
      steps
    );
    output.value = decryptedText;
  } else {
    const engine = getEngine(selectedEngine.value);
    if (engine) {
      output.value = await engine.decrypt(plaintext.value, keyInput.value);
    }
  }
  if(singleTextboxCheckbox.checked){
      plaintext.value=output.value;
  }
});

// Toggle the visibility of the output textbox based on the checkbox state
singleTextboxCheckbox.addEventListener("change", () => {
  if (singleTextboxCheckbox.checked) {
    output.style.display = "none";
  } else {
    output.style.display = "block";
  }
});
