/* eslint-disable camelcase */
import { expect } from 'chai';

import localStorage from 'platform/utilities/storage/localStorage';
import {
  mockFetch,
  setFetchJSONFailure as setFetchFailure,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';

import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import environment from 'platform/utilities/environment';
import {
  AUTHORIZE_KEYS_WEB,
  AUTHORIZE_KEYS_MOBILE,
  ALL_STATE_AND_VERIFIERS,
} from '../../oauth/constants';
import { mockCrypto } from '../../oauth/mockCrypto';
import * as oAuthUtils from '../../oauth/utilities';

function generateResponse({ headers }) {
  return new Response('{}', {
    headers: { ...headers },
    status: 200,
    text: () => 'ok',
    json: () => Promise.resolve({ status: 200 }),
  });
}

describe('OAuth - Utilities', () => {
  const globalCrypto = global.crypto;

  beforeEach(() => {
    window.crypto = mockCrypto;
  });

  afterEach(() => {
    window.crypto = globalCrypto;
  });

  describe('pkceChallengeFromVerifier', () => {
    it('should generate a code challenge from verifier', async () => {
      const { codeChallenge } = await oAuthUtils.pkceChallengeFromVerifier(
        'hello',
      );
      const {
        codeChallenge: codeChallenge2,
      } = await oAuthUtils.pkceChallengeFromVerifier(
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
      const storage = localStorage;
      storage.clear();
      oAuthUtils.saveStateAndVerifier();
      expect(!!storage.getItem('state')).to.be.true;
      expect(!!storage.getItem('code_verifier')).to.be.true;
      storage.clear();
    });
    it('should return an object with state and codeVerifier', () => {
      const storage = localStorage;
      storage.clear();
      const { state, codeVerifier } = oAuthUtils.saveStateAndVerifier();
      expect(storage.getItem('state')).to.eql(state);
      expect(storage.getItem('code_verifier')).to.eql(codeVerifier);
      storage.clear();
    });
  });

  describe('createOAuthRequest', () => {
    ['logingov', 'idme', 'dslogon', 'mhv'].forEach(csp => {
      it('should generate the proper signin url based on `csp` for web', async () => {
        const url = await oAuthUtils.createOAuthRequest({ type: csp });
        const { oAuthOptions } = externalApplicationsConfig.default;
        expect(url).to.include(`type=${csp}`);
        expect(url).to.include(`acr=${oAuthOptions.acr[csp]}`);
        expect(url).to.include(`client_id=web`);
      });

      it('should generate the proper signin url based on `csp` for mobile', async () => {
        const url = await oAuthUtils.createOAuthRequest({
          type: csp,
          application: 'vamobile',
        });
        const { oAuthOptions } = externalApplicationsConfig.vamobile;
        expect(url).to.include(`type=${csp}`);
        expect(url).to.include(`acr=${oAuthOptions.acr[csp]}`);
        expect(url).to.include(`client_id=mobile`);
      });
    });
    it('should append additional params', async () => {
      const webUrl = await oAuthUtils.createOAuthRequest({ type: 'logingov' });
      Object.values(AUTHORIZE_KEYS_WEB).forEach(key => {
        const searchParams = new URLSearchParams(webUrl);
        expect(searchParams.has(key)).to.be.true;
      });
      const mobileUrl = await oAuthUtils.createOAuthRequest({
        type: 'logingov',
        application: 'vaoccmobile',
      });
      Object.values(AUTHORIZE_KEYS_MOBILE).forEach(key => {
        const searchParams = new URLSearchParams(mobileUrl);
        expect(searchParams.has(key)).to.be.true;
      });
    });

    ['logingov_signup', 'idme_signup'].forEach(csp => {
      it('should generate the proper signup url based on `csp` for web', async () => {
        const url = await oAuthUtils.createOAuthRequest({
          type: csp,
          passedOptions: {
            isSignup: true,
          },
        });
        const { oAuthOptions } = externalApplicationsConfig.default;
        const expectedType = csp.slice(0, csp.indexOf('_'));
        expect(url).to.include(`type=${expectedType}`);
        expect(url).to.include(`acr=${oAuthOptions.acrSignup[csp]}`);
      });
    });
  });

  describe('getCV', () => {
    it('should return null when empty', () => {
      const storage = localStorage;
      storage.clear();
      expect(oAuthUtils.getCV()).to.eql({ codeVerifier: null });
      storage.clear();
    });
    it('should return code_verifier when in session storage', () => {
      const cvValue = 'success_getCV';
      const storage = localStorage;
      storage.clear();
      storage.setItem('code_verifier', cvValue);
      expect(oAuthUtils.getCV()).to.eql({
        codeVerifier: cvValue,
      });
      storage.clear();
    });
  });

  describe('buildTokenRequest', () => {
    it('should not generate url if no `code` is provider or `code_verifier` is null', async () => {
      const storage = localStorage;
      storage.clear();
      const btr = await oAuthUtils.buildTokenRequest();
      expect(btr).to.be.null;
      const btr2 = oAuthUtils.buildTokenRequest({ code: 'hello' });
      expect(btr2).to.be.null;
      storage.clear();
    });
    it('should generate a proper url with appropriate query params', async () => {
      const cvValue = 'success_buildTokenRequest';
      const storage = localStorage;
      storage.clear();
      storage.setItem('code_verifier', cvValue);
      const tokenPath = `${
        environment.API_URL
      }/v0/sign_in/token?grant_type=authorization_code&client_id=web&redirect_uri=https%253A%252F%252Fdev.va.gov&code=hello&code_verifier=${cvValue}`;
      const btr = await oAuthUtils.buildTokenRequest({ code: 'hello' });
      expect(btr.href).to.eql(tokenPath);
      expect(btr.href).includes('code=');
      expect(btr.href).includes('code_verifier=');
      storage.clear();
    });
  });

  describe('requestToken', () => {
    it('should fail if url is not generated', async () => {
      const storage = localStorage;
      storage.clear();
      const req2 = await oAuthUtils.requestToken({ code: 'test' });
      expect(req2).to.eql(null);
      storage.clear();
    });
    it('should POST successfully to `/token` endpoint', async () => {
      const cvValue = 'tst';
      const storage = localStorage;
      storage.clear();
      storage.setItem('code_verifier', cvValue);
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), []);
      const tokenOptions = await oAuthUtils.requestToken({ code: 'success' });
      expect(tokenOptions).to.not.be.null;
      expect(global.fetch.calledOnce).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
      expect(global.fetch.firstCall.args[0].includes('/token')).to.be.true;
      storage.clear();
    });
    it('should return an error if `/token` endpoint unsuccessful', async () => {
      const cvValue = 'tst';
      const storage = localStorage;
      storage.clear();
      storage.setItem('code_verifier', cvValue);
      mockFetch();
      setFetchFailure(global.fetch.onFirstCall(), []);
      const tokenOptions = await oAuthUtils.requestToken({
        code: 'failure',
      });
      expect(global.fetch.calledOnce).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
      expect(global.fetch.firstCall.args[0].includes('/token')).to.be.true;
      expect(tokenOptions.ok).to.be.false;
      storage.clear();
    });
  });

  describe('checkOrSetSessionExpiration', () => {
    it('if response headers contain `X-Session-Expiration` with a valid date, set the localStorage', () => {
      const storage = localStorage;
      storage.clear();
      const response = generateResponse({
        headers: {
          'X-Session-Expiration':
            'Wed Jun 29 2022 12:41:35 GMT-0400 (Eastern Daylight Time)',
          'Content-Type': 'application/json',
        },
      });
      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);
      if (isSet) {
        expect(storage.getItem('sessionExpiration')).to.eql(
          'Wed Jun 29 2022 12:41:35 GMT-0400 (Eastern Daylight Time)',
        );
      }
      storage.clear();
    });
    it('if `infoTokenExists` results to true, set localStorage to the vagov_info_token cookie', () => {
      document.cookie = `FLIPPER_ID=abc123; vagov_info_token={:access_token_expiration=>Wed,+29+Jun+2022+16:41:35.553488744+UTC++00:00,+:refresh_token_expiration=>Wed,+29+Jun+2022+17:06:35.504965627+UTC++00:00};FLIPPER_ID=c4pz6sj36lk7fdoya02bmq`;
      const storage = localStorage;
      storage.clear();
      const response = generateResponse({
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);
      if (isSet) {
        expect(Object.keys(storage)).to.include('sessionExpiration');
      }
      storage.clear();
    });
  });

  describe('removeInfoToken', () => {
    it('should return null if infoTokenExists results to false', () => {
      global.document.cookie = 'FLIPPER_ID=abc123;other_cookie=true;';
      expect(oAuthUtils.removeInfoToken()).to.be.null;
      global.document.cookie = '';
    });
    it('should update the document.cookie to remove `vagov_info_token`', () => {
      global.document.cookie = `vagov_info_token={:access_token_expiration=>Wed,+29+Jun+2022+16:41:35.553488744+UTC++00:00,+:refresh_token_expiration=>Wed,+29+Jun+2022+17:06:35.504965627+UTC++00:00};FLIPPER_ID=c4pz6sj36lk7fdoya02bmq`;

      expect(oAuthUtils.removeInfoToken()).to.be.undefined;
    });
  });

  describe('infoTokenExists', () => {
    it('should check if cookie contains `vagov_info_token`', () => {
      global.document.cookie = `vagov_info_token={:access_token_expiration=>Wed,+29+Jun+2022+16:41:35.553488744+UTC++00:00,+:refresh_token_expiration=>Wed,+29+Jun+2022+17:06:35.504965627+UTC++00:00};FLIPPER_ID=c4pz6sj36lk7fdoya02bmq`;
      expect(oAuthUtils.infoTokenExists()).to.be.true;
    });
  });

  describe('formatInfoCookie', () => {
    it('should return an object with a valid date', () => {
      const unformattedCookie = `%7B%3Aaccess_token_expiration%3D%3EWed%2C+29+Jun+2022+16%3A41%3A35.553488744+UTC+%2B00%3A00%2C+%3Arefresh_token_expiration%3D%3EWed%2C+29+Jun+2022+17%3A06%3A35.504965627+UTC+%2B00%3A00%7D`;
      expect(typeof oAuthUtils.formatInfoCookie(unformattedCookie)).to.eql(
        'object',
      );
      const { access_token_expiration } = oAuthUtils.formatInfoCookie(
        unformattedCookie,
      );
      expect(access_token_expiration).to.not.be.undefined;
    });
  });

  describe('getInfoToken', () => {
    it('should return a formatted object of the access & refresh tokens', () => {
      const unformattedCookie = decodeURIComponent(
        `%7B%3Aaccess_token_expiration%3D%3EWed%2C+29+Jun+2022+16%3A41%3A35.553488744+UTC+%2B00%3A00%2C+%3Arefresh_token_expiration%3D%3EWed%2C+29+Jun+2022+17%3A06%3A35.504965627+UTC+%2B00%3A00%7D`,
      );

      const keys = Object.keys(oAuthUtils.formatInfoCookie(unformattedCookie));
      expect(keys).to.include('access_token_expiration');
      expect(keys).to.include('refresh_token_expiration');
    });
  });

  describe('refresh', () => {
    it('should create a POST request to the /refresh endpoint', async () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), []);
      await oAuthUtils.refresh();
      expect(global.fetch.calledOnce).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
      expect(global.fetch.firstCall.args[0].includes('/refresh')).to.be.true;
    });
  });

  describe('updateStateAndVerifier', () => {
    const signupKeys = [
      `idme_signup_state`,
      `idme_signup_code_verifier`,
      `logingov_signup_state`,
      `logingov_signup_code_verifier`,
    ];

    it('should get the generated sessionStorage state & code verifier', () => {
      const storage = localStorage;
      storage.clear();
      expect(storage.getItem('idme_signup_state')).to.be.null;
      expect(storage.getItem('idme_signup_code_verifier')).to.be.null;
      signupKeys.forEach(key =>
        storage.setItem(key, key.includes('idme') ? 'idmeVal' : 'logingovVal'),
      );
      oAuthUtils.updateStateAndVerifier('idme');
      expect(storage.getItem('state')).to.eql('idmeVal');
      expect(storage.getItem('code_verifier')).to.eql('idmeVal');
      signupKeys.forEach(storageKey => {
        expect(storage.getItem(storageKey)).to.be.null;
      });
      expect(storage.length).to.eql(2);
      storage.clear();
    });
    it('it should remove only those items from localStorage', () => {
      const storage = localStorage;
      storage.clear();
      expect(storage.getItem('state')).to.be.null;
      expect(storage.getItem('code_verifier')).to.be.null;
      signupKeys.forEach(key =>
        storage.setItem(key, key.includes('idme') ? 'idmeVal' : 'logingovVal'),
      );
      storage.setItem('someRandomKey', 'someRandomValue');
      oAuthUtils.updateStateAndVerifier('logingov');
      expect(storage.length).to.eql(3);
      storage.clear();
    });
  });

  describe('removeStateAndVerifier', () => {
    it('should remove all state & verifiers from localStorage', () => {
      const storage = localStorage;
      storage.clear();
      ALL_STATE_AND_VERIFIERS.forEach(storageKey => {
        storage.setItem(storageKey, 'randomValue');
      });

      oAuthUtils.removeStateAndVerifier();
      expect(Object.keys(storage).length).to.eql(0);
      storage.clear();
    });
    it('should not remove any other item from localStorage', () => {
      const storage = localStorage;
      storage.clear();
      ALL_STATE_AND_VERIFIERS.forEach(storageKey => {
        storage.setItem(storageKey, 'randomValue');
      });
      storage.setItem('otherKey', 'otherValue');

      oAuthUtils.removeStateAndVerifier();
      expect(Object.keys(storage).length).to.eql(1);
      expect(storage.getItem('otherKey')).to.eql('otherValue');
      storage.clear();
    });
  });

  describe('logout', () => {
    it('should redirect to backend for logout', () => {
      window.location = new URL('https://va.gov/?state=some_random_state');
      const url = oAuthUtils.logoutUrlSiS();
      window.location = url;
      expect(window.location).to.eql(url);
    });
  });
});
