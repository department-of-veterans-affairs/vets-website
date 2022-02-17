import { expect } from 'chai';

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
} from '../../authentication/constants';

const setup = () => {
  global.window.location = {
    get: () => global.window.location,
    set: value => {
      global.window.location = value;
    },
    pathname: '',
    search: '',
  };
  removeLoginAttempted();
};

describe('authentication URL helpers', () => {
  beforeEach(setup);

  it('should redirect for signup v1', () => {
    authUtilities.signup();
    expect(global.window.location).to.include(
      '/v1/sessions/idme_signup/new?op=signup',
    );
    authUtilities.signup({ version: API_VERSION, csp: CSP_IDS.ID_ME });
    expect(global.window.location).to.include(
      '/v1/sessions/idme_signup/new?op=signup',
    );
    authUtilities.signup({ version: API_VERSION, csp: CSP_IDS.LOGIN_GOV });
    expect(global.window.location).to.include(
      '/v1/sessions/logingov_signup/new',
    );
  });

  it('should redirect for login v1', () => {
    [CSP_IDS.ID_ME, CSP_IDS.MHV, CSP_IDS.DS_LOGON, CSP_IDS.LOGIN_GOV].forEach(
      csp => {
        authUtilities.login({ policy: csp });
        expect(global.window.location).to.include(`/v1/sessions/${csp}/new`);
      },
    );
  });

  it('should redirect for login with custom event', () => {
    authUtilities.login({
      policy: CSP_IDS.ID_ME,
      clickedEvent: 'custom-event',
    });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
    expect(global.window.dataLayer[0].event).to.eq('custom-event');
  });

  it('should redirect for logout v1', () => {
    authUtilities.logout(API_VERSION);
    expect(global.window.location).to.include('/v1/sessions/slo/new');
  });

  it('should redirect for logout with custom event', () => {
    authUtilities.logout(API_VERSION, 'custom-event');
    expect(global.window.location).to.include('/v1/sessions/slo/new');
    expect(global.window.dataLayer[0].event).to.eq('custom-event');
  });

  it('should redirect for MFA v1', () => {
    authUtilities.mfa(API_VERSION);
    expect(global.window.location).to.include('/v1/sessions/mfa/new');
  });

  it('should redirect for verify v1', () => {
    authUtilities.verify(API_VERSION);
    expect(global.window.location).to.include('/v1/sessions/verify/new');
  });

  it('should not append unneeded query parameters on unified sign-in page on a signup', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv';
    authUtilities.signup();
    expect(global.window.location).to.include(
      `/v1/sessions/idme_signup/new?op=signup`,
    );
  });

  it('should redirect to the proper unified sign-in page redirect for mhv', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv';
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(global.window.location).to.include(
      `/v1/sessions/idme/new?skip_dupe=mhv&redirect=${
        EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]
      }&postLogin=true`,
    );
  });

  it('should redirect to the proper unified sign-in page redirect for mhv with `to`', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv&to=secure_messaging';

    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(global.window.location).to.include(
      `/v1/sessions/idme/new?skip_dupe=mhv&redirect=${
        EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]
      }?deeplinking=secure_messaging&postLogin=true`,
    );
  });

  it('should redirect to the proper unified sign-in page redirect for cerner', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=myvahealth';
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should redirect to the proper unified sign-in page redirect for eBenefits', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=ebenefits';
    authUtilities.login({ policy: CSP_IDS.DS_LOGON });
    expect(global.window.location).to.include('/v1/sessions/dslogon/new');
  });

  it('should redirect to the proper unified sign-in page redirect for VA Flaghsip Mobile', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=vamobile';
    authUtilities.login({ policy: CSP_IDS.DS_LOGON });
    expect(global.window.location).to.include(
      '/v1/sessions/dslogon_verified/new',
    );
  });

  it('should redirect to the proper unified sign-in page redirect for VA OCC Mobile', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=vaoccmobile';
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(global.window.location).to.include('/v1/sessions/idme_verified/new');
  });

  it('should mimic modal behavior when sign-in page lacks appliction param', () => {
    global.window.location.pathname = '/sign-in/';
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should mimic modal behavior when sign-in page has invalid application param', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=foobar';
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });
});

describe('setLoginAttempted', () => {
  beforeEach(setup);

  it('should setLoginAttempted true when logging in from modal', () => {
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(getLoginAttempted()).to.equal('true');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should setLoginAttempted true when logging in from /sign-in with no external redirect', () => {
    global.window.location.pathname = '/sign-in/';
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(getLoginAttempted()).to.equal('true');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should setLoginAttempted true when logging in from /sign-in with invalid external redirect', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=foobar';
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(getLoginAttempted()).to.equal('true');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should not setLoginAttempted when logging in from /sign-in with valid external redirect', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv';
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(getLoginAttempted()).to.be.null;
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });
});

describe('sessionStorage', () => {
  beforeEach(setup);

  it('should sessionStorage to the return url', () => {
    const returnUrl = 'va.gov/refill-rx';
    global.window.location = returnUrl;

    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.eq(returnUrl);
  });

  it('should set sessionStorage on `/sign-in` page to homepage', () => {
    const returnUrl = 'va.gov';
    global.window.location.set(returnUrl);
    global.window.pathname = '/sign-in/';

    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.eq(returnUrl);
  });

  it('should set sessionStorage to the standaloneRedirect url (MHV)', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv&to=secure_messaging';

    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.include(
      `${EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]}?deeplinking=secure_messaging`,
    );
  });

  it('should set sessionStorage to the standaloneRedirect url (eBenefits)', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=ebenefits&to=some_place';

    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.include(
      `${EXTERNAL_REDIRECTS[EXTERNAL_APPS.EBENEFITS]}/some_place`,
    );
  });

  it('should set sessionStorage to the standaloneRedirect url (VA Flagship Mobile)', () => {
    const vaMobileParams =
      '?application=vamobile&client_id=VAMobile&state=state';
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = vaMobileParams;

    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.include(
      `${
        EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]
      }${vaMobileParams}`,
    );
  });

  it('should set sessionStorage to the standaloneRedirect url (VA OCC Mobile)', () => {
    const occParams = '?application=vaoccmobile&redirect_uri=xyz';
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = occParams;

    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.include(
      `${EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_OCC_MOBILE]}${occParams}`,
    );
  });
});

describe('standaloneRedirect', () => {
  beforeEach(setup);

  it('should return null when an application param is not provided', () => {
    global.window.location.search = '';
    expect(authUtilities.standaloneRedirect()).to.be.null;
  });

  it('should return null when an application redirect is not found', () => {
    global.window.location.search = '?application=unmappedapplication';
    expect(authUtilities.standaloneRedirect()).to.be.null;
  });

  it('should return a plain url for (MHV & Cerner) when no `to` search query is provided', () => {
    global.window.location.search = `?application=${EXTERNAL_APPS.MHV}`;
    expect(authUtilities.standaloneRedirect()).to.equal(
      EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV],
    );
  });

  it('should return the default `/profilepostauth` for (eBenefits) when no `to` search query is provided', () => {
    global.window.location.search = `?application=${EXTERNAL_APPS.EBENEFITS}`;
    expect(authUtilities.standaloneRedirect()).to.equal(
      `${EXTERNAL_REDIRECTS[EXTERNAL_APPS.EBENEFITS]}/profilepostauth`,
    );
  });

  it('should strip any CRLF characters from the "to" parameter', () => {
    global.window.location.search =
      '?application=myvahealth&to=/some/sub/route\r\n';
    expect(authUtilities.standaloneRedirect()).to.equal(
      `${EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH]}/some/sub/route`,
    );
  });
});

describe('loginAppUrlRE', () => {
  it('should resolve to a login app url', () => {
    expect(authUtilities.loginAppUrlRE.test('/sign-in')).to.be.true;
    expect(authUtilities.loginAppUrlRE.test('/sign-in/')).to.be.true;
    expect(authUtilities.loginAppUrlRE.test('/sign-in/verify')).to.be.true;
    expect(authUtilities.loginAppUrlRE.test('/sign-in/verify/')).to.be.true;
  });
  it('should not resolve to a login app url', () => {
    expect(authUtilities.loginAppUrlRE.test('/sign-in-faq')).to.be.false;
    expect(authUtilities.loginAppUrlRE.test('/sign-in-faq/')).to.be.false;
  });
});

describe('generatePath', () => {
  it('should default to an empty string if `to` is null/undefined', () => {
    expect(authUtilities.generatePath('mhv')).to.eql('');
    expect(authUtilities.generatePath('myvahealth')).to.eql('');
  });
  it('should default to `/profilepostauth` for eBenefits', () => {
    expect(authUtilities.generatePath('ebenefits')).to.eql('/profilepostauth');
  });
  it('should default to having a `/` regardless if `to` query params has it for (eBenefits or Cerner)', () => {
    expect(authUtilities.generatePath('myvahealth', 'secure_messaging')).to.eql(
      '/secure_messaging',
    );
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
