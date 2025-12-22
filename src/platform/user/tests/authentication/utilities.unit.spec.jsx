import { expect } from 'chai';
import sinon from 'sinon';
import appendQuery from 'append-query';
import Cookies from 'js-cookie';
import {
  getLoginAttempted,
  removeLoginAttempted,
} from 'platform/utilities/sso/loginAttempted';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';
import { API_SIGN_IN_SERVICE_URL } from 'platform/utilities/oauth/constants';
import * as authUtilities from '../../authentication/utilities';
import {
  AUTHN_SETTINGS,
  CSP_IDS,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  API_VERSION,
  API_SESSION_URL,
  SIGNUP_TYPES,
  GA,
  POLICY_TYPES,
  AUTH_EVENTS,
} from '../../authentication/constants';

const originalLocation = global.window.location;
const originalGA = global.ga;
const originalCrypto = global.window.crypto;

const base = 'https://dev.va.gov';
const usipPath = '/sign-in';
const nonUsipPath = '/about';
const trickyNonUsipPath = '/sign-in-app';
const mhvUsipParams = '?application=mhv&to=home';
const smhdUsipParams = `?application=smhdweb`;
const cernerUsipParams = '?application=myvahealth';
const cernerComplicatedParams = `&to=%2Fsession-api%2Frealm%2Ff0fded0d-d00b-4b28-9190-853247fd9f9d%3Fto%3Dhttps%253A%252F%252Fstaging-patientportal.myhealth.va.gov%252F&oauth=false`;
const cernerSandbox = `&to=%2Fsession-api%2Frealm%2Ff0fded0d-d00b-4b28-9190-853247fd9f9d%3Fto%3Dhttps%253A%252F%252Fsandbox-patientportal.myhealth.va.gov%252F&oauth=false`;
const occUsipParams = '?application=vaoccmobile';
const flagshipUsipParams = '?application=vamobile';
const mockGAClientId = '1234';
const mockInvalidGATrackingId = 'UA-12345678-12';

const normalPathWithParams = `${nonUsipPath}?oauth=true`;
const usipPathWithParams = params => `${usipPath}${params}`;

const mockGADefaultArgs = {
  mockGAActive: false,
  trackingId: GA.trackingIds[0],
  throwGAError: false,
};

const setup = ({ path, mockGA = mockGADefaultArgs }) => {
  global.window.location = path ? new URL(`${base}${path}`) : originalLocation;
  global.ga = originalGA;
  global.window.crypto = mockCrypto;
  removeLoginAttempted();
  sessionStorage.clear();

  const { mockGAActive, trackingId, throwGAError } = mockGA;
  if (mockGAActive) {
    global.ga = sinon.stub();
    global.ga.getAll = throwGAError
      ? sinon.stub().throws()
      : sinon.stub().returns([
          {
            get: key => {
              switch (key) {
                case GA.clientIdKey:
                  return mockGAClientId;
                case GA.trackingIdKey:
                  return trackingId;
                default:
                  return undefined;
              }
            },
          },
        ]);
  }
};

const cleanup = () => {
  global.window.location = originalLocation;
  global.ga = originalGA;
  global.window.crypto = originalCrypto;
  sessionStorage.clear();
  localStorage.clear();
};

describe('Authentication Utilities', () => {
  describe('loginAppUrlRE', () => {
    it('should match true against sign-in page paths', () => {
      expect(authUtilities.loginAppUrlRE.test(usipPath)).to.be.true;
    });

    it('should match false against non sign-in page paths', () => {
      expect(authUtilities.loginAppUrlRE.test(nonUsipPath)).to.be.false;
    });

    it('should match false against paths that include sign-in-*', () => {
      expect(authUtilities.loginAppUrlRE.test(trickyNonUsipPath)).to.be.false;
    });
  });

  describe('getQueryParams', () => {
    const application = 'application';
    const to = 'to';
    afterEach(() => cleanup());

    it('should return any AUTH_PARAMS params when present', () => {
      setup({ path: usipPathWithParams(mhvUsipParams) });
      const searchParams = new URLSearchParams(global.window.location.search);
      expect(authUtilities.getQueryParams()).to.deep.equal({
        [application]: searchParams.get(application),
        [to]: searchParams.get([to]),
      });
    });

    it('should not return params other than defined AUTH_PARAMS', () => {
      setup({ path: usipPathWithParams(`${mhvUsipParams}&useless=useless`) });
      const searchParams = new URLSearchParams(global.window.location.search);
      expect(authUtilities.getQueryParams()).to.deep.equal({
        [application]: searchParams.get(application),
        [to]: searchParams.get([to]),
      });
    });

    it('should return empty object when no valid AUTH_PARAMS are found', () => {
      setup({ path: usipPath });
      expect(authUtilities.getQueryParams()).to.deep.equal({});
    });
  });

  describe('sanitizeUrl', () => {
    const CRLFString = '\r\n';

    it('should return null if not given a url', () => {
      expect(authUtilities.sanitizeUrl()).to.be.null;
    });

    it('should remove trailing slash from urls', () => {
      expect(authUtilities.sanitizeUrl(`${base}/`)).to.equal(base);
    });

    it('should remove potential CRLF injection sequences', () => {
      expect(authUtilities.sanitizeUrl(`${base}${CRLFString}`)).to.equal(base);
    });
  });

  describe('sanitizePath', () => {
    it('should return an empty string if to is undefined or null', () => {
      expect(authUtilities.sanitizePath()).to.eql('');
    });
    it('should format to add forward slashes if necessary', () => {
      expect(authUtilities.sanitizePath('/hello')).to.eql('/hello');
      expect(authUtilities.sanitizePath('hello')).to.eql('/hello');
    });
  });

  describe('isExternalRedirect', () => {
    afterEach(() => cleanup());
    it('should return true on USiP and valid application param', () => {
      setup({ path: usipPathWithParams(mhvUsipParams) });
      expect(authUtilities.isExternalRedirect()).to.be.true;
    });

    it('should return false on USiP and invalid application param', () => {
      setup({ path: usipPathWithParams('?application=invalid') });
      expect(authUtilities.isExternalRedirect()).to.be.false;
    });

    it('should return false on non USiP ', () => {
      expect(authUtilities.isExternalRedirect()).to.be.false;
    });

    it('should return false on non USiP even with valid params', () => {
      setup({ path: mhvUsipParams });
      expect(authUtilities.isExternalRedirect()).to.be.false;
    });
  });

  describe('sessionTypeUrl', () => {
    const type = CSP_IDS.LOGIN_GOV;
    const typeVerified = `${type}_verified`;
    const signupType = SIGNUP_TYPES[CSP_IDS.LOGIN_GOV];
    const signupTypeVerified = `${signupType}_verified`;
    const queryParams = {
      test: 'test',
    };
    afterEach(() => cleanup());

    it('should return null if not provided a type', () => {
      expect(authUtilities.sessionTypeUrl({})).to.be.null;
    });

    it('should return session url with type in its simplest form', () => {
      expect(authUtilities.sessionTypeUrl({ type })).to.equal(
        API_SESSION_URL({ type }),
      );
    });

    it('should return session url with queryParams appended if provided', () => {
      expect(authUtilities.sessionTypeUrl({ type, queryParams })).to.eql(
        appendQuery(API_SESSION_URL({ type }), queryParams),
      );
    });

    it('should return session url with additional params appeneded for MHV Logins', () => {
      setup({ path: usipPathWithParams(mhvUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type })).to.contain.all(
        'redirect=',
        'postLogin=true',
      );
    });

    it('should return session url with additional params appended for My VA Health (Cerner) login', () => {
      setup({ path: usipPathWithParams(cernerUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type })).to.not.contain.all(
        'skip_dupe=true',
      );
    });

    it('should return session url with _verified appended to type for OCC logins', () => {
      setup({ path: usipPathWithParams(occUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type })).to.include(
        appendQuery(API_SESSION_URL({ type: typeVerified })),
      );
    });

    it('should return session url with _verified appended to type for Flagship logins', () => {
      setup({ path: usipPathWithParams(flagshipUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type })).to.include(
        appendQuery(API_SESSION_URL({ type: typeVerified })),
      );
    });

    it('should return session url with _verified appended to type for OCC signups', () => {
      setup({ path: usipPathWithParams(occUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type: signupType })).to.include(
        appendQuery(API_SESSION_URL({ type: signupTypeVerified })),
      );
    });

    it('should return session url with _verified appended to type for Flagship signups', () => {
      setup({ path: usipPathWithParams(flagshipUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type: signupType })).to.include(
        appendQuery(API_SESSION_URL({ type: signupTypeVerified })),
      );
    });

    it('should return the SIS session URL if oauth is set', async () => {
      setup({ path: usipPathWithParams(normalPathWithParams) });
      const url = await authUtilities.sessionTypeUrl({
        type: 'logingov',
      });
      expect(url).to.include(`v0/sign_in`);
    });

    it('should NOT return session url with _verified appended to type for types other than login/signup', () => {
      setup({ path: usipPathWithParams(flagshipUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type: 'mfa' })).to.include(
        appendQuery(API_SESSION_URL({ type: 'mfa' })),
      );
    });

    it('should NOT return session url with _verified appended to type when not on USiP', () => {
      setup({ path: flagshipUsipParams });
      expect(authUtilities.sessionTypeUrl({ type })).to.include(
        appendQuery(API_SESSION_URL({ type })),
      );
    });

    it('should NOT return session url with _verified appended for external applications other than OCC/Flagship', () => {
      setup({ path: usipPathWithParams(smhdUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type })).to.not.include(
        '_verified',
      );
    });

    it('should use `API_SIGN_IN_SERVICE_URL` when `useOAuth` is true', async () => {
      setup({
        path: usipPathWithParams(
          `${flagshipUsipParams}&oauth=true&code_challenge=hello&code_challenge_method=S256`,
        ),
      });
      expect(
        await authUtilities.sessionTypeUrl({
          type,
        }),
      ).to.include(appendQuery(API_SIGN_IN_SERVICE_URL({ type })));
    });
    it('should use API_SESSION_URL when OAuth is disabled', async () => {
      const params = { application: 'vamobile' };
      setup({
        path: usipPathWithParams(
          `${flagshipUsipParams}&oauth=false&code_challenge=hello&code_challenge_method=S256`,
        ),
      });
      expect(
        await authUtilities.sessionTypeUrl({
          type,
        }),
      ).to.include(
        appendQuery(API_SESSION_URL({ type: typeVerified }), params),
      );
    });
  });

  describe('getGAClientId', () => {
    afterEach(() => cleanup());
    it('should return the GA client id', () => {
      setup({
        mockGA: {
          mockGAActive: true,
          trackingId: GA.trackingIds[0],
        },
      });
      expect(authUtilities.getGAClientId()).to.eql(mockGAClientId);
    });
    it('should return null if clientId is invalid', () => {
      setup({
        mockGA: {
          mockGAActive: true,
          trackingId: mockInvalidGATrackingId,
        },
      });
      expect(authUtilities.getGAClientId()).to.eql(null);
    });
    it('should return null if clientId is invalid', () => {
      setup({
        mockGA: {
          throwGAError: true,
          mockGAActive: true,
          trackingId: mockInvalidGATrackingId,
        },
      });
      expect(authUtilities.getGAClientId()).to.eql(null);
    });
  });

  describe('createExternalApplicationUrl', () => {
    afterEach(() => cleanup());
    it('should return correct url or null for the parsed application param', () => {
      Object.values(EXTERNAL_APPS).forEach(application => {
        setup({ path: `${usipPath}?application=${application}` });

        const pathAppend = () => {
          switch (application) {
            case EXTERNAL_APPS.VA_OCC_MOBILE:
              return `${global.window.location.search}`;
            case EXTERNAL_APPS.MY_VA_HEALTH:
              return `/?authenticated=true`;
            default:
              return '';
          }
        };

        expect(authUtilities.createExternalApplicationUrl()).to.eq(
          `${EXTERNAL_REDIRECTS[application]}${pathAppend()}`,
        );

        setup({});
      });

      expect(authUtilities.createExternalApplicationUrl()).to.eq(null);
    });

    it('should pass all query params through for OCC mobile applications', () => {
      const application = EXTERNAL_APPS.VA_OCC_MOBILE;
      const mockParams = `?application=${application}&foo=bar&bar=foo`;
      setup({ path: `${usipPath}${mockParams}` });

      expect(authUtilities.createExternalApplicationUrl()).to.eq(
        `${EXTERNAL_REDIRECTS[application]}${mockParams}`,
      );
    });

    it('should strip out the 2 `to` query parameters, uses the correct one', () => {
      setup({
        path: `${usipPath}${cernerUsipParams}${cernerComplicatedParams}`,
      });

      expect(authUtilities.createExternalApplicationUrl()).to.eql(
        `https://staging-patientportal.myhealth.va.gov/session-api/realm/f0fded0d-d00b-4b28-9190-853247fd9f9d?authenticated=true`,
      );
    });

    it('should redirect to the proper Cerner url', () => {
      setup({
        path: `${usipPath}${cernerUsipParams}${cernerSandbox}`,
      });

      expect(authUtilities.createExternalApplicationUrl()).to.eql(
        `https://sandbox-patientportal.myhealth.va.gov/session-api/realm/f0fded0d-d00b-4b28-9190-853247fd9f9d?authenticated=true`,
      );
    });
  });

  describe('createAndStoreReturnUrl', () => {
    afterEach(() => cleanup());
    it('should return window.location when not on USiP', () => {
      setup({ path: nonUsipPath });
      expect(authUtilities.createAndStoreReturnUrl()).to.equal(
        `${base}${nonUsipPath}`,
      );
      expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
        `${base}${nonUsipPath}`,
      );
    });

    it('should return window.location.origin when on USiP but logging in internally', () => {
      setup({ path: usipPath });
      expect(authUtilities.createAndStoreReturnUrl()).to.equal(base);
      expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(base);
    });

    it('should return external application url when on USiP and valid application param', () => {
      Object.values(EXTERNAL_APPS).forEach(application => {
        setup({ path: `${usipPath}?application=${application}` });

        expect(authUtilities.createAndStoreReturnUrl()).to.eq(
          authUtilities.createExternalApplicationUrl(),
        );

        setup({});
      });

      it('should return "/my-va" when pathname is "/verify/"', () => {
        setup({ path: '/verify/' });

        expect(authUtilities.createAndStoreReturnUrl()).to.equal('/my-va');
        expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
          '/my-va',
        );
      });
    });

    it('should return the `authReturnUrl` if it is already presented', () => {
      setup({ path: nonUsipPath });
      const internalLink = 'http://va.gov/track-claims/';
      sessionStorage.setItem('authReturnUrl', internalLink);
      expect(authUtilities.createAndStoreReturnUrl()).to.equal(internalLink);
      expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
        internalLink,
      );
      sessionStorage.clear();
    });
  });

  describe('redirect', () => {
    afterEach(() => cleanup());
    it('should redirect to the provided redirectUrl in its simplest use case', () => {
      authUtilities.redirect(base);
      const location = global.window.location.href || global.window.location;
      expect(location).to.be.oneOf([base, `${base}/`]);
    });

    it('should set sessionStorage `authReturnUrl` correctly based on internal or external authentication', () => {
      setup({ path: nonUsipPath });
      authUtilities.redirect(base);
      expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
        `${base}${nonUsipPath}`,
      );

      setup({ path: usipPathWithParams(mhvUsipParams) });

      authUtilities.redirect(base);
      expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(null);
    });

    it('should redirect with GA Client ID appended for redirects that include `idme`', async () => {
      setup({
        path: base,
        mockGA: {
          mockGAActive: true,
          trackingId: GA.trackingIds[0],
        },
      });

      const url = await authUtilities.sessionTypeUrl({
        type: 'idme',
      });

      await authUtilities.redirect(url);
      expect(
        String(global.window.location).includes(`client_id=${mockGAClientId}`),
      ).to.be.true;
    });
  });

  describe('mockLogin', () => {
    beforeEach(() => setup({}));
    afterEach(() => cleanup());
    it('should redirect to proper mockLogin url', async () => {
      await authUtilities.mockLogin({ type: 'idme' });
      const location = global.window.location.href || global.window.location;
      expect(location).to.include(`client_id=vamock`);
    });
    it('should throw an error when no `type` is provided', () => {
      expect(authUtilities.mockLogin()).to.throw;
    });
  });

  describe('login', () => {
    afterEach(() => cleanup());
    it('should setLoginAttempted and redirect to login session url for all CSPs not on USiP', () => {
      Object.values(CSP_IDS).forEach(async policy => {
        setup({ path: nonUsipPath });

        await authUtilities.login({ policy });
        expect(global.window.location).to.equal(
          await authUtilities.sessionTypeUrl({ type: policy }),
        );
        expect(getLoginAttempted()).to.equal('true');
        expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
          `${base}${nonUsipPath}`,
        );
        setup({});
      });
    });

    it('should setLoginAttempted and redirect to login session url for all CSPs on USiP authenticating internally', () => {
      Object.values(CSP_IDS).forEach(async policy => {
        setup({ path: usipPath });

        await authUtilities.login({ policy });
        expect(global.window.location).to.equal(
          await authUtilities.sessionTypeUrl({ type: policy }),
        );
        expect(getLoginAttempted()).to.equal('true');
        expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
          base,
        );
        setup({});
      });
    });

    it('should redirect to login session url for all CSPs on USiP authenticating externally', () => {
      Object.values(CSP_IDS).forEach(async policy => {
        setup({ path: usipPathWithParams(mhvUsipParams) });
        const externalApplicationUrl = authUtilities.createExternalApplicationUrl();
        const expectedRedirect = await authUtilities.sessionTypeUrl({
          type: policy,
        });

        await authUtilities.login({ policy });
        expect(global.window.location).to.equal(expectedRedirect);
        expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
          externalApplicationUrl,
        );
        setup({});
      });
    });
  });

  describe('mfa', () => {
    afterEach(() => cleanup());
    it('should redirect to the mfa session url', () => {
      setup({ path: nonUsipPath });
      authUtilities.mfa();
      const location = global.window.location.href || global.window.location;
      expect(location).to.equal(API_SESSION_URL({ type: POLICY_TYPES.MFA }));
    });
  });

  describe('verify', () => {
    beforeEach(() => setup({ path: nonUsipPath }));
    afterEach(() => cleanup());
    it('should throw an error when no policy provided', () => {
      expect(authUtilities.verify({ isLink: false })).to.throw;
    });
    it('should generate a verify link (SAML)', async () => {
      const link = await authUtilities.verify({
        policy: 'logingov',
        isLink: true,
      });
      expect(link).to.include('logingov_signup_verified');
      expect(typeof link).to.eql('string');
    });
    it('should generate a verify link (OAuth)', async () => {
      const link = await authUtilities.verify({
        policy: 'logingov',
        isLink: true,
        useOAuth: true,
        acr: 'ial2',
      });
      expect(link).to.include('type=logingov');
      expect(link).to.include('acr=ial2');
      expect(typeof link).to.eql('string');
    });
    it('should kickoff identity-verification (SAML)', async () => {
      await authUtilities.verify({ policy: 'idme' });
      const location = global.window.location.href || global.window.location;
      expect(location).to.include('idme_signup_verified');
    });
    it('should kickoff identity-verification (OAuth)', async () => {
      await authUtilities.verify({
        policy: 'logingov',
        useOAuth: true,
        acr: 'ial2',
      });
      const location = global.window.location.href || global.window.location;
      expect(location).to.include('type=logingov');
      expect(location).to.include('acr=ial2');
    });
    it('should pass along query parameters', async () => {
      const samlLink = await authUtilities.verify({
        policy: 'idme',
        isLink: true,
        queryParams: {
          operation: 'test_operation',
          gaClientId: 'id',
          scope: 'email',
        },
      });
      expect(samlLink).to.include(
        '?operation=test_operation&gaClientId=id&scope=email',
      );
      const oauthLink = await authUtilities.verify({
        policy: 'idme',
        isLink: true,
        useOAuth: true,
        acr: 'loa3',
        queryParams: {
          operation: 'test_operation',
        },
      });
      expect(oauthLink).to.include('acr=loa3');
      expect(oauthLink).to.include('&operation=test_operation');
    });
  });

  describe('signupOrVerify (SAML)', () => {
    afterEach(() => cleanup());
    ['idme', 'logingov'].forEach(policy => {
      it(`should generate the default URL link for signup '${policy}_signup'`, async () => {
        const signupUrl = await authUtilities.signupOrVerify({
          policy,
          isLink: true,
        });
        expect(signupUrl).contain(
          API_SESSION_URL({
            type: SIGNUP_TYPES[policy],
          }),
        );
      });

      it(`should generate the default URL link and redirect for signup '${policy}_signup'`, async () => {
        await authUtilities.signupOrVerify({ policy });
        const location = global.window.location.href || global.window.location;
        expect(location).contain(
          API_SESSION_URL({
            type: SIGNUP_TYPES[policy],
          }),
        );
      });

      it(`should generate a verified URL for signup '${policy}_signup_verified'`, async () => {
        const url = await authUtilities.signupOrVerify({
          policy,
          isLink: true,
          isSignup: false,
        });
        expect(url).to.include(`${policy}_signup_verified`);
      });
    });
  });

  describe('logout', () => {
    afterEach(() => cleanup());
    it('should redirect to the logout session url', () => {
      setup({ path: nonUsipPath });
      authUtilities.logout();
      const location = global.window.location.href || global.window.location;
      expect(location).to.equal(API_SESSION_URL({ type: POLICY_TYPES.SLO }));
    });

    it('should redirect to the logout session url with appended params if provided', () => {
      setup({ path: nonUsipPath });
      const params = { foo: 'bar' };
      authUtilities.logout({
        version: API_VERSION,
        clickedEvent: AUTH_EVENTS.LOGOUT,
        queryParams: params,
      });
      const location = global.window.location.href || global.window.location;
      expect(location).to.equal(
        appendQuery(API_SESSION_URL({ type: POLICY_TYPES.SLO }), params),
      );
    });

    it('should redirect to the SSOe logout session url with `agreements_declined=true` if provided', () => {
      setup({ path: nonUsipPath });
      const params = { [`agreements_declined`]: true };
      authUtilities.logout({
        version: API_VERSION,
        clickedEvent: AUTH_EVENTS.LOGOUT,
        queryParams: params,
      });
      const location = global.window.location.href || global.window.location;
      expect(location).to.eql(
        appendQuery(API_SESSION_URL({ type: POLICY_TYPES.SLO }), params),
      );
    });
  });

  describe('logoutUrl', () => {
    it('should generate the SAML logout URL', async () => {
      setup({ path: nonUsipPath });
      expect(authUtilities.logoutUrl()).to.include('sessions/slo/new');
      cleanup();
    });
  });

  describe('generateReturnURL', () => {
    const homepageModalRoute = `${base}/?next=loginModal`;
    const usipRoute = `${base}`;
    const nonHomepageRoute = `${base}/education/eligibility/`;
    const myVARoute = `${base}/my-va/`;
    it('should return users signing in on via the USiP (on default USiP route) to /my-va/', () => {
      expect(authUtilities.generateReturnURL(usipRoute)).to.eql(myVARoute);
    });
    it('should return users signing in via the Sign in Modal (on the homepage) to /my-va/', () => {
      expect(authUtilities.generateReturnURL(homepageModalRoute)).to.eql(
        myVARoute,
      );
    });
    it('should return users signing in on non-default routes to original location', () => {
      expect(authUtilities.generateReturnURL(nonHomepageRoute)).to.eql(
        nonHomepageRoute,
      );
    });
    it('should return users to /my-va page when `authReturnUrl` is empty', () => {
      expect(authUtilities.generateReturnURL('')).to.eql(myVARoute);
    });
  });

  describe('API_SESSION_URL', () => {
    it('should throw an error if no type is provided', () => {
      expect(() => API_SESSION_URL({})).to.throw(
        'Attempted to call API_SESSION_URL without a type',
      );
    });
  });

  describe('determineAuthBroker', () => {
    const parsedCookieT = `eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaFUiLCJleHAiOiIyMDQ1LTA3LTE2VDE2OjEwOjM0LjY2NFoiLCJwdXIiOiJjb29raWUuQ0VSTkVSX0VMSUdJQkxFIn19--TRUE`;
    const parsedCookieF = `eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEciLCJleHAiOiIyMDQ1LTA3LTE2VDE2OjAwOjU5LjAxN1oiLCJwdXIiOiJjb29raWUuQ0VSTkVSX0VMSUdJQkxFIn19--FALSE`;

    afterEach(() => {
      document.cookie = '';
    });

    it('should return false by default', () => {
      expect(authUtilities.determineAuthBroker()).to.be.false;
      expect(authUtilities.determineAuthBroker(false, false)).to.be.false;
    });

    it('should return `true` when no cookie is found', () => {
      expect(authUtilities.determineAuthBroker(true)).to.be.true;
    });

    it('should return `false` when parsed cookie is `T`', () => {
      Cookies.set('CERNER_ELIGIBLE', parsedCookieT);
      expect(authUtilities.determineAuthBroker(true)).to.be.false;
    });

    it('should return `true` when parsed cookie is `F`', () => {
      Cookies.set('CERNER_ELIGIBLE', parsedCookieF);
      expect(authUtilities.determineAuthBroker(true)).to.be.true;
    });

    it('should return `true` when cookie is plain text "false"', () => {
      Cookies.set('CERNER_ELIGIBLE', 'false');
      expect(authUtilities.determineAuthBroker(true)).to.be.true;
    });

    it('should return `false` when cookie is plain text "true"', () => {
      Cookies.set('CERNER_ELIGIBLE', 'true');
      expect(authUtilities.determineAuthBroker(true)).to.be.false;
    });

    it('should handle casing and whitespace for plain text "false"', () => {
      Cookies.set('CERNER_ELIGIBLE', '  FALSE  ');
      expect(authUtilities.determineAuthBroker(true)).to.be.true;
    });

    it('should fall back to plain text and return `true` for malformed signed cookie', () => {
      Cookies.set('CERNER_ELIGIBLE', 'not-base64--sig');
      expect(authUtilities.determineAuthBroker(true)).to.be.true;
    });
  });
});
