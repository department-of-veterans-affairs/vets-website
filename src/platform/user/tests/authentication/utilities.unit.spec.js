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
    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
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

  it('should set sessionStorage to the standaloneRedirect url', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv&to=secure_messaging';

    authUtilities.login({ policy: CSP_IDS.ID_ME });
    expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.include(
      `${EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]}?deeplinking=secure_messaging`,
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

  it.skip('should return a plain url when no `to` search query is provided', () => {
    global.window.location.search = '?application=myvahealth';
    expect(authUtilities.standaloneRedirect()).to.equal(
      EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH],
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
