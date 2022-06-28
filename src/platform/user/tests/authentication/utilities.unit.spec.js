import { expect } from 'chai';
import sinon from 'sinon';
import appendQuery from 'append-query';

import {
  getLoginAttempted,
  removeLoginAttempted,
} from 'platform/utilities/sso/loginAttempted';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';
import * as authUtilities from '../../authentication/utilities';
import {
  AUTHN_SETTINGS,
  CSP_IDS,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  API_VERSION,
  API_SESSION_URL,
  API_SIGN_IN_SERVICE_URL,
  SIGNUP_TYPES,
  GA,
  EBENEFITS_DEFAULT_PATH,
  POLICY_TYPES,
  AUTH_EVENTS,
} from '../../authentication/constants';

const originalLocation = global.window.location;
const originalGA = global.ga;

const base = 'https://dev.va.gov';
const usipPath = '/sign-in';
const nonUsipPath = '/about';
const trickyNonUsipPath = '/sign-in-app';
const mhvUsipParams = '?application=mhv&to=home';
const cernerUsipParams = '?application=myvahealth';
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
    const type = CSP_IDS.ID_ME;
    const typeVerified = `${type}_verified`;
    const signupType = SIGNUP_TYPES[CSP_IDS.ID_ME];
    const signupTypeVerified = `${signupType}_verified`;
    const queryParams = {
      test: 'test',
    };

    it('should return null if not provided a type', () => {
      expect(authUtilities.sessionTypeUrl({})).to.be.null;
    });

    it('should return session url with type in its simplest form', () => {
      expect(authUtilities.sessionTypeUrl({ type })).to.equal(
        API_SESSION_URL({ type }),
      );
    });

    it('should return session url with queryParams appeneded if provided', () => {
      expect(authUtilities.sessionTypeUrl({ type, queryParams })).to.equal(
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
      setup({ path: usipPathWithParams(mhvUsipParams) });
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
    it('should use API_SESSION_URL when OAuth is disabled', () => {
      const params = { application: 'vamobile' };
      setup({
        path: usipPathWithParams(
          `${flagshipUsipParams}&oauth=false&code_challenge=hello&code_challenge_method=S256`,
        ),
      });
      expect(
        authUtilities.sessionTypeUrl({
          type,
        }),
      ).to.include(
        appendQuery(API_SESSION_URL({ type: typeVerified }), params),
      );
    });
  });

  describe('getGAClientId', () => {
    it('should return the GA client id', () => {
      setup({
        mockGA: {
          mockGAActive: true,
          trackingId: GA.trackingIds[0],
        },
      });
      expect(authUtilities.getGAClientId()).includes({
        gaClientId: mockGAClientId,
      });
    });
    it('should return an empty object if clientId is invalid', () => {
      setup({
        mockGA: {
          mockGAActive: true,
          trackingId: mockInvalidGATrackingId,
        },
      });
      expect(authUtilities.getGAClientId()).to.include({});
    });
    it('should return an empty object if clientId is invalid', () => {
      setup({
        mockGA: {
          throwGAError: true,
          mockGAActive: true,
          trackingId: mockInvalidGATrackingId,
        },
      });
      expect(authUtilities.getGAClientId()).to.include({});
    });
  });

  describe('createExternalApplicationUrl', () => {
    it('should return correct url or null for the parsed application param', () => {
      Object.values(EXTERNAL_APPS).forEach(application => {
        setup({ path: `${usipPath}?application=${application}` });

        const pathAppend = () => {
          switch (application) {
            case EXTERNAL_APPS.EBENEFITS:
              return EBENEFITS_DEFAULT_PATH;
            case EXTERNAL_APPS.VA_FLAGSHIP_MOBILE:
            case EXTERNAL_APPS.VA_OCC_MOBILE:
              return `${global.window.location.search}`;
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

    it('should pass all query params through for OCC and Flagship mobile applications', () => {
      [EXTERNAL_APPS.VA_OCC_MOBILE, EXTERNAL_APPS.VA_FLAGSHIP_MOBILE].forEach(
        application => {
          const mockParams = `?application=${application}&foo=bar&bar=foo`;
          setup({ path: `${usipPath}${mockParams}` });

          expect(authUtilities.createExternalApplicationUrl()).to.eq(
            `${EXTERNAL_REDIRECTS[application]}${mockParams}`,
          );

          setup({});
        },
      );
    });
  });

  describe('createAndStoreReturnUrl', () => {
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
    });
  });

  describe('redirect', () => {
    it('should redirect to the provided redirectUrl in its simplest use case', () => {
      authUtilities.redirect(base);
      expect(global.window.location).to.equal(base);
    });

    it('should set sessionStorage `authReturnUrl` correctly based on internal or external authentication', () => {
      setup({ path: nonUsipPath });
      authUtilities.redirect(base);
      expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
        `${base}${nonUsipPath}`,
      );

      setup({ path: usipPathWithParams(mhvUsipParams) });

      authUtilities.redirect(base);
      expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
        `${EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]}?deeplinking=home`,
      );
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

  describe('login', () => {
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
    it('should redirect to the mfa session url', () => {
      setup({ path: nonUsipPath });
      authUtilities.mfa();
      expect(global.window.location).to.equal(
        API_SESSION_URL({ type: POLICY_TYPES.MFA }),
      );
    });
  });

  describe('verify', () => {
    it('should redirect to the verify session url', () => {
      setup({ path: nonUsipPath });
      authUtilities.verify();
      expect(global.window.location).to.equal(
        API_SESSION_URL({ type: POLICY_TYPES.VERIFY }),
      );
    });
  });

  describe('logout', () => {
    it('should redirect to the logout session url', () => {
      setup({ path: nonUsipPath });
      authUtilities.logout();
      expect(global.window.location).to.equal(
        API_SESSION_URL({ type: POLICY_TYPES.SLO }),
      );
    });

    it('should redirect to the logout session url with appended params if provided', () => {
      setup({ path: nonUsipPath });
      const params = { foo: 'bar' };
      authUtilities.logout(API_VERSION, AUTH_EVENTS.LOGOUT, params);
      expect(global.window.location).to.equal(
        appendQuery(API_SESSION_URL({ type: POLICY_TYPES.SLO }), params),
      );
    });
  });

  describe('signup', () => {
    it('should redirect to the ID.me signup session url by default', async () => {
      setup({ path: nonUsipPath });
      await authUtilities.signup();
      expect(global.window.location).to.include(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
      );
    });

    it('should append op=signup param for ID.me signups', async () => {
      setup({ path: nonUsipPath });
      await authUtilities.signup();
      expect(global.window.location).to.contain.all(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
        'op=signup',
      );
    });

    it('should redirect to the provided CSPs signup session url', async () => {
      setup({ path: nonUsipPath });
      await authUtilities.signup({ csp: CSP_IDS.LOGIN_GOV });
      expect(global.window.location).to.equal(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.LOGIN_GOV] }),
      );
    });
  });

  describe('signupUrl', () => {
    it('should generate an ID.me session signup url by default', async () => {
      expect(await authUtilities.signupUrl()).to.include(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
      );
    });

    it('should append op=signup param for ID.me signups', async () => {
      expect(await authUtilities.signupUrl(CSP_IDS.ID_ME)).to.contain.all(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
        'op=signup',
      );
    });

    it('should generate a session signup url for the given type', async () => {
      expect(await authUtilities.signupUrl(CSP_IDS.LOGIN_GOV)).to.include(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.LOGIN_GOV] }),
      );
    });

    it('should generate an ID.me session signup url if the given type is not valid', async () => {
      expect(await authUtilities.signupUrl('test')).to.include(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
      );
    });
  });

  describe('generateReturnURL', () => {
    const homepageModalRoute = `${base}/?next=loginModal`;
    const usipRoute = `${base}`;
    const nonHomepageRoute = `${base}/education/eligibility/`;
    const myVARoute = `${base}/my-va/`;
    it('should return users signing in on via the USiP (on default USiP route) to /my-va/', () => {
      expect(authUtilities.generateReturnURL(usipRoute, true)).to.eql(
        myVARoute,
      );
      expect(authUtilities.generateReturnURL(usipRoute, false)).to.eql(
        usipRoute,
      );
    });
    it('should return users signing in via the Sign in Modal (on the homepage) to /my-va/', () => {
      expect(authUtilities.generateReturnURL(homepageModalRoute, true)).to.eql(
        myVARoute,
      );
      expect(authUtilities.generateReturnURL(homepageModalRoute, false)).to.eql(
        homepageModalRoute,
      );
    });
    it('should return users signing in on non-default routes to original location', () => {
      expect(authUtilities.generateReturnURL(nonHomepageRoute, true)).to.eql(
        nonHomepageRoute,
      );
      expect(authUtilities.generateReturnURL(nonHomepageRoute, false)).to.eql(
        nonHomepageRoute,
      );
    });
  });
});
