import { expect } from 'chai';
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
      const cvValue = 'success';
      window.sessionStorage.setItem('code_verifier', cvValue);
      expect(oAuthUtils.getCV()).to.eql({
        codeVerifier: cvValue,
      });
      window.sessionStorage.clear();
    });
  });

  describe('buildTokenRequest', () => {
    it('should not generate url if no `code` is provider or `code_verifier` is null', () => {
      expect(oAuthUtils.buildTokenRequest()).to.be.null;
      expect(oAuthUtils.buildTokenRequest({ code: 'hello' })).to.be.null;
    });
    it('should generate a proper url with appropriate query params', () => {
      const cvValue = 'success';
      window.sessionStorage.setItem('code_verifier', cvValue);
      const tokenPath = `https://dev-api.va.gov/v0/sign_in/token?grant_type=authorization_code&client_id=web&redirect_uri=https%253A%252F%252Fdev.va.gov&code=hello&code_verifier=${cvValue}`;
      expect(oAuthUtils.buildTokenRequest({ code: 'hello' }).href).to.eql(
        tokenPath,
      );
    });
  });

  describe('requestToken', () => {
    it('should fail if url is no url or url does not contain `code` and `code_verifier`', () => {});
    it('should POST successfully to `/token` endpoint', () => {});
    it('should redirect to proper redirectUri or homepage', () => {});
  });
});
