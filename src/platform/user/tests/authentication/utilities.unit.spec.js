import { expect } from 'chai';

import {
  login,
  loginAppUrlRE,
  mfa,
  verify,
  logout,
  signup,
  standaloneRedirect,
  externalRedirects,
  authnSettings,
} from '../../authentication/utilities';

import {
  getLoginAttempted,
  removeLoginAttempted,
} from 'platform/utilities/sso/loginAttempted';

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
    signup();
    expect(global.window.location).to.include(
      '/v1/sessions/idme_signup/new?op=signup',
    );
    signup({ version: 'v1', csp: 'idme' });
    expect(global.window.location).to.include(
      '/v1/sessions/idme_signup/new?op=signup',
    );
    signup({ version: 'v1', csp: 'logingov' });
    expect(global.window.location).to.include(
      '/v1/sessions/logingov_signup/new',
    );
  });

  it('should redirect for login v1', () => {
    login({ policy: 'idme' });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should redirect for login with custom event', () => {
    login({ policy: 'idme', clickedEvent: 'custom-event' });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
    expect(global.window.dataLayer[0].event).to.eq('custom-event');
  });

  it('should redirect for logout v1', () => {
    logout('v1');
    expect(global.window.location).to.include('/v1/sessions/slo/new');
  });

  it('should redirect for logout with custom event', () => {
    logout('v1', 'custom-event');
    expect(global.window.location).to.include('/v1/sessions/slo/new');
    expect(global.window.dataLayer[0].event).to.eq('custom-event');
  });

  it('should redirect for MFA v1', () => {
    mfa('v1');
    expect(global.window.location).to.include('/v1/sessions/mfa/new');
  });

  it('should redirect for verify v1', () => {
    verify('v1');
    expect(global.window.location).to.include('/v1/sessions/verify/new');
  });

  it('should not append unneeded query parameters on unified sign-in page on a signup', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv';
    signup();
    expect(global.window.location).to.include(
      `/v1/sessions/idme_signup/new?op=signup`,
    );
  });

  it('should redirect to the proper unified sign-in page redirect for mhv', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv';
    login({ policy: 'idme' });
    expect(global.window.location).to.include(
      `/v1/sessions/idme/new?skip_dupe=mhv&redirect=${
        externalRedirects.mhv
      }&postLogin=true`,
    );
  });

  it('should redirect to the proper unified sign-in page redirect for mhv with `to`', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv&to=secure_messaging';

    login({ policy: 'idme' });
    expect(global.window.location).to.include(
      `/v1/sessions/idme/new?skip_dupe=mhv&redirect=${
        externalRedirects.mhv
      }?deeplinking=secure_messaging&postLogin=true`,
    );
  });

  it('should redirect to the proper unified sign-in page redirect for cerner', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=myvahealth';
    login({ policy: 'idme' });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should mimic modal behavior when sign-in page lacks appliction param', () => {
    global.window.location.pathname = '/sign-in/';
    login({ policy: 'idme' });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should mimic modal behavior when sign-in page has invalid application param', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=foobar';
    login({ policy: 'idme' });
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });
});

describe('setLoginAttempted', () => {
  beforeEach(setup);

  it('should setLoginAttempted true when logging in from modal', () => {
    login({ policy: 'idme' });
    expect(getLoginAttempted()).to.equal('true');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should setLoginAttempted true when logging in from /sign-in with no external redirect', () => {
    global.window.location.pathname = '/sign-in/';
    login({ policy: 'idme' });
    expect(getLoginAttempted()).to.equal('true');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should setLoginAttempted true when logging in from /sign-in with invalid external redirect', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=foobar';
    login({ policy: 'idme' });
    expect(getLoginAttempted()).to.equal('true');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should not setLoginAttempted when logging in from /sign-in with valid external redirect', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv';
    login({ policy: 'idme' });
    expect(getLoginAttempted()).to.be.null;
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });
});

describe('sessionStorage', () => {
  beforeEach(setup);

  it('should sessionStorage to the return url', () => {
    const returnUrl = 'va.gov/refill-rx';
    global.window.location = returnUrl;

    login({ policy: 'idme' });
    expect(sessionStorage.getItem(authnSettings.RETURN_URL)).to.eq(returnUrl);
  });

  it('should set sessionStorage to the standaloneRedirect url', () => {
    const returnUrl = 'va.gov/sign-in/';
    global.window.location = returnUrl;

    login({ policy: 'idme' });
    expect(sessionStorage.getItem(authnSettings.RETURN_URL)).to.include(
      returnUrl,
    );
  });

  it('should set sessionStorage to the standaloneRedirect url', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv&to=secure_messaging';

    login({ policy: 'idme' });
    expect(sessionStorage.getItem(authnSettings.RETURN_URL)).to.include(
      `${externalRedirects.mhv}?deeplinking=secure_messaging`,
    );
  });
});

describe('standaloneRedirect', () => {
  beforeEach(setup);

  it('should return null when an application param is not provided', () => {
    global.window.location.search = '';
    expect(standaloneRedirect()).to.be.null;
  });

  it('should return null when an application redirect is not found', () => {
    global.window.location.search = '?application=unmappedapplication';
    expect(standaloneRedirect()).to.be.null;
  });

  it.skip('should return a plain url when no `to` search query is provided', () => {
    global.window.location.search = '?application=myvahealth';
    expect(standaloneRedirect()).to.equal(externalRedirects.myvahealth);
  });

  it('should strip any CRLF characters from the "to" parameter', () => {
    global.window.location.search =
      '?application=myvahealth&to=/some/sub/route\r\n';
    expect(standaloneRedirect()).to.equal(
      `${externalRedirects.myvahealth}/some/sub/route`,
    );
  });
});

describe('loginAppUrlRE', () => {
  it('should resolve to a login app url', () => {
    expect(loginAppUrlRE.test('/sign-in')).to.be.true;
    expect(loginAppUrlRE.test('/sign-in/')).to.be.true;
    expect(loginAppUrlRE.test('/sign-in/verify')).to.be.true;
    expect(loginAppUrlRE.test('/sign-in/verify/')).to.be.true;
  });
  it('should not resolve to a login app url', () => {
    expect(loginAppUrlRE.test('/sign-in-faq')).to.be.false;
    expect(loginAppUrlRE.test('/sign-in-faq/')).to.be.false;
  });
});
