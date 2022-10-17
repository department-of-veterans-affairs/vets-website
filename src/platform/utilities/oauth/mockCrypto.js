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
        resolve(
          createHash(_algorithm)
            .update(_data)
            .digest(),
        );
      });
    },
  },
};
