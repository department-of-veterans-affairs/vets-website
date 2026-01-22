import { expect } from 'chai';
import sinon from 'sinon';
import Cookies from 'js-cookie';
import {
  decodeJwt,
  isTokenExpired,
  getVassToken,
  getValidVassToken,
  removeVassToken,
} from './auth';
import { createMockJwt } from './mock-helpers';
import { VASS_TOKEN_COOKIE_NAME } from './constants';

describe('VASS Utils: auth', () => {
  describe('decodeJwt', () => {
    it('should decode a valid JWT and return the payload', () => {
      const token = createMockJwt('test-uuid-123');
      const payload = decodeJwt(token);

      expect(payload).to.be.an('object');
      expect(payload.sub).to.equal('test-uuid-123');
      expect(payload.jti).to.equal('mock-jti');
      expect(payload).to.have.property('iat');
      expect(payload).to.have.property('exp');
    });

    it('should return null for null or undefined token', () => {
      expect(decodeJwt(null)).to.be.null;
      expect(decodeJwt(undefined)).to.be.null;
    });

    it('should return null for empty string', () => {
      expect(decodeJwt('')).to.be.null;
    });

    it('should return null for invalid JWT format (not 3 parts)', () => {
      expect(decodeJwt('invalid-token')).to.be.null;
      expect(decodeJwt('only.two')).to.be.null;
      expect(decodeJwt('too.many.parts.here')).to.be.null;
    });

    it('should return null for malformed base64 payload', () => {
      expect(decodeJwt('header.!!!invalid!!!.signature')).to.be.null;
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for a valid non-expired token', () => {
      const token = createMockJwt('test-uuid', 3600); // expires in 1 hour
      expect(isTokenExpired(token)).to.be.false;
    });

    it('should return true for an expired token', () => {
      const token = createMockJwt('test-uuid', -3600); // expired 1 hour ago
      expect(isTokenExpired(token)).to.be.true;
    });

    it('should return true for a token that expired exactly now', () => {
      const token = createMockJwt('test-uuid', 0); // expires now
      expect(isTokenExpired(token)).to.be.true;
    });

    it('should return true for null or undefined token', () => {
      expect(isTokenExpired(null)).to.be.true;
      expect(isTokenExpired(undefined)).to.be.true;
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).to.be.true;
    });

    it('should return true for token without exp claim', () => {
      // Create a token-like string without exp
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: 'test', iat: 123 })); // no exp
      const signature = btoa('signature');
      const tokenWithoutExp = `${header}.${payload}.${signature}`;

      expect(isTokenExpired(tokenWithoutExp)).to.be.true;
    });
  });

  describe('getVassToken', () => {
    let cookiesGetStub;

    beforeEach(() => {
      cookiesGetStub = sinon.stub(Cookies, 'get');
    });

    afterEach(() => {
      cookiesGetStub.restore();
    });

    it('should return the VASS token from cookies', () => {
      const mockToken = createMockJwt('test-uuid');
      cookiesGetStub.withArgs(VASS_TOKEN_COOKIE_NAME).returns(mockToken);

      const token = getVassToken();

      expect(cookiesGetStub.calledWith(VASS_TOKEN_COOKIE_NAME)).to.be.true;
      expect(token).to.equal(mockToken);
    });

    it('should return undefined when no token exists', () => {
      cookiesGetStub.withArgs(VASS_TOKEN_COOKIE_NAME).returns(undefined);

      const token = getVassToken();

      expect(token).to.be.undefined;
    });
  });

  describe('getValidVassToken', () => {
    let cookiesGetStub;

    beforeEach(() => {
      cookiesGetStub = sinon.stub(Cookies, 'get');
    });

    afterEach(() => {
      cookiesGetStub.restore();
    });

    it('should return the token when it exists and is not expired', () => {
      const validToken = createMockJwt('test-uuid', 3600);
      cookiesGetStub.withArgs(VASS_TOKEN_COOKIE_NAME).returns(validToken);

      const token = getValidVassToken();

      expect(token).to.equal(validToken);
    });

    it('should return null when token does not exist', () => {
      cookiesGetStub.withArgs(VASS_TOKEN_COOKIE_NAME).returns(undefined);

      const token = getValidVassToken();

      expect(token).to.be.null;
    });

    it('should return null when token is expired', () => {
      const expiredToken = createMockJwt('test-uuid', -3600);
      cookiesGetStub.withArgs(VASS_TOKEN_COOKIE_NAME).returns(expiredToken);

      const token = getValidVassToken();

      expect(token).to.be.null;
    });
  });

  describe('removeVassToken', () => {
    let cookiesRemoveStub;

    beforeEach(() => {
      cookiesRemoveStub = sinon.stub(Cookies, 'remove');
    });

    afterEach(() => {
      cookiesRemoveStub.restore();
    });

    it('should call Cookies.remove with the correct cookie name', () => {
      removeVassToken();

      expect(cookiesRemoveStub.calledWith(VASS_TOKEN_COOKIE_NAME)).to.be.true;
    });
  });
});
