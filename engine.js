//#region Registry
var registeredengines = [
  {
    id:"custom",
    name: "Custom",
    source: "Built-In",
    encrypt: null,
    decrypt: null,
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 0,
    },
  },
  {
    id: "caesar",
    name: "Caesar Cipher",
    source: "Built-In",
    encrypt: (text, key) => caesarCipher(text, key),
    decrypt: (text, key) => caesarCipher(text, -key),
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 8,
    },
  },
  {
    id: "aes128",
    name: "AES-128",
    source: "Built-In",
    encrypt: (text, key) => aes128Encrypt(text, key),
    decrypt: (text, key) => aes128Decrypt(text, key),
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 16,
    },
  },
  {
    id: "aes256",
    name: "AES-256",
    source: "Built-In",
    encrypt: (text, key) => aesEncrypt(text, key),
    decrypt: (text, key) => aesDecrypt(text, key),
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 32,
    },
  },
  {
    id: "des",
    name: "DES",
    source: "Built-In",
    encrypt: (text, key) => desEncrypt(text, key),
    decrypt: (text, key) => desDecrypt(text, key),
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 8,
    },
  },
  {
    id: "base64",
    name: "Base64",
    source: "Built-In",
    encrypt: (text) => base64Encrypt(text),
    decrypt: (text) => base64Decrypt(text),
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 0,
    },
  },
  {
    id: "xor",
    name: "XOR",
    source: "Built-In",
    encrypt: (text, key) => xorEncrypt(text, key),
    decrypt: (text, key) => xorDecrypt(text, key),
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 8,
    },
  },
  {
    id: "rot13",
    name: "ROT13",
    source: "Built-In",
    encrypt: (text) => rot13(text),
    decrypt: (text) => rot13(text),
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 0,
    },
  },
  {
    id: "none",
    name: "None",
    source: "Built-In",
    encrypt: (text) => text,
    decrypt: (text) => text,
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 0,
    },
  },
  {
    id: "rot47",
    name: "ROT47",
    source: "Built-In",
    encrypt: (text) => rot47(text),
    decrypt: (text) => rot47(text),
    keygen: {
      func: (length) => generateRandomKey(length),
      length: 0,
    },
  },
];

function getEngine(id) {
  return registeredengines.find((engine) => engine.id === id);
}

function registerengine(id, name, source, encrypt, decrypt, keygenf, keygenl) {
  registeredengines.push({
    id,
    name,
    source,
    encrypt,
    decrypt,
    keygen: { keygenf, keygenl },
  });
}

function loadengines() {
  let selector = document.getElementById("encryptionType");

  for (let i = 0; i < registeredengines.length; i++) {
    let option = document.createElement("option");
    option.value = registeredengines[i].id;
    option.text =
      registeredengines[i].name + " - " + registeredengines[i].source;
    selector.appendChild(option);
  }
}

function reloadengines() {
  document.getElementById("encryptionType").innerHTML = "";
  loadengines();
}

loadengines();
//#endregion
for (const addon in document.getElementById("addons").children) {
    
}
//#region Addoning

//#endregion

//#region Simple
function caesarCipher(text, shift) {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      } else {
        return char;
      }
    })
    .join("");
}
function xorEncrypt(text, key) {
  return btoa(
    text
      .split("")
      .map((char, index) =>
        String.fromCharCode(
          char.charCodeAt(0) ^ key.charCodeAt(index % key.length)
        )
      )
      .join("")
  );
}
function xorDecrypt(text, key) {
  const decodedText = atob(text);
  const decryptedText = decodedText
    .split("")
    .map((char, index) =>
      String.fromCharCode(
        char.charCodeAt(0) ^ key.charCodeAt(index % key.length)
      )
    )
    .join("");
  return decryptedText;
}
//#endregion

//#region Hashes
async function generateSHA256Hash(data) {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
//#endregion

//#region KeyGen
function generateRandomKey(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array)).slice(0, length);
}

function seedToKey(seed, length) {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);
  const hash = window.crypto.subtle.digest("SHA-256", data);
  return hash.then((buffer) => {
    const hashArray = Array.from(new Uint8Array(buffer));
    return hashArray
      .map((b) => String.fromCharCode(b))
      .join("")
      .slice(0, length);
  });
}
//#endregion

//#region AES
async function aes128Encrypt(text, key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );
  // Generate a random Initialization Vector (IV)
  const iv = crypto.getRandomValues(new Uint8Array(16));
  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    data
  );
  // Combine IV and encrypted data into a single Uint8Array
  const encryptedArray = new Uint8Array(encryptedData);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);
  // Convert combined data to Base64 string
  return btoa(String.fromCharCode.apply(null, combined));
}
async function aes128Decrypt(encryptedText, key) {
  const decoder = new TextDecoder();
  // Decode the Base64 encoded string
  const combinedData = atob(encryptedText);
  const combinedArray = new Uint8Array(combinedData.length);
  // Convert the decoded string to a byte array
  for (let i = 0; i < combinedData.length; i++) {
    combinedArray[i] = combinedData.charCodeAt(i);
  }
  // Extract the IV (first 16 bytes) and encrypted data (remaining bytes)
  const iv = combinedArray.slice(0, 16);
  const encryptedData = combinedArray.slice(16);
  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    encryptedData
  );
  return decoder.decode(decryptedData);
}
async function aes256Encrypt(text, key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  // Ensure the key is exactly 32 bytes for AES-256
  const keyBytes = encoder.encode(key);
  if (keyBytes.length !== 32) {
    throw new Error("Key must be 32 bytes long for AES-256");
  }
  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );
  // Generate a random Initialization Vector (IV)
  const iv = crypto.getRandomValues(new Uint8Array(16));
  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    data
  );
  // Combine IV and encrypted data into a single Uint8Array
  const encryptedArray = new Uint8Array(encryptedData);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);
  // Convert combined data to Base64 string
  return btoa(String.fromCharCode(...combined));
}
async function aes256Decrypt(encryptedText, key) {
  const decoder = new TextDecoder();
  // Decode the Base64 encoded string
  const combinedData = atob(encryptedText);
  const combinedArray = new Uint8Array(combinedData.length);
  // Convert the decoded string to a byte array
  for (let i = 0; i < combinedData.length; i++) {
    combinedArray[i] = combinedData.charCodeAt(i);
  }
  // Extract the IV (first 16 bytes) and encrypted data (remaining bytes)
  const iv = combinedArray.slice(0, 16);
  const encryptedData = combinedArray.slice(16);
  // Ensure the key is exactly 32 bytes for AES-256
  const keyBytes = new TextEncoder().encode(key);
  if (keyBytes.length !== 32) {
    throw new Error("Key must be 32 bytes long for AES-256");
  }
  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    encryptedData
  );
  return decoder.decode(decryptedData);
}
//#endregion

//#region DES
async function desEncrypt(text, key) {
  const encodedText = new TextEncoder().encode(text);
  const encodedKey = new TextEncoder().encode(key);

  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    encodedKey.slice(0, 8), // Use first 8 bytes for DES
    { name: "DES-CBC" },
    false,
    ["encrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(8)); // Initialization vector for DES
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "DES-CBC", iv: iv },
    cryptoKey,
    encodedText
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);

  return btoa(String.fromCharCode(...combined));
}

async function desDecrypt(encryptedText, key) {
  const combined = new Uint8Array(
    atob(encryptedText)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  const iv = combined.slice(0, 8);
  const encryptedData = combined.slice(8);

  const encodedKey = new TextEncoder().encode(key);
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    encodedKey.slice(0, 8), // Use first 8 bytes for DES
    { name: "DES-CBC" },
    false,
    ["decrypt"]
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "DES-CBC", iv: iv },
    cryptoKey,
    encryptedData
  );

  return new TextDecoder().decode(decrypted);
}
//#endregion

//#region Base64
function base64Encrypt(text) {
  return btoa(text);
}
function base64Decrypt(encodedText) {
  return atob(encodedText);
}
//#endregion

//#region Rot
function rot13(text) {
  return text
    .split("")
    .map((char) => {
      // Check if the character is a letter
      if (char >= "a" && char <= "z") {
        // Shift within the lowercase letters
        return String.fromCharCode(((char.charCodeAt(0) - 97 + 13) % 26) + 97);
      } else if (char >= "A" && char <= "Z") {
        // Shift within the uppercase letters
        return String.fromCharCode(((char.charCodeAt(0) - 65 + 13) % 26) + 65);
      } else {
        // Non-alphabet characters remain unchanged
        return char;
      }
    })
    .join("");
}
function rot47(text) {
  return text
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);

      // ROT47 operates on the range of ASCII characters from 33 (!) to 126 (~)
      if (charCode >= 33 && charCode <= 126) {
        // Shift the character by 47 positions within the range
        return String.fromCharCode(((charCode - 33 + 47) % 94) + 33);
      } else {
        // Non-ASCII characters remain unchanged
        return char;
      }
    })
    .join("");
}

//#endregion
