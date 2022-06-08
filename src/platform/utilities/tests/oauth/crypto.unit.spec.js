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
      expect(promisedArrBuff).to.be.a('string');
      expect(promisedArrBuff.byteLength).to.eql(32);
    });
    it('should return null if parameter is empty', () => {
      expect(sha256()).to.be.null;
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
