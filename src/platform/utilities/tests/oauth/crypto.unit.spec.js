import { expect } from 'chai';
import {
  sha256,
  base64UrlEncode,
  generateRandomString,
} from '../../oauth/crypto';

describe('OAuth - crypto.js', () => {
  describe('sha256', () => {
    it('returns a Promise <ArrayBuffer>', () => {
      expect(sha256('hello')).resolves(new ArrayBuffer(32));
    });
    it('should return null if parameter is empty', () => {
      expect(sha256()).to.be.null;
    });
  });

  describe('base64UrlEncode', () => {
    it('should base64urlencode a string', () => {
      expect(base64UrlEncode('hello')).to.be.a.string;
    });
    it('should not generate for empty parameter', () => {
      expect(base64UrlEncode()).to.be.null;
      expect(base64UrlEncode('')).to.be.null;
    });
  });
  describe('generateRandomString', () => {
    it('should generate a random string given a length', () => {
      expect(generateRandomString(16)).to.have.lengthOf(16);
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
