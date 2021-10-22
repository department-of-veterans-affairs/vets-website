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
} from '../../authentication/utilities';

const setup = () => {
  global.window.location = {
    get: () => global.window.location,
    set: value => {
      global.window.location = value;
    },
    pathname: '',
    search: '',
  };
};

describe('authentication URL helpers', () => {
  beforeEach(setup);

  it('should redirect for signup v0 to v1', () => {
    signup('v0');
    expect(global.window.location).to.include('/v1/sessions/signup/new');
  });

  it('should redirect for signup v1', () => {
    signup('v1');
    expect(global.window.location).to.include('/v1/sessions/signup/new');
  });

  it('should redirect for login v0 to v1', () => {
    login('idme', 'v0');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should redirect for login v1', () => {
    login('idme', 'v1');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should redirect for login with custom event', () => {
    login('idme', 'v1', {}, 'custom-event');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
    expect(global.window.dataLayer[0].event).to.eq('custom-event');
  });

  it('should redirect for logout', () => {
    logout('v0');
    expect(global.window.location).to.include('/v1/sessions/slo/new');
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

  it('should redirect for MFA v0 to v1', () => {
    mfa('v0');
    expect(global.window.location).to.include('/v1/sessions/mfa/new');
  });

  it('should redirect for MFA v1', () => {
    mfa('v1');
    expect(global.window.location).to.include('/v1/sessions/mfa/new');
  });

  it('should redirect for verify v0 to v1', () => {
    verify('v0');
    expect(global.window.location).to.include('/v1/sessions/verify/new');
  });

  it('should redirect for verify v1', () => {
    verify('v1');
    expect(global.window.location).to.include('/v1/sessions/verify/new');
  });

  it('should redirect to the proper unified sign-in page redirect for mhv', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv';
    login('idme', 'v1');
    expect(global.window.location).to.include(
      '/v1/sessions/idme/new?redirect=mhv_home',
    );
  });

  it('should redirect to the proper unified sign-in page redirect for mhv with `to`', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=mhv&to=secure_messaging';

    login('idme', 'v1');
    expect(global.window.location).to.include(
      '/v1/sessions/idme/new?redirect=mhv_secure_messaging',
    );
  });

  it('should redirect to the proper unified sign-in page redirect for cerner', () => {
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=myvahealth';
    login('idme', 'v1');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
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

  it('should return a plain url when no `to` search query is provided', () => {
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
