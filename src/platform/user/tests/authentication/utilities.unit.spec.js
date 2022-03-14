import { expect } from 'chai';
import sinon from 'sinon';
import appendQuery from 'append-query';

import {
  getLoginAttempted,
  removeLoginAttempted,
} from 'platform/utilities/sso/loginAttempted';
import * as authUtilities from '../../authentication/utilities';
import {
  AUTHN_SETTINGS,
  CSP_IDS,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  API_VERSION,
  API_SESSION_URL,
  SIGNUP_TYPES,
  GA_TRACKING_ID_KEY,
  VAGOV_TRACKING_IDS,
  GA_CLIENT_ID_KEY,
  EBenefitsDefaultPath,
  POLICY_TYPES,
  AUTH_EVENTS,
} from '../../authentication/constants';

const originalLocation = global.window.location;
const originalGA = global.ga;

const base = 'https://www.va.gov';
const usipPath = '/sign-in';
const nonUsipPath = '/about';
const trickyNonUsipPath = '/sign-in-app';
const mhvUsipParams = '?application=mhv&to=home';
const occUsipParams = '?application=vaoccmobile';
const flagshipUsipParams = '?application=vamobile';
const mockGAClientId = '1234';
const mockInvalidGATrackingId = 'UA-12345678-12';

const usipPathWithParams = params => `${usipPath}${params}`;

const mockGADefaultArgs = {
  mockGAActive: false,
  trackingId: VAGOV_TRACKING_IDS[0],
  throwGAError: false,
};

const setup = ({ path, mockGA = mockGADefaultArgs }) => {
  global.window.location = path ? new URL(`${base}${path}`) : originalLocation;
  global.ga = originalGA;
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
                case GA_CLIENT_ID_KEY:
                  return mockGAClientId;
                case GA_TRACKING_ID_KEY:
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

    it('should return application and to params when present', () => {
      setup({ path: usipPathWithParams(mhvUsipParams) });
      const searchParams = new URLSearchParams(global.window.location.search);
      expect(authUtilities.getQueryParams()).to.deep.equal({
        [application]: searchParams.get(application),
        [to]: searchParams.get([to]),
      });
    });

    it('should not return params other than application and to', () => {
      setup({ path: usipPathWithParams(`${mhvUsipParams}&useless=useless`) });
      const searchParams = new URLSearchParams(global.window.location.search);
      expect(authUtilities.getQueryParams()).to.deep.equal({
        [application]: searchParams.get(application),
        [to]: searchParams.get([to]),
      });
    });

    it('should return null for application and to params when not present', () => {
      setup({ path: usipPath });
      expect(authUtilities.getQueryParams()).to.deep.equal({
        [application]: null,
        [to]: null,
      });
    });
  });

  describe('fixUrl', () => {
    const CRLFString = '\r\n';

    it('should return null if not given a url', () => {
      expect(authUtilities.fixUrl()).to.be.null;
    });

    it('should remove trailing slash from urls', () => {
      expect(authUtilities.fixUrl(`${base}/`)).to.equal(base);
    });

    it('should remove potential CRLF injection sequences', () => {
      expect(authUtilities.fixUrl(`${base}${CRLFString}`)).to.equal(base);
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
        'skip_dupe=mhv',
        'redirect=',
        'postLogin=true',
      );
    });

    it('should return session url with _verified appended to type for OCC logins', () => {
      setup({ path: usipPathWithParams(occUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type })).to.equal(
        appendQuery(API_SESSION_URL({ type: typeVerified })),
      );
    });

    it('should return session url with _verified appended to type for Flagship logins', () => {
      setup({ path: usipPathWithParams(flagshipUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type })).to.equal(
        appendQuery(API_SESSION_URL({ type: typeVerified })),
      );
    });

    it('should return session url with _verified appended to type for OCC signups', () => {
      setup({ path: usipPathWithParams(occUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type: signupType })).to.equal(
        appendQuery(API_SESSION_URL({ type: signupTypeVerified })),
      );
    });

    it('should return session url with _verified appended to type for Flagship signups', () => {
      setup({ path: usipPathWithParams(flagshipUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type: signupType })).to.equal(
        appendQuery(API_SESSION_URL({ type: signupTypeVerified })),
      );
    });

    it('should NOT return session url with _verified appended to type for types other than login/signup', () => {
      setup({ path: usipPathWithParams(flagshipUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type: 'other' })).to.equal(
        appendQuery(API_SESSION_URL({ type: 'other' })),
      );
    });

    it('should NOT return session url with _verified appended to type when not on USiP', () => {
      setup({ path: flagshipUsipParams });
      expect(authUtilities.sessionTypeUrl({ type })).to.equal(
        appendQuery(API_SESSION_URL({ type })),
      );
    });

    it('should NOT return session url with _verified appended for external applications other than OCC/Flagship', () => {
      setup({ path: usipPathWithParams(mhvUsipParams) });
      expect(authUtilities.sessionTypeUrl({ type })).to.not.contain(
        '_verified',
      );
    });
  });

  describe('redirectWithGAClientId', () => {
    it('should redirect to redirectUrl without client_id if it does not find one', () => {
      setup({
        mockGA: {
          mockGAActive: true,
          trackingId: mockInvalidGATrackingId,
        },
      });
      expect(global.window.location).to.not.equal(base);
      authUtilities.redirectWithGAClientId(base);
      expect(global.window.location).to.equal(base);
    });

    it('should redirect to redirectUrl with client_id param appended when necessary', () => {
      setup({
        mockGA: {
          mockGAActive: true,
          trackingId: VAGOV_TRACKING_IDS[0],
        },
      });
      expect(global.window.location).to.not.equal(base);
      authUtilities.redirectWithGAClientId(base);
      expect(global.window.location).to.equal(
        `${base}/?client_id=${mockGAClientId}`,
      );
    });

    it('should redirect to redirectUrl without client_id if an error is thrown', () => {
      setup({
        mockGA: {
          mockGAActive: true,
          throwGAError: true,
          trackingId: VAGOV_TRACKING_IDS[0],
        },
      });
      expect(global.window.location).to.not.equal(base);
      authUtilities.redirectWithGAClientId(base);
      expect(global.window.location).to.equal(base);
    });
  });

  describe('generatePath', () => {
    it('should default to an empty string if `to` is null/undefined', () => {
      expect(authUtilities.generatePath('mhv')).to.eql('');
      expect(authUtilities.generatePath('myvahealth')).to.eql('');
    });
    it('should default to `/profilepostauth` for eBenefits', () => {
      expect(authUtilities.generatePath('ebenefits')).to.eql(
        '/profilepostauth',
      );
    });
    it('should default to having a `/` regardless if `to` query params has it for (eBenefits or Cerner)', () => {
      expect(
        authUtilities.generatePath('myvahealth', 'secure_messaging'),
      ).to.eql('/secure_messaging');
      expect(
        authUtilities.generatePath('ebenefits', '/profile_dashboard'),
      ).to.eql('/profile_dashboard');
    });
    it('should create deeplinking query param for mhv if `to` provided', () => {
      expect(authUtilities.generatePath('mhv', 'some_random_link')).to.eql(
        '?deeplinking=some_random_link',
      );
    });
  });

  describe('createExternalApplicationUrl', () => {
    it('should return correct url or null for the parsed application param', () => {
      Object.values(EXTERNAL_APPS).forEach(application => {
        setup({ path: `${usipPath}?application=${application}` });

        const pathAppend = () => {
          switch (application) {
            case EXTERNAL_APPS.EBENEFITS:
              return EBenefitsDefaultPath;
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

    it('should redirect with GA Client ID appended for redirects that include `idme`', () => {
      setup({
        path: base,
        mockGA: {
          mockGAActive: true,
          trackingId: VAGOV_TRACKING_IDS[0],
        },
      });

      authUtilities.redirect(`${base}/idme`);
      expect(
        String(global.window.location).includes(`client_id=${mockGAClientId}`),
      ).to.be.true;
    });
  });

  describe('login', () => {
    it('should setLoginAttempted and redirect to login session url for all CSPs not on USiP', () => {
      Object.values(CSP_IDS).forEach(policy => {
        setup({ path: nonUsipPath });

        authUtilities.login({ policy });
        expect(global.window.location).to.equal(
          authUtilities.sessionTypeUrl({ type: policy }),
        );
        expect(getLoginAttempted()).to.equal('true');
        expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
          `${base}${nonUsipPath}`,
        );
        setup({});
      });
    });

    it('should setLoginAttempted and redirect to login session url for all CSPs on USiP authenticating internally', () => {
      Object.values(CSP_IDS).forEach(policy => {
        setup({ path: usipPath });

        authUtilities.login({ policy });
        expect(global.window.location).to.equal(
          authUtilities.sessionTypeUrl({ type: policy }),
        );
        expect(getLoginAttempted()).to.equal('true');
        expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
          base,
        );
        setup({});
      });
    });

    it('should redirect to login session url for all CSPs on USiP authenticating externally', () => {
      Object.values(CSP_IDS).forEach(policy => {
        setup({ path: usipPathWithParams(mhvUsipParams) });
        const externalApplicationUrl = authUtilities.createExternalApplicationUrl();
        const expectedRedirect = authUtilities.sessionTypeUrl({ type: policy });

        authUtilities.login({ policy });
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
    it('should redirect to the ID.me signup session url by default', () => {
      setup({ path: nonUsipPath });
      authUtilities.signup();
      expect(global.window.location).to.contain(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
      );
    });

    it('should append op=signup param for ID.me signups', () => {
      setup({ path: nonUsipPath });
      authUtilities.signup();
      expect(global.window.location).to.contain.all(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
        'op=signup',
      );
    });

    it('should redirect to the provided CSPs signup session url', () => {
      setup({ path: nonUsipPath });
      authUtilities.signup({ csp: CSP_IDS.LOGIN_GOV });
      expect(global.window.location).to.equal(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.LOGIN_GOV] }),
      );
    });
  });

  describe('signupUrl', () => {
    it('should generate an ID.me session signup url by default', () => {
      expect(authUtilities.signupUrl()).to.contain(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
      );
    });

    it('should append op=signup param for ID.me signups', () => {
      expect(authUtilities.signupUrl(CSP_IDS.ID_ME)).to.contain.all(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
        'op=signup',
      );
    });

    it('should generate a session signup url for the given type', () => {
      expect(authUtilities.signupUrl(CSP_IDS.LOGIN_GOV)).to.contain(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.LOGIN_GOV] }),
      );
    });

    it('should generate an ID.me session signup url if the given type is not valid', () => {
      expect(authUtilities.signupUrl('test')).to.contain(
        API_SESSION_URL({ type: SIGNUP_TYPES[CSP_IDS.ID_ME] }),
      );
    });
  });
});
