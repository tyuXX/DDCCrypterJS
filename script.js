//Cache
const plaintext = document.getElementById("plaintext");
const keyInput = document.getElementById("key");
const selectedEngine = document.getElementById("encryptionType");
const output = document.getElementById("output");

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
    output.value = await engine.encrypt(plaintext.value, key.value);
  }
});

// Function to handle decryption
document.getElementById("decryptBtn").addEventListener("click", async () => {
  const engine = getEngine(selectedEngine.value);
  if (engine) {
    output.value = await engine.decrypt(plaintext.value, keyInput.value);
  }
});
