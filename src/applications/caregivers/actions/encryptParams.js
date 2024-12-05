export async function encryptData(value, base64Key) {
  // Decode the base64-encoded key
  const key = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

  if (key.length !== 32) {
    throw new Error('AES key must be 256 bits (32 bytes)');
  }

  // Import the key into the Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  );

  // Generate a random IV (initialization vector)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the data
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoder.encode(value),
  );

  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, encryptedArray.length - 16); // All except the last 16 bytes
  const authTag = encryptedArray.slice(encryptedArray.length - 16); // Last 16 bytes is the authentication tag

  // Combine IV, ciphertext, and authTag for final encrypted data
  const combined = new Uint8Array([...iv, ...ciphertext, ...authTag]);
  const base64 = btoa(String.fromCharCode(...combined));

  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Remove any trailing "=" padding
}
