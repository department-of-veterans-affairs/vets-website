/* eslint-disable camelcase */
import sinon from 'sinon';
import { expect } from 'chai';

import localStorage from 'platform/utilities/storage/localStorage';
import {
  mockFetch,
  setFetchJSONFailure as setFetchFailure,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';

import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import environment from 'platform/utilities/environment';
import { signupOrVerify } from 'platform/user/authentication/utilities';
import * as profileUtils from 'platform/user/profile/utilities';
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
      expect(oAuthUtils.saveStateAndVerifier()).to.not.be.null;
      window.location.search = '';
    });
    it('should set sessionStorage', () => {
      oAuthUtils.saveStateAndVerifier();
      expect(!!localStorage.getItem('state')).to.be.true;
      expect(!!localStorage.getItem('code_verifier')).to.be.true;
    });
    it('should return an object with state and codeVerifier', () => {
      const { state, codeVerifier } = oAuthUtils.saveStateAndVerifier();
      expect(localStorage.getItem('state')).to.eql(state);
      expect(localStorage.getItem('code_verifier')).to.eql(codeVerifier);
    });
  });

  describe('createOAuthRequest', () => {
    ['logingov', 'idme', 'dslogon', 'mhv'].forEach(csp => {
      it('should generate the proper signin url based on `csp` for web', async () => {
        const url = await oAuthUtils.createOAuthRequest({ type: csp });
        const { oAuthOptions } = externalApplicationsConfig.default;
        expect(url).to.include(`type=${csp}`);
        expect(url).to.include(`acr=${oAuthOptions.acr[csp]}`);
        expect(url).to.include(`client_id=vaweb`);
      });

      it('should generate the proper signin url based on `csp` for mobile', async () => {
        const url = await oAuthUtils.createOAuthRequest({
          type: csp,
          application: 'vamobile',
        });
        const { oAuthOptions } = externalApplicationsConfig.vamobile;
        expect(url).to.include(`type=${csp}`);
        expect(url).to.include(`acr=${oAuthOptions.acr[csp]}`);
        expect(url).to.include(`client_id=vamobile`);
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

    ['idme_signup', 'logingov_signup'].forEach(csp => {
      it(`should generate the proper signup url for ${csp}`, async () => {
        const { oAuthOptions } = externalApplicationsConfig.default;
        const acr = oAuthOptions.acrSignup[csp];
        const url = await oAuthUtils.createOAuthRequest({
          type: csp,
          passedOptions: {
            isSignup: true,
          },
          acr,
        });
        const expectedType = csp.slice(0, csp.indexOf('_'));
        expect(url).to.include(`type=${expectedType}`);
        expect(url).to.include(`acr=${oAuthOptions.acrSignup[csp]}`);
        if (csp === 'idme_signup') {
          expect(url).to.include(`operation=sign_up`);
        }
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
      }/v0/sign_in/token?grant_type=authorization_code&client_id=vaweb&redirect_uri=https%253A%252F%252Fdev.va.gov&code=hello&code_verifier=${cvValue}`;
      const btr = await oAuthUtils.buildTokenRequest({ code: 'hello' });
      expect(btr.href).to.eql(tokenPath);
      expect(btr.href).includes('code=');
      expect(btr.href).includes('code_verifier=');
      storage.clear();
    });
  });

  describe('requestToken', () => {
    it('should fail if url is not generated', async () => {
      localStorage.clear();
      const req2 = await oAuthUtils.requestToken({ code: 'test' });
      expect(req2).to.eql(null);
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
      const response = generateResponse({
        headers: {
          'X-Session-Expiration':
            'Wed Jun 29 2022 12:41:35 GMT-0400 (Eastern Daylight Time)',
          'Content-Type': 'application/json',
        },
      });
      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);
      if (isSet) {
        expect(localStorage.getItem('sessionExpiration')).to.eql(
          'Wed Jun 29 2022 12:41:35 GMT-0400 (Eastern Daylight Time)',
        );
      }
    });
    it('if `infoTokenExists` results to true, set localStorage to the vagov_info_token cookie', () => {
      document.cookie = `FLIPPER_ID=abc123; vagov_info_token={:access_token_expiration=>Wed,+29+Jun+2022+16:41:35.553488744+UTC++00:00,+:refresh_token_expiration=>Wed,+29+Jun+2022+17:06:35.504965627+UTC++00:00};FLIPPER_ID=c4pz6sj36lk7fdoya02bmq`;
      const response = generateResponse({
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);
      if (isSet) {
        expect(Object.keys(localStorage)).to.include('sessionExpiration');
      }
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
      const unformattedCookie = decodeURIComponent(
        '%7B%22access_token_expiration%22%3A%222023-03-17T19%3A38%3A06.654Z%22%2C%22refresh_token_expiration%22%3A%222023-03-17T20%3A03%3A06.631Z%22%7D',
      );
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
        '%7B%22access_token_expiration%22%3A%222023-03-17T19%3A38%3A06.654Z%22%2C%22refresh_token_expiration%22%3A%222023-03-17T20%3A03%3A06.631Z%22%7D',
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
      await oAuthUtils.refresh({ type: 'logingov' });
      expect(global.fetch.calledOnce).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
      expect(global.fetch.firstCall.args[0]).to.include('type=logingov');
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
      expect(storage.getItem('state')).to.be.null;
      expect(storage.getItem('code_verifier')).to.be.null;
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

  describe('logoutUrlSiS', () => {
    it('should set client_id=vaweb by default', () => {
      const url = oAuthUtils.logoutUrlSiS();
      expect(url).to.include('logout');
      expect(url).to.include('client_id=vaweb');
    });
    it('should set client_id to value of sessionStorage', () => {
      const mockedClientId = 'vamock';
      const storage = sessionStorage;
      storage.clear();
      storage.setItem('ci', mockedClientId);
      const url = oAuthUtils.logoutUrlSiS();
      expect(url).to.include('logout');
      expect(url).to.include(`client_id=${mockedClientId}`);
      storage.clear();
    });
    it('should set client_id=vaweb when clientId is not of approved clientId list', () => {
      const badClientId = 'bad_actor_client_id';
      const storage = sessionStorage;
      storage.clear();
      storage.setItem('ci', badClientId);
      const url = oAuthUtils.logoutUrlSiS();
      expect(url).to.include('logout');
      expect(url).to.include(`client_id=vaweb`);
      storage.clear();
    });
    it('should set query parameters when passed in', () => {
      const url = oAuthUtils.logoutUrlSiS({
        queryParams: { [`agreements_declined`]: true },
      });
      expect(url).to.include('&agreements_declined=true');
    });
  });

  describe('signupOrVerify (OAuth)', () => {
    ['idme', 'logingov'].forEach(policy => {
      it(`should generate the default URL for signup 'type=${policy}&acr=min' OAuth | config: default`, async () => {
        global.window.location.search = `?oauth=true`;
        const url = await signupOrVerify({
          policy,
          isLink: true,
          useOAuth: true,
        });
        expect(url).to.include(`type=${policy}`);
        expect(url).to.include(`acr=min`);
        expect(url).to.include(`client_id=vaweb`);
        expect(url).to.include('/authorize');
        expect(url).to.include('response_type=code');
        expect(url).to.include('code_challenge=');
        expect(url).to.include('state=');
      });

      it(`should generate the default URL for signup 'type=${policy}&acr=<loa3|ial2>' OAuth | config: vamobile`, async () => {
        global.window.location.search = `?oauth=true&application=vamobile&client_id=vamobile`;
        const acrType = { idme: 'loa3', logingov: 'ial2' };
        const url = await signupOrVerify({
          policy,
          isLink: true,
          allowVerification: false,
          useOAuth: true,
          config: 'vamobile',
        });
        expect(url).to.include(`type=${policy}`);
        expect(url).to.include(`acr=${acrType[policy]}`);
        expect(url).to.include('/authorize');
        expect(url).to.include('response_type=code');
        expect(url).to.include('code_challenge=');
        expect(url).to.include('state=');
      });

      it(`should generate a verified URL for signup 'type=${policy}&acr=<loa3|ial2>' OAuth | config: default`, async () => {
        const url = await signupOrVerify({
          policy,
          isLink: true,
          isSignup: false,
          useOAuth: true,
        });
        const expectedAcr =
          externalApplicationsConfig.default.oAuthOptions.acrVerify[policy];
        expect(url).to.include(`type=${policy}`);
        expect(url).to.include(`acr=${expectedAcr}`);
        expect(url).to.include(`client_id=vaweb`);
        expect(url).to.include('/authorize');
        expect(url).to.include('response_type=code');
        expect(url).to.include('code_challenge=');
        expect(url).to.include('state=');
      });
    });
  });

  describe('logoutEvent', () => {
    it('should teardown profile', async () => {
      localStorage.setItem('hasSession', true);
      const teardownSpy = sinon.spy(profileUtils, 'teardownProfileSession');
      oAuthUtils.logoutEvent('logingov');

      expect(teardownSpy.called).to.be.true;
      expect(localStorage.getItem('hasSession')).to.be.null;
      teardownSpy.restore();
    });

    it('should teardown profile after a certain duration', () => {
      localStorage.setItem('hasSession', true);
      const teardownSpy = sinon.spy(profileUtils, 'teardownProfileSession');
      oAuthUtils
        .logoutEvent('logingov', {
          shouldWait: true,
          duration: 300,
        })
        .then(() => {
          expect(teardownSpy.called).to.be.true;
          expect(localStorage.getItem('hasSession')).to.be.null;

          teardownSpy.restore();
        });
    });
  });
});
