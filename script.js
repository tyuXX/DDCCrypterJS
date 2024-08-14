// Function to generate a random key based on the selected encryption engine
document.getElementById('generateKeyBtn').addEventListener('click', async () => {
    const keyInput = document.getElementById('key');
    const selectedEngine = document.getElementById('encryptionType').value;
    const engine = registeredengines.find(engine => engine.id === selectedEngine);
    
    if (engine) {
        let keyLength;
        if (keyInput.value) {
            // Use the provided text as a seed
            keyLength = engine.id === 'aes' ? 16 : 8;
            const key = await seedToKey(keyInput.value, keyLength);
            keyInput.value = key;
        } else {
            // Generate a completely random key
            keyLength = engine.id === 'aes' ? 16 : 8;
            keyInput.value = engine.keygen(keyLength);
        }
    }
});

// Function to handle encryption
document.getElementById('encryptBtn').addEventListener('click', async () => {
    const plaintext = document.getElementById('plaintext').value;
    const key = document.getElementById('key').value;
    const selectedEngine = document.getElementById('encryptionType').value;
    const engine = registeredengines.find(engine => engine.id === selectedEngine);

    if (engine) {
        const ciphertext = await engine.encrypt(plaintext, key);
        document.getElementById('output').value = ciphertext;
    }
});

// Function to handle decryption
document.getElementById('decryptBtn').addEventListener('click', async () => {
    const ciphertext = document.getElementById('plaintext').value;
    const key = document.getElementById('key').value;
    const selectedEngine = document.getElementById('encryptionType').value;
    const engine = registeredengines.find(engine => engine.id === selectedEngine);

    if (engine) {
        const plaintext = await engine.decrypt(ciphertext, key);
        document.getElementById('output').value = plaintext;
    }
});
