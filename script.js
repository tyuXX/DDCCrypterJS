// Cache
const plaintext = document.getElementById("plaintext");
const keyInput = document.getElementById("key");
const selectedEngine = document.getElementById("encryptionType");
const output = document.getElementById("output");
const singleTextboxCheckbox = document.getElementById("singleTextboxCheckbox");

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

// Function to handle encryption
document.getElementById("encryptBtn").addEventListener("click", async () => {
  const engine = getEngine(selectedEngine.value);
  if (engine) {
    const text = plaintext.value;
    const key = keyInput.value;
    const result = await engine.encrypt(text, key);
    if (singleTextboxCheckbox.checked) {
      plaintext.value = result;
      output.style.display = "none";
    } else {
      output.value = result;
    }
  }
});

// Function to handle decryption
document.getElementById("decryptBtn").addEventListener("click", async () => {
  const engine = getEngine(selectedEngine.value);
  if (engine) {
    const text = plaintext.value;
    const key = keyInput.value;
    const result = await engine.decrypt(text, key);
    if (singleTextboxCheckbox.checked) {
      plaintext.value = result;
      output.style.display = "none";
    } else {
      output.value = result;
    }
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
