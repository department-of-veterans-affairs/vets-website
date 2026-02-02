/* eslint-disable camelcase */
import sinon from 'sinon';
import { expect } from 'chai';

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
  OAUTH_KEYS,
  COOKIES,
  CLIENT_IDS,
} from '../../oauth/constants';
import { setupMockCrypto } from '../../oauth/mockCrypto';
import * as oAuthUtils from '../../oauth/utilities';
import { infoTokenExists, getInfoToken } from '../../oauth/utilities';
import * as oauthCrypto from '../../oauth/crypto';

function generateResponse({ headers }) {
  return new Response('{}', {
    headers: { ...headers },
    status: 200,
    text: () => 'ok',
    json: () => Promise.resolve({ status: 200 }),
  });
}

describe('OAuth - Utilities', () => {
  let infoTokenExistsStub;
  let getInfoTokenStub;
  let removeInfoTokenSpy;
  let validCookie;

  beforeEach(() => {
    setupMockCrypto();

    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;');
    });
    localStorage.clear();
    sessionStorage.clear();

    infoTokenExistsStub = sinon
      .stub(oAuthUtils, 'infoTokenExists')
      .returns(true);

    getInfoTokenStub = sinon.stub(oAuthUtils, 'getInfoToken').returns({
      access_token_expiration: 'Wed Jun 29 2025 16:41:35 GMT-0400 (UTC)',
      refresh_token_expiration: 'Wed Jun 29 2025 17:06:35 GMT-0400 (UTC)',
    });

    removeInfoTokenSpy = sinon.spy(oAuthUtils, 'removeInfoToken');

    validCookie =
      '%7B%22access_token_expiration%22%3A%222023-03-17T19%3A38%3A06.654Z%22%2C%22refresh_token_expiration%22%3A%222023-03-17T20%3A03%3A06.631Z%22%7D';
  });

  afterEach(() => {
    infoTokenExistsStub.restore();
    getInfoTokenStub.restore();
    removeInfoTokenSpy.restore();
    localStorage.clear();
    sessionStorage.clear();
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

    it('should set localStorage correctly for sign-up type', () => {
      const type = 'idme_signup';
      const result = oAuthUtils.saveStateAndVerifier(type);
      expect(result.state).to.equal(localStorage.getItem(`${type}_state`));
      expect(result.codeVerifier).to.equal(
        localStorage.getItem(`${type}_code_verifier`),
      );
      expect(localStorage.getItem(`${type}_code_verifier`)).to.not.be.null;
      expect(localStorage.getItem(`${type}_state`)).to.not.be.null;
    });

    it('should set localStorage correctly for sign-in (default) type', () => {
      const { state, codeVerifier } = oAuthUtils.saveStateAndVerifier();
      expect(localStorage.getItem(OAUTH_KEYS.STATE)).to.eql(state);
      expect(localStorage.getItem(OAUTH_KEYS.CODE_VERIFIER)).to.eql(
        codeVerifier,
      );
    });

    it('should handle unknown types gracefully', () => {
      const unknownType = 'UNKNOWN_TYPE';
      const { state, codeVerifier } = oAuthUtils.saveStateAndVerifier(
        unknownType,
      );
      expect(localStorage.getItem(`${unknownType}_state`)).to.be.null;
      expect(localStorage.getItem(`${unknownType}_code_verifier`)).to.be.null;
      expect(localStorage.getItem(OAUTH_KEYS.STATE)).to.eql(state);
      expect(localStorage.getItem(OAUTH_KEYS.CODE_VERIFIER)).to.eql(
        codeVerifier,
      );
    });

    it('should return an object with state and codeVerifier', () => {
      const { state, codeVerifier } = oAuthUtils.saveStateAndVerifier();
      expect(localStorage.getItem(OAUTH_KEYS.STATE)).to.eql(state);
      expect(localStorage.getItem(OAUTH_KEYS.CODE_VERIFIER)).to.eql(
        codeVerifier,
      );
    });

    it('should generate random state and codeVerifier each time', () => {
      const result1 = oAuthUtils.saveStateAndVerifier();
      const result2 = oAuthUtils.saveStateAndVerifier();
      expect(result1.state).to.not.equal(result2.state);
      expect(result1.codeVerifier).to.not.equal(result2.codeVerifier);
    });

    it('should call generateRandomString with correct lengths', () => {
      const spyGenerateRandomString = sinon.spy(
        oauthCrypto,
        'generateRandomString',
      );
      oAuthUtils.saveStateAndVerifier();
      expect(spyGenerateRandomString.calledWith(28)).to.be.true;
      expect(spyGenerateRandomString.calledWith(64)).to.be.true;
      spyGenerateRandomString.restore();
    });
  });

  describe('createOAuthRequest', () => {
    ['logingov', 'idme', 'dslogon', 'mhv'].forEach(csp => {
      it(`should generate the proper signin url based on ${csp} for web`, async () => {
        const url = await oAuthUtils.createOAuthRequest({
          type: csp,
        });
        const { oAuthOptions } = externalApplicationsConfig.default;
        expect(url).to.include(`type=${csp}`);
        expect(url).to.include(`acr=${oAuthOptions.acr[csp]}`);
        expect(url).to.include(`client_id=vaweb`);
        expect(url).not.to.include('scope=');
      });

      it(`should generate the proper signin url based on ${csp} for mobile without scope`, async () => {
        const url = await oAuthUtils.createOAuthRequest({
          type: csp,
          application: 'vamobile',
        });
        const { oAuthOptions } = externalApplicationsConfig.vamobile;
        expect(url).to.include(`type=${csp}`);
        expect(url).to.include(`acr=${oAuthOptions.acr[csp]}`);
        expect(url).to.include(`client_id=vamobile`);
        expect(url).not.to.include('scope=');
      });

      it(`should generate the proper signin url based on ${csp} for mobile with scope`, async () => {
        const url = await oAuthUtils.createOAuthRequest({
          type: csp,
          application: 'vamobile',
          passedQueryParams: {
            scope: 'custom_scope',
          },
        });
        const { oAuthOptions } = externalApplicationsConfig.vamobile;
        expect(url).to.include(`type=${csp}`);
        expect(url).to.include(`acr=${oAuthOptions.acr[csp]}`);
        expect(url).to.include(`client_id=vamobile`);
        expect(url).to.include('scope=custom_scope');
      });
    });

    it('should append additional params', async () => {
      const webUrl = await oAuthUtils.createOAuthRequest({
        type: 'logingov',
      });
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

    it('should not include scope if not provided for mobile', async () => {
      const url = await oAuthUtils.createOAuthRequest({
        type: 'logingov',
        application: 'vamobile',
      });
      expect(url).not.to.include('scope=');
    });

    it('should include default scope if provided for mobile', async () => {
      const url = await oAuthUtils.createOAuthRequest({
        type: 'logingov',
        application: 'vamobile',
        passedQueryParams: {
          scope: 'device_sso',
        },
      });
      expect(url).to.include('scope=device_sso');
    });

    it('should force the identity verification', async () => {
      const url = await oAuthUtils.createOAuthRequest({
        type: 'logingov',
        passedOptions: { forceVerify: 'required' },
      });
      const url2 = await oAuthUtils.createOAuthRequest({
        type: 'idme',
        passedOptions: { forceVerify: 'required' },
      });

      expect(url).to.include('acr=ial2');
      expect(url2).to.include('acr=loa3');
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
        expect(url).not.to.includes('operation=');
        expect(url).not.to.include('scope=');
      });

      it(`should generate the proper signup url for ${csp} with an operation= query param to determine what we track`, async () => {
        const { oAuthOptions } = externalApplicationsConfig.default;
        const acr = oAuthOptions.acrSignup[csp];
        const url = await oAuthUtils.createOAuthRequest({
          type: csp,
          passedQueryParams: { operation: 'signup_interstitial' },
          passedOptions: { isSignup: true },
          acr,
        });
        const expectedType = csp.slice(0, csp.indexOf('_'));
        expect(url).to.include(`type=${expectedType}`);
        expect(url).to.include(`acr=${oAuthOptions.acrSignup[csp]}`);
        expect(url).to.include('operation=signup_interstitial');
        expect(url).not.to.include('scope=');
      });
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

  describe('getCV', () => {
    it('should return null when empty', () => {
      const storage = localStorage;
      storage.clear();
      expect(oAuthUtils.getCV()).to.eql({
        codeVerifier: null,
      });
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
      const btr2 = oAuthUtils.buildTokenRequest({
        code: 'hello',
      });
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
      const btr = await oAuthUtils.buildTokenRequest({
        code: 'hello',
      });
      expect(btr.href).to.eql(tokenPath);
      expect(btr.href).includes('code=');
      expect(btr.href).includes('code_verifier=');
      storage.clear();
    });
    it('should set client_id to value of sessionStorage', () => {
      localStorage.clear();
      sessionStorage.clear();
      const cvValue = 'success_buildTokenRequest';
      localStorage.setItem('code_verifier', cvValue);
      const mockedClientId = CLIENT_IDS.VAMOCK;
      sessionStorage.setItem(COOKIES.CI, mockedClientId);
      const btr = oAuthUtils.buildTokenRequest({
        code: 'hello',
      });
      expect(btr.href).to.include(`client_id=${mockedClientId}`);
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  describe('requestToken', () => {
    it('should fail if url is not generated', async () => {
      localStorage.clear();
      const req2 = await oAuthUtils.requestToken({
        code: 'test',
      });
      expect(req2).to.eql(null);
    });
    it('should POST successfully to `/token` endpoint', async () => {
      const cvValue = 'tst';
      const storage = localStorage;
      storage.clear();
      storage.setItem('code_verifier', cvValue);
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), []);
      const tokenOptions = await oAuthUtils.requestToken({
        code: 'success',
      });
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
    it('should set localStorage when `X-Session-Expiration` header is present and prefer it over `infoTokenExists` tokens', () => {
      const response = generateResponse({
        headers: {
          'X-Session-Expiration':
            'Wed Jun 29 2022 12:41:35 GMT-0400 (Eastern Daylight Time)',
          'Content-Type': 'application/json',
        },
      });

      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);

      expect(isSet).to.be.true;
      expect(localStorage.getItem('sessionExpiration')).to.eql(
        'Wed Jun 29 2022 12:41:35 GMT-0400 (Eastern Daylight Time)',
      );
    });

    it('should set localStorage from `infoTokenExists` when no `X-Session-Expiration` header is present and tokens are valid', () => {
      infoTokenExistsStub.restore();
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.restore();

      const validEncodedToken =
        '%7B%22access_token_expiration%22%3A%222023-03-17T19%3A38%3A06.654Z%22%2C%22refresh_token_expiration%22%3A%222023-03-17T20%3A03%3A06.631Z%22%7D';

      document.cookie = `${COOKIES.INFO_TOKEN}=${validEncodedToken};`;

      const response = generateResponse({
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);

      const expectedAtExpires = new Date(
        'Fri Mar 17 2023 15:38:06 GMT-0400',
      ).getTime();
      const actualAtExpires = new Date(
        localStorage.getItem('atExpires'),
      ).getTime();

      expect(isSet).to.be.true;
      expect(actualAtExpires).to.equal(expectedAtExpires);

      const expectedSessionExpiration = new Date(
        'Fri Mar 17 2023 16:03:06 GMT-0400',
      ).getTime();
      const actualSessionExpiration = new Date(
        localStorage.getItem('sessionExpiration'),
      ).getTime();

      expect(actualSessionExpiration).to.equal(expectedSessionExpiration);
    });

    it('should not set localStorage if `infoTokenExists` returns true but token format is invalid', () => {
      getInfoTokenStub.returns({});

      const response = generateResponse({
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);

      expect(isSet).to.be.false;
      expect(localStorage.getItem('sessionExpiration')).to.be.null;
      expect(localStorage.getItem('atExpires')).to.be.null;
    });

    it('should not set localStorage and return false if both `X-Session-Expiration` header and `infoTokenExists` are absent', () => {
      infoTokenExistsStub.returns(false);

      const response = generateResponse({
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);

      expect(isSet).to.be.false;
      expect(localStorage.getItem('sessionExpiration')).to.be.null;
      expect(localStorage.getItem('atExpires')).to.be.null;
    });

    it('should set session expiration from X-Session-Expiration header', () => {
      const response = generateResponse({
        headers: { 'X-Session-Expiration': '2022-06-29T12:41:35Z' },
      });
      const isSet = oAuthUtils.checkOrSetSessionExpiration(response);
      expect(isSet).to.be.true;
      expect(localStorage.getItem('sessionExpiration')).to.eql(
        '2022-06-29T12:41:35Z',
      );
    });
  });

  describe('removeInfoToken', () => {
    it('should return null when infoToken does not exist or `infoTokenExists` returns false', () => {
      infoTokenExistsStub.returns(false);

      const result = oAuthUtils.removeInfoToken();
      expect(result).to.equal(null);

      infoTokenExistsStub.restore();
      const resultNoToken = oAuthUtils.removeInfoToken();
      expect(resultNoToken).to.equal(null);
    });

    it('should remove INFO_TOKEN from cookies when it exists', () => {
      document.cookie = `${
        COOKIES.INFO_TOKEN
      }=some_info_token_value; expires=Wed, 29 Jun 2022 16:41:35 GMT;`;
      document.cookie = 'another_cookie=some_value;';

      oAuthUtils.removeInfoToken();

      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      const infoTokenCookie = cookies.find(cookie =>
        cookie.startsWith(`${COOKIES.INFO_TOKEN}`),
      );

      expect(infoTokenCookie).to.be.undefined;
      expect(document.cookie).to.include('another_cookie=some_value');
    });

    it('should not remove other cookies, whether INFO_TOKEN exists or not', () => {
      infoTokenExistsStub.returns(true);
      document.cookie = `sessionID=xyz456; `;
      document.cookie = `anotherCookie=value;`;
      document.cookie = `${COOKIES.INFO_TOKEN}=${validCookie};`;
      oAuthUtils.removeInfoToken();

      expect(document.cookie).to.not.include(`${COOKIES.INFO_TOKEN}`);
      expect(document.cookie).to.include('sessionID=xyz456');
      expect(document.cookie).to.include('anotherCookie=value');

      infoTokenExistsStub.restore();
      document.cookie = 'another_cookie=some_value;';
      document.cookie = 'third_cookie=another_value;';

      oAuthUtils.removeInfoToken();

      expect(document.cookie).to.include('another_cookie=some_value');
      expect(document.cookie).to.include('third_cookie=another_value');
    });

    it('should handle the case where there are no cookies', () => {
      document.cookie = '';

      oAuthUtils.removeInfoToken();

      expect(document.cookie).to.equal('');
    });

    it('should handle cookies with no values correctly', () => {
      document.cookie = `another_cookie=; ${COOKIES.INFO_TOKEN}`;

      oAuthUtils.removeInfoToken();

      expect(document.cookie).to.include('another_cookie=');
      expect(document.cookie).not.to.include(`${COOKIES.INFO_TOKEN}`);
    });
  });

  describe('infoTokenExists', () => {
    it('should check if cookie contains `vagov_info_token`', () => {
      document.cookie = `${COOKIES.INFO_TOKEN}=some_token_value; path=/;`;

      expect(infoTokenExists()).to.be.true;
    });

    it('should return false if `vagov_info_token` is not present', () => {
      infoTokenExistsStub.restore();

      document.cookie = 'some_other_cookie=some_value';

      expect(infoTokenExists()).to.be.false;
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
    it('returns null if infoToken does not exist', () => {
      infoTokenExistsStub.restore();
      getInfoTokenStub.restore();

      const result = getInfoToken();

      expect(result).to.be.null;
    });

    it('should return a formatted object of the access & refresh tokens when a valid cookie is present', () => {
      document.cookie = `${COOKIES.INFO_TOKEN}=${validCookie};`;

      const result = getInfoToken();

      expect(result).to.not.be.null;
      expect(result).to.be.an('object');
      expect(result).to.have.property('access_token_expiration');
      expect(result).to.have.property('refresh_token_expiration');
    });

    it('should return a formatted object of the access & refresh tokens when a valid cookie is present', () => {
      document.cookie = `${COOKIES.INFO_TOKEN}=${validCookie};`;

      const result = getInfoToken();

      expect(result).to.not.be.null;
      expect(result).to.be.an('object');
      expect(result).to.have.property('access_token_expiration');
      expect(result).to.have.property('refresh_token_expiration');
    });

    it('should correctly parse the INFO_TOKEN cookie among multiple cookies', () => {
      getInfoTokenStub.restore();

      document.cookie = 'other_cookie=some_value;';

      document.cookie = `${
        COOKIES.INFO_TOKEN
      }=${validCookie};another_cookie=another_value;`;

      const result = getInfoToken();
      expect(result).to.not.be.null;
      expect(result).to.be.an('object');
      expect(result).to.have.property('access_token_expiration');
      expect(result).to.have.property('refresh_token_expiration');
    });
  });

  describe('access token expiration helpers', () => {
    let sandbox;

    const setInfoTokenCookie = ({ accessExpISO, refreshExpISO }) => {
      const raw = JSON.stringify({
        access_token_expiration: accessExpISO,
        refresh_token_expiration: refreshExpISO,
      });

      const encoded = encodeURIComponent(raw);

      // Ensure cookie is set with path so it’s accessible
      document.cookie = `${COOKIES.INFO_TOKEN}=${encoded}; path=/;`;
    };

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      if (oAuthUtils.infoTokenExists.restore)
        oAuthUtils.infoTokenExists.restore();
      if (oAuthUtils.getInfoToken.restore) oAuthUtils.getInfoToken.restore();

      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;');
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('getAccessTokenExpiration returns a Date when info token provides an access_token_expiration', () => {
      setInfoTokenCookie({
        accessExpISO: '2025-06-29T20:41:35.000Z',
        refreshExpISO: '2025-06-29T21:06:35.000Z',
      });

      const exp = oAuthUtils.getAccessTokenExpiration();
      expect(exp).to.be.instanceOf(Date);
      expect(exp.toISOString()).to.equal('2025-06-29T20:41:35.000Z');
    });

    it('getAccessTokenExpiration returns null if cookie is missing', () => {
      // no cookie set
      const exp = oAuthUtils.getAccessTokenExpiration();
      expect(exp).to.equal(null);
    });

    it('msUntilAccessTokenExpiration returns ms delta from Date.now()', () => {
      setInfoTokenCookie({
        accessExpISO: '2025-06-29T20:41:35.000Z',
        refreshExpISO: '2025-06-29T21:06:35.000Z',
      });

      sandbox
        .stub(Date, 'now')
        .returns(new Date('2025-06-29T20:41:00.000Z').getTime());

      const ms = oAuthUtils.msUntilAccessTokenExpiration();
      expect(ms).to.equal(35 * 1000);
    });

    it('isAccessTokenExpiringSoon returns true when within threshold', () => {
      setInfoTokenCookie({
        accessExpISO: '2025-06-29T20:41:35.000Z',
        refreshExpISO: '2025-06-29T21:06:35.000Z',
      });

      sandbox
        .stub(Date, 'now')
        .returns(new Date('2025-06-29T20:41:31.000Z').getTime());

      expect(oAuthUtils.isAccessTokenExpiringSoon(5)).to.be.true;
    });

    it('isAccessTokenExpiringSoon returns false when outside threshold', () => {
      setInfoTokenCookie({
        accessExpISO: '2025-06-29T20:41:35.000Z',
        refreshExpISO: '2025-06-29T21:06:35.000Z',
      });

      sandbox
        .stub(Date, 'now')
        .returns(new Date('2025-06-29T20:41:20.000Z').getTime());

      expect(oAuthUtils.isAccessTokenExpiringSoon(5)).to.be.false;
    });

    it('refreshIfAccessTokenExpiringSoon refreshes when expiring soon', async () => {
      setInfoTokenCookie({
        accessExpISO: '2025-06-29T20:41:35.000Z',
        refreshExpISO: '2025-06-29T21:06:35.000Z',
      });

      sandbox
        .stub(Date, 'now')
        .returns(new Date('2025-06-29T20:41:31.000Z').getTime());

      // Mock fetch for the refresh call
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), []);

      const didRefresh = await oAuthUtils.refreshIfAccessTokenExpiringSoon({
        thresholdSeconds: 5,
        type: 'logingov',
      });

      expect(didRefresh).to.be.true;
      expect(global.fetch.calledOnce).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
      expect(global.fetch.firstCall.args[0]).to.include('/refresh');
      expect(global.fetch.firstCall.args[0]).to.include('type=logingov');
    });

    it('refreshIfAccessTokenExpiringSoon does not refresh when not expiring soon', async () => {
      setInfoTokenCookie({
        accessExpISO: '2025-06-29T20:41:35.000Z',
        refreshExpISO: '2025-06-29T21:06:35.000Z',
      });

      sandbox
        .stub(Date, 'now')
        .returns(new Date('2025-06-29T20:41:20.000Z').getTime());

      mockFetch();

      const didRefresh = await oAuthUtils.refreshIfAccessTokenExpiringSoon({
        thresholdSeconds: 5,
        type: 'logingov',
      });

      expect(didRefresh).to.be.false;
      expect(global.fetch.called).to.be.false;
    });

    it('refreshIfAccessTokenExpiringSoon does not refresh when type is missing', async () => {
      setInfoTokenCookie({
        accessExpISO: '2025-06-29T20:41:35.000Z',
        refreshExpISO: '2025-06-29T21:06:35.000Z',
      });

      sandbox
        .stub(Date, 'now')
        .returns(new Date('2025-06-29T20:41:31.000Z').getTime());

      mockFetch();

      const didRefresh = await oAuthUtils.refreshIfAccessTokenExpiringSoon({
        thresholdSeconds: 5,
        type: undefined,
      });

      expect(didRefresh).to.be.false;
      expect(global.fetch.called).to.be.false;
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

    it('should protect against repeated refresh calls of the same type', async () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), []);
      const refreshPromise1 = oAuthUtils.refresh({ type: 'idme' });
      const refreshPromise2 = oAuthUtils.refresh({ type: 'idme' });
      await Promise.all([refreshPromise1, refreshPromise2]);
      expect(global.fetch.calledOnce).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
      expect(global.fetch.firstCall.args[0]).to.include('type=idme');
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
        global.window.location.search = `?oauth=true&application=vamobile&client_id=vamobile&code_challenge=some_random_code_challenge`;
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
    const teardownSpy = sinon.spy(profileUtils, 'teardownProfileSession');

    it('should teardown profile', async () => {
      oAuthUtils.logoutEvent('logingov');

      expect(teardownSpy.called).to.be.true;
      teardownSpy.restore();
    });
    it('should teardown profile after a certain duration', async () => {
      await oAuthUtils.logoutEvent('logingov', {
        shouldWait: true,
        duration: 300,
      });

      expect(teardownSpy.called).to.be.true;
      teardownSpy.restore();
    });
  });

  describe('createOktaOAuthRequest', () => {
    it(`should create the proper URL for Okta client_id`, () => {
      const expected = {
        clientId: 'okta_test',
        codeChallenge: 'samplecode',
        loginType: 'idme',
      };
      const url = oAuthUtils.createOktaOAuthRequest({ ...expected });
      expect(url).to.include(`type=${expected.loginType}`);
      expect(url).to.include(`client_id=${expected.clientId}`);
      expect(url).to.include(`code_challenge=${expected.codeChallenge}`);
      expect(url).to.include('response_type=code');
      expect(url).to.include('acr=loa3');
    });
  });
});
