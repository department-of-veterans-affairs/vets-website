import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONFailure as setFetchFailure,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';
import { createHash, randomFillSync } from 'crypto';
import { AUTHORIZE_KEYS } from '../../oauth/constants';
import * as oAuthUtils from '../../oauth/utilities';

function getArrayBufferOrView(buffer) {
  if (Buffer.isBuffer(buffer)) {
    return buffer;
  }
  if (typeof buffer === 'string') {
    return Buffer.from(buffer, 'utf8');
  }
  return buffer;
}

describe('OAuth - Utilities', () => {
  const globalCrypto = global.crypto;
  const mockCrypto = {
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

  beforeEach(() => {
    window.crypto = mockCrypto;
  });

  afterEach(() => {
    window.crypto = globalCrypto;
  });

  describe('pkceChallengeFromVerifier', () => {
    it('should generate a code challenge from verifier', async () => {
      const codeChallenge = await oAuthUtils.pkceChallengeFromVerifier('hello');
      const codeChallenge2 = await oAuthUtils.pkceChallengeFromVerifier(
        'somesuperlongrandomsecurestring',
      );
      expect(codeChallenge).to.eql(
        'LPJNul-wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ',
      );
      expect(codeChallenge.length).to.eql(43);
      expect(codeChallenge2.length).to.eql(43);
    });
    it('should return null if parameter is empty', async () => {
      const emptyString = await oAuthUtils.pkceChallengeFromVerifier('');
      const undefinedPkce = await oAuthUtils.pkceChallengeFromVerifier();

      expect(emptyString).to.be.null;
      expect(undefinedPkce).to.be.null;
    });
  });

  describe('saveStateAndVerifier', () => {
    it('should check to see if state is included in window.location', () => {
      window.location = new URL('https://va.gov/?state=some_random_state');
      expect(oAuthUtils.saveStateAndVerifier()).to.be.null;
      window.location.search = '';
    });
    it('should set sessionStorage', () => {
      oAuthUtils.saveStateAndVerifier();
      expect(!!window.sessionStorage.getItem('state')).to.be.true;
      expect(!!window.sessionStorage.getItem('code_verifier')).to.be.true;
    });
    it('should return an object with state and codeVerifier', () => {
      const { state, codeVerifier } = oAuthUtils.saveStateAndVerifier();
      expect(window.sessionStorage.getItem('state')).to.eql(state);
      expect(window.sessionStorage.getItem('code_verifier')).to.eql(
        codeVerifier,
      );
    });
  });

  describe('createOAuthRequest', () => {
    it('should generate the proper url based on `csp`', () => {
      ['logingov', 'idme'].forEach(async csp => {
        await oAuthUtils.createOAuthRequest(csp);
        expect(window.location.href).to.include(csp);
      });
    });
    it('should append additional params', async () => {
      expect(window.location.search).to.eql('');
      await oAuthUtils.createOAuthRequest('logingov');
      Object.values(AUTHORIZE_KEYS).forEach(key => {
        const searchParams = new URLSearchParams(window.location.search);
        expect(searchParams.has(key)).to.be.true;
      });
    });
    it('should change window.location to url', async () => {
      const originalLocation = window.location.href;
      expect(originalLocation).to.eql('http://localhost/');
      await oAuthUtils.createOAuthRequest('idme');
      expect(window.location.href).to.not.eql(originalLocation);
    });
  });

  describe('getCV', () => {
    it('should return null when empty', () => {
      expect(oAuthUtils.getCV()).to.eql({ codeVerifier: null });
    });
    it('should return code_verifier when in session storage', () => {
      const cvValue = 'success_getCV';
      window.sessionStorage.setItem('code_verifier', cvValue);
      expect(oAuthUtils.getCV()).to.eql({
        codeVerifier: cvValue,
      });
      window.sessionStorage.clear();
    });
  });

  describe('buildTokenRequest', () => {
    it('should not generate url if no `code` is provider or `code_verifier` is null', async () => {
      const btr = await oAuthUtils.buildTokenRequest();
      expect(btr).to.be.null;
      const btr2 = oAuthUtils.buildTokenRequest({ code: 'hello' });
      expect(btr2).to.be.null;
    });
    it('should generate a proper url with appropriate query params', async () => {
      const cvValue = 'success_buildTokenRequest';
      window.sessionStorage.setItem('code_verifier', cvValue);
      const tokenPath = `https://dev-api.va.gov/v0/sign_in/token?grant_type=authorization_code&client_id=web&redirect_uri=https%253A%252F%252Fdev.va.gov&code=hello&code_verifier=${cvValue}`;
      const btr = await oAuthUtils.buildTokenRequest({ code: 'hello' });
      expect(btr.href).to.eql(tokenPath);
      expect(btr.href).includes('code=');
      expect(btr.href).includes('code_verifier=');
    });
  });

  describe('requestToken', () => {
    it('should fail if url is not generated', async () => {
      const req2 = await oAuthUtils.requestToken({ code: 'test' });
      expect(req2).to.eql(null);
    });
    it('should POST successfully to `/token` endpoint', async () => {
      const cvValue = 'tst';
      global.sessionStorage.setItem('code_verifier', cvValue);
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), []);
      const tokenOptions = await oAuthUtils.requestToken({ code: 'success' });
      expect(tokenOptions).to.not.be.null;
      expect(global.fetch.calledOnce).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
      expect(global.fetch.firstCall.args[0].includes('/token')).to.be.true;
    });
    it('should return an error if `/token` endpoint unsuccessful', async () => {
      const cvValue = 'tst';
      global.sessionStorage.setItem('code_verifier', cvValue);
      mockFetch();
      setFetchFailure(global.fetch.onFirstCall(), []);
      const tokenOptions = await oAuthUtils.requestToken({
        code: 'failure',
      });
      expect(global.fetch.calledOnce).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
      expect(global.fetch.firstCall.args[0].includes('/token')).to.be.true;
      expect(tokenOptions.ok).to.be.false;
    });
  });
});
