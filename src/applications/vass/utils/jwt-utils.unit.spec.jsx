import { expect } from 'chai';
import { base64UrlEncode, base64UrlDecode, decodeJwt } from './jwt-utils';
import { createMockJwt } from './mock-helpers';

describe('VASS Utils: jwt-utils', () => {
  describe('base64UrlEncode', () => {
    it('should encode a string to base64url format', () => {
      const input = 'Hello, World!';
      const encoded = base64UrlEncode(input);

      expect(encoded).to.be.a('string');
      // base64url should not contain +, /, or = characters
      expect(encoded).to.not.include('+');
      expect(encoded).to.not.include('/');
      expect(encoded).to.not.include('=');
    });

    it('should return null for empty or falsy input', () => {
      expect(base64UrlEncode(null)).to.be.null;
      expect(base64UrlEncode(undefined)).to.be.null;
      expect(base64UrlEncode('')).to.be.null;
    });
  });

  describe('base64UrlDecode', () => {
    it('should decode a base64url encoded string', () => {
      const original = 'Hello, World!';
      const encoded = base64UrlEncode(original);
      const decoded = base64UrlDecode(encoded);

      expect(decoded).to.equal(original);
    });

    it('should return null for empty or falsy input', () => {
      expect(base64UrlDecode(null)).to.be.null;
      expect(base64UrlDecode(undefined)).to.be.null;
      expect(base64UrlDecode('')).to.be.null;
    });

    it('should handle strings that need padding', () => {
      // Test with a string that produces base64 without padding
      const testData = 'test';
      const encoded = base64UrlEncode(testData);
      const decoded = base64UrlDecode(encoded);

      expect(decoded).to.equal(testData);
    });
  });

  describe('decodeJwt', () => {
    it('should decode a valid JWT and return header, payload, and signature', () => {
      const token = createMockJwt('test-uuid-123');
      const result = decodeJwt(token);

      expect(result).to.be.an('object');
      expect(result).to.have.property('header');
      expect(result).to.have.property('payload');
      expect(result).to.have.property('signature');

      // Check header
      expect(result.header).to.deep.include({ alg: 'HS256', typ: 'JWT' });

      // Check payload
      expect(result.payload.sub).to.equal('test-uuid-123');
      expect(result.payload.jti).to.equal('mock-jti');
      expect(result.payload).to.have.property('iat');
      expect(result.payload).to.have.property('exp');
    });

    it('should throw an error for invalid JWT format (not 3 parts)', () => {
      expect(() => decodeJwt('invalid-token')).to.throw('Invalid JWT format');
      expect(() => decodeJwt('only.two')).to.throw('Invalid JWT format');
      expect(() => decodeJwt('too.many.parts.here')).to.throw(
        'Invalid JWT format',
      );
    });

    it('should throw an error for malformed base64 payload', () => {
      expect(() => decodeJwt('header.!!!invalid!!!.signature')).to.throw();
    });
  });
});
