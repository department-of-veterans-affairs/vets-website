import { expect } from 'chai';
import { createHash, randomFillSync } from 'crypto';
import { OAUTH_KEYS } from '../../oauth/constants';
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
      expect(codeChallenge).to.include('==');
      expect(codeChallenge.length).to.eql(248);
    });
    it('should return null if parameter is empty', async () => {
      const emptyString = await oAuthUtils.pkceChallengeFromVerifier('');
      const undefinedPkce = await oAuthUtils.pkceChallengeFromVerifier();

      expect(emptyString).to.be.null;
      expect(undefinedPkce).to.be.null;
    });
  });

  describe('getOAuthConfig', () => {
    it('should return proper `state` and `codeVerifier`', () => {
      expect(
        oAuthUtils.getOAuthConfig('sampleState', 'sampleCodeChallenge'),
      ).to.includes({
        [OAUTH_KEYS.STATE]: 'sampleState',
        [OAUTH_KEYS.CODE_CHALLENGE]: 'sampleCodeChallenge',
      });
    });
    it('should not return empty state or codeVerifier', () => {
      expect(oAuthUtils.getOAuthConfig()).to.eql({});
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
      Object.values(OAUTH_KEYS).forEach(key => {
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
});
