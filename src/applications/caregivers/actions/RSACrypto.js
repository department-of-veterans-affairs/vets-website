export class RSACrypto {
  // Convert PEM public key to ArrayBuffer
  static pemToArrayBuffer(pem) {
    const b64 = pem.replace(
      /-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n/g,
      '',
    );
    const binaryString = atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Convert ArrayBuffer to Base64
  static arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  static async encrypt(value, publicKey) {
    const publicKeyBuffer = this.pemToArrayBuffer(publicKey);

    const cryptoKey = await window.crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
      },
      false,
      ['encrypt'],
    );

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(value);

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      cryptoKey,
      dataBuffer,
    );

    const encryptedValue = this.arrayBufferToBase64(encryptedData);
    return encodeURIComponent(encryptedValue);
  }
}
