//#region Registry
var registeredengines = [
    {
        id: 'caesar',
        name: 'Caesar Cipher',
        source: "Built-In",
        encrypt: (text, shift) => caesarCipher(text, shift),
        decrypt: (text, shift) => caesarCipher(text, -shift),
        keygen: (length) => generateRandomKey(length)
    },
    {
        id: 'aes',
        name: 'AES',
        source: "Built-In",
        encrypt: (text, key) => aesEncrypt(text, key),
        decrypt: (text, key) => aesDecrypt(text, key),
        keygen: (length) => generateRandomKey(length)
    },
    {
        id: 'des',
        name: 'DES',
        source: "Built-In",
        encrypt: (text, key) => desEncrypt(text, key),
        decrypt: (text, key) => desDecrypt(text, key),
        keygen: (length) => generateRandomKey(length)
    }
]

function registerengine(id,name,source,encrypt,decrypt,keygen) {
    registeredengines.push({id,name,source,encrypt,decrypt,keygen});
}

function loadengines() {
    let selector = document.getElementById('encryptionType');

    for (let i = 0; i < registeredengines.length; i++) {
        let option = document.createElement('option');
        option.value = registeredengines[i].id;
        option.text = registeredengines[i].name;
        selector.appendChild(option);
    }
}

loadengines();
//#endregion

//#region Simple
function caesarCipher(text, shift) {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        } else {
            return char;
        }
    }).join('');
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
    const hash = window.crypto.subtle.digest('SHA-256', data);
    return hash.then(buffer => {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map(b => String.fromCharCode(b)).join('').slice(0, length);
    });
}
//#endregion

//#region AES
function aesEncrypt(text, key) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv });
    return encrypted.toString();
}

async function aesEncrypt(text, key) {
    const encodedText = new TextEncoder().encode(text);
    const encodedKey = new TextEncoder().encode(key);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        encodedKey.slice(0, 16),  // Use first 16 bytes for AES-128
        { name: 'AES-CBC' },
        false,
        ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(16)); // Initialization vector
    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        encodedText
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.byteLength);

    return btoa(String.fromCharCode(...combined));
}

async function aesDecrypt(encryptedText, key) {
    const combined = new Uint8Array(atob(encryptedText).split("").map(char => char.charCodeAt(0)));
    const iv = combined.slice(0, 16);
    const encryptedData = combined.slice(16);

    const encodedKey = new TextEncoder().encode(key);
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        encodedKey.slice(0, 16),  // Use first 16 bytes for AES-128
        { name: 'AES-CBC' },
        false,
        ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        encryptedData
    );

    return new TextDecoder().decode(decrypted);
}
//#endregion

//#region DES
async function desEncrypt(text, key) {
    const encodedText = new TextEncoder().encode(text);
    const encodedKey = new TextEncoder().encode(key);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        encodedKey.slice(0, 8),  // Use first 8 bytes for DES
        { name: 'DES-CBC' },
        false,
        ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(8)); // Initialization vector for DES
    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'DES-CBC', iv: iv },
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
    const combined = new Uint8Array(atob(encryptedText).split("").map(char => char.charCodeAt(0)));
    const iv = combined.slice(0, 8);
    const encryptedData = combined.slice(8);

    const encodedKey = new TextEncoder().encode(key);
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        encodedKey.slice(0, 8),  // Use first 8 bytes for DES
        { name: 'DES-CBC' },
        false,
        ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'DES-CBC', iv: iv },
        cryptoKey,
        encryptedData
    );

    return new TextDecoder().decode(decrypted);
}
//#endregion
