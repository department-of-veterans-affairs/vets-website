import { createHash, randomFillSync } from 'crypto';

function getArrayBufferOrView(buffer) {
  if (Buffer.isBuffer(buffer)) {
    return buffer;
  }
  if (typeof buffer === 'string') {
    return Buffer.from(buffer, 'utf8');
  }
  return buffer;
}

// Only use for unit-tests
export const mockCrypto = {
  getRandomValues(buffer) {
    return randomFillSync(buffer);
  },
  subtle: {
    digest(algorithm = 'SHA-256', data) {
      const _algorithm = algorithm.toLowerCase().replace('-', '');
      const _data = getArrayBufferOrView(data);

      return new Promise((resolve, _) => {
        const buffer = createHash(_algorithm)
          .update(_data)
          .digest();
        // Convert Node Buffer to ArrayBuffer to match native crypto.subtle.digest()
        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        );
        resolve(arrayBuffer);
      });
    },
  },
};

/**
 * Sets up window.crypto with mockCrypto if native webcrypto.subtle is not available.
 * Node 14 has node:crypto but lacks webcrypto.subtle (added in Node 15).
 * Call this in beforeEach() for tests that use crypto functions.
 */
export const setupMockCrypto = () => {
  let hasWebCryptoSubtle = false;
  try {
    // eslint-disable-next-line import/no-unresolved, global-require
    const nodeCrypto = require('node:crypto');
    hasWebCryptoSubtle = !!nodeCrypto?.webcrypto?.subtle;
  } catch {
    hasWebCryptoSubtle = false;
  }

  if (!hasWebCryptoSubtle) {
    window.crypto = mockCrypto;
  }
};
