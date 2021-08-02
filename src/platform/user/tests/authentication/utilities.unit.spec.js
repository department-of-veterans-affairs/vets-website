import { expect } from 'chai';

import {
  login,
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

  it('should redirect for signup', () => {
    signup();
    expect(global.window.location).to.include('/v1/sessions/signup/new');
  });

  it('should redirect for signup v1', () => {
    signup('v1');
    expect(global.window.location).to.include('/v1/sessions/signup/new');
  });

  it('should redirect for login', () => {
    login('idme');
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
    logout();
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

  it('should redirect for MFA', () => {
    mfa();
    expect(global.window.location).to.include('/v1/sessions/mfa/new');
  });

  it('should redirect for MFA v1', () => {
    mfa('v1');
    expect(global.window.location).to.include('/v1/sessions/mfa/new');
  });

  it('should redirect for verify', () => {
    verify();
    expect(global.window.location).to.include('/v1/sessions/verify/new');
  });

  it('should redirect for verify v1', () => {
    verify('v1');
    expect(global.window.location).to.include('/v1/sessions/verify/new');
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

  it('should return an plain url when no "to" search query is provided', () => {
    global.window.location.search = '?application=myvahealth';
    expect(standaloneRedirect()).to.equal(externalRedirects.myvahealth);
  });

  it('should strip any CRLF characters from the "to" parameter', () => {
    global.window.location.search =
      '?application=myvahealth&to=/some/sub/route\r\n';
    expect(standaloneRedirect()).to.equal(
      `${externalRedirects.myvahealth}some/sub/route`,
    );
  });
});
