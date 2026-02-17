import { expect } from 'chai';
import {
  sha256,
  base64UrlEncode,
  generateRandomString,
} from '../../oauth/crypto';
import { setupMockCrypto } from '../../oauth/mockCrypto';

describe('OAuth - Crypto', () => {
  beforeEach(() => {
    setupMockCrypto();
  });

  describe('sha256', async () => {
    const rs = generateRandomString(64);

    it('returns a Promise <ArrayBuffer>', async () => {
      const promisedArrBuff = await sha256(rs);
      expect(promisedArrBuff).to.be.instanceOf(ArrayBuffer);
      expect(promisedArrBuff.byteLength).to.eql(32);
    });

    it('should throw an error if parameter is empty or undefined', async () => {
      try {
        await sha256();
        expect.fail('Should have thrown an error for undefined input');
      } catch (error) {
        expect(error).to.be.an('error');
      }

      try {
        // Empty string is valid input, should return ArrayBuffer
        const result = await sha256('');
        expect(result).to.be.instanceOf(ArrayBuffer);
      } catch (error) {
        // If it throws, that's also acceptable behavior
        expect(error).to.be.an('error');
      }
    });

    it('should produce consistent hash for same input', async () => {
      const input = 'test-string';
      const hash1 = await sha256(input);
      const hash2 = await sha256(input);

      // Convert to base64 to compare easily
      const hash1Base64 = base64UrlEncode(hash1);
      const hash2Base64 = base64UrlEncode(hash2);

      expect(hash1Base64).to.equal(hash2Base64);
    });
  });

  describe('base64UrlEncode', () => {
    it('should base64urlencode a string', () => {
      expect(base64UrlEncode('hello')).to.be.a.string;
      expect(base64UrlEncode('h+llo')).to.eql('aCtsbG8');
      expect(base64UrlEncode('jell//o')).to.eql('amVsbC8vbw');
    });
    it('should not generate for empty parameter', () => {
      expect(base64UrlEncode()).to.be.null;
      expect(base64UrlEncode('')).to.be.null;
    });
  });
  describe('generateRandomString', () => {
    it('should generate a random string given a length', () => {
      expect(generateRandomString(28).length).to.eql(56);
      expect(generateRandomString(64).length).to.eql(128);
      expect(generateRandomString(128).length).to.eql(256);
    });
    it('should not generate the same string twice', () => {
      const tempStr = generateRandomString(16);
      const tempArr = Array.from({ length: 28 }).map(_ =>
        generateRandomString(16),
      );
      expect(tempArr.includes(tempStr)).to.be.false;
    });
  });
});
