import { expect } from 'chai';
import { randomFillSync } from 'crypto';
import {
  sha256,
  base64UrlEncode,
  generateRandomString,
} from '../../oauth/crypto';

describe('OAuth - Crypto', () => {
  describe('sha256', async () => {
    const rs = generateRandomString(64);
    it('returns a Promise <ArrayBuffer>', async () => {
      const promisedArrBuff = await sha256(rs);
      expect(promisedArrBuff).to.be.an.instanceOf(ArrayBuffer);
      expect(promisedArrBuff.byteLength).to.eql(32);
    });
    it('should return ArrayBuffer corresponding to hash of "undefined" if parameter is empty', async () => {
      const promisedArrBuff = await sha256();
      const hashArray = Array.from(new Uint8Array(promisedArrBuff));
      const hashHex = hashArray
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join(''); // Convert bytes to hex
      expect(hashHex).to.equal(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      );
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
    const mockCrypto = {
      getRandomValues(buffer) {
        return randomFillSync(buffer);
      },
    };
    it('should generate a random string given a length', () => {
      window.crypto = mockCrypto;
      expect(generateRandomString(28).length).to.eql(56);
      expect(generateRandomString(64).length).to.eql(128);
      expect(generateRandomString(128).length).to.eql(256);
    });
    it('should not generate the same string twice', () => {
      window.crypto = mockCrypto;
      const tempStr = generateRandomString(16);
      const tempArr = Array.from({ length: 28 }).map(_ =>
        generateRandomString(16),
      );
      expect(tempArr.includes(tempStr)).to.be.false;
    });
  });
});
