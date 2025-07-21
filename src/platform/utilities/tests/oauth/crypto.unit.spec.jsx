import { expect } from 'chai';
import {
  sha256,
  base64UrlEncode,
  generateRandomString,
} from '../../oauth/crypto';

describe('OAuth - Crypto', () => {
  describe('sha256', () => {
    it('returns a SHA-256 hash as ArrayBuffer', async () => {
      const input = 'test-input';
      const result = await sha256(input);

      expect(result).to.be.instanceOf(ArrayBuffer);
      expect(result.byteLength).to.equal(32);
    });

    it('returns SHA-256 hash of an empty string', async () => {
      const result = await sha256('');
      expect(result).to.be.instanceOf(ArrayBuffer);
      expect(result.byteLength).to.equal(32);
    });
  });

  describe('base64UrlEncode', () => {
    it('encodes a string into base64url format', () => {
      const result = base64UrlEncode('hello');
      expect(result).to.be.a('string');
      expect(result).to.equal('aGVsbG8');
    });

    it('replaces "+" and "/" with "-" and "_" respectively', () => {
      // "+" -> "-", "/" -> "_"
      const input = String.fromCharCode(251, 239);
      const encoded = base64UrlEncode(input);
      expect(encoded).to.match(/[-_]/);
    });

    it('returns null when input is empty or undefined', () => {
      expect(base64UrlEncode()).to.be.null;
      expect(base64UrlEncode('')).to.be.null;
    });

    it('encodes an ArrayBuffer', async () => {
      const buffer = await sha256('buffer-test');
      const result = base64UrlEncode(buffer);
      expect(result).to.be.a('string');
      expect(result.length).to.be.greaterThan(0);
    });
  });

  describe('generateRandomString', () => {
    it('generates a string of expected hex length', () => {
      const len = 16;
      const str = generateRandomString(len);
      expect(str).to.be.a('string');
      expect(str.length).to.equal(len * 2);
    });

    it('produces different strings on repeated calls', () => {
      const outputs = new Set();
      for (let i = 0; i < 10; i++) {
        outputs.add(generateRandomString(16));
      }
      expect(outputs.size).to.equal(10);
    });
  });
});
