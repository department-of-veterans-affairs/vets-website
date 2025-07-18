import { expect } from 'chai';
import { randomFillSync } from 'crypto';
import {
  sha256,
  base64UrlEncode,
  generateRandomString,
} from '../../oauth/crypto';
import { mockCrypto } from '../../oauth/mockCrypto';

describe('OAuth - Crypto', () => {
  before(() => {
    window.crypto = mockCrypto;
  });

  describe('sha256', () => {
    const randomInput = generateRandomString(64);

    it('returns a Promise<ArrayBuffer>', async () => {
      const hashed = await sha256(randomInput);
      expect(hashed).to.be.instanceof(ArrayBuffer);
      expect(hashed.byteLength).to.equal(32);
    });

    it('returns valid hash for an empty string', async () => {
      const result = await sha256('');
      expect(result).to.be.instanceof(ArrayBuffer);
      expect(result.byteLength).to.equal(32);
    });
  });

  describe('base64UrlEncode', () => {
    it('encodes a normal string', () => {
      expect(base64UrlEncode('hello')).to.be.a('string');
    });

    it('replaces + and / with - and _', () => {
      expect(base64UrlEncode('h+llo')).to.eql('aCtsbG8');
      expect(base64UrlEncode('jell//o')).to.eql('amVsbC8vbw');
    });

    it('returns null for empty or undefined input', () => {
      expect(base64UrlEncode()).to.be.null;
      expect(base64UrlEncode('')).to.be.null;
    });
  });

  describe('generateRandomString', () => {
    const mock = {
      getRandomValues(buffer) {
        return randomFillSync(buffer);
      },
    };

    before(() => {
      window.crypto = mock;
    });

    it('generates a string of the correct length', () => {
      expect(generateRandomString(28).length).to.equal(56);
      expect(generateRandomString(64).length).to.equal(128);
      expect(generateRandomString(128).length).to.equal(256);
    });

    it('does not generate the same string twice', () => {
      const str = generateRandomString(16);
      const generated = Array.from({ length: 28 }).map(() =>
        generateRandomString(16),
      );
      expect(generated.includes(str)).to.be.false;
    });
  });
});
