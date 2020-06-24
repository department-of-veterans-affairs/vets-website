import { expect } from 'chai';
import sinon from 'sinon';

import * as forceAuth from 'platform/utilities/sso/forceAuth';

import {
  login,
  mfa,
  verify,
  logout,
  signup,
  standaloneRedirect,
  externalRedirects,
} from '../../authentication/utilities';
import { executablePath } from 'puppeteer';

let oldSessionStorage;
let oldLocalStorage;
let oldWindow;

const fakeWindow = () => {
  oldSessionStorage = global.sessionStorage;
  oldLocalStorage = global.localStorage;
  oldWindow = global.window;
  global.sessionStorage = { setItem: () => {}, removeItem: () => {} };
  global.localStorage = { setItem: () => {}, removeItem: () => {} };
  global.window = {
    dataLayer: [],
    location: {
      get: () => global.window.location,
      set: value => {
        global.window.location = value;
      },
      pathname: '',
      search: '',
    },
  };
};

describe('authentication URL helpers', () => {
  beforeEach(fakeWindow);
  afterEach(() => {
    global.window = oldWindow;
    global.sessionStorage = oldSessionStorage;
    global.localStorage = oldLocalStorage;
  });

  it('should redirect for signup', () => {
    signup();
    expect(global.window.location).to.include('/sessions/signup/new');
  });

  it('should redirect for signup v1', () => {
    signup('v1');
    expect(global.window.location).to.include('/v1/sessions/signup/new');
  });

  it('should redirect for login', () => {
    login('idme');
    expect(global.window.location).to.include('/sessions/idme/new');
  });

  it('should redirect for login v1', () => {
    login('idme', 'v1');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
  });

  it('should redirect for login v1 with force auth', () => {
    const stub = sinon.stub(forceAuth, 'getForceAuth').callsFake(() => true);
    login('idme', 'v1');
    stub.restore();
    expect(global.window.location).to.include(
      '/v1/sessions/idme/new?force=true',
    );
  });

  it('should redirect for login with custom event', () => {
    login('idme', 'v1', {}, 'custom-event');
    expect(global.window.location).to.include('/v1/sessions/idme/new');
    expect(global.window.dataLayer[0].event).to.eq('custom-event');
  });

  it('should redirect for logout', () => {
    logout();
    expect(global.window.location).to.include('/sessions/slo/new');
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
    expect(global.window.location).to.include('/sessions/mfa/new');
  });

  it('should redirect for MFA v1', () => {
    mfa('v1');
    expect(global.window.location).to.include('/v1/sessions/mfa/new');
  });

  it('should redirect for verify', () => {
    verify();
    expect(global.window.location).to.include('/sessions/verify/new');
  });

  it('should redirect for verify v1', () => {
    verify('v1');
    expect(global.window.location).to.include('/v1/sessions/verify/new');
  });
});

describe('standaloneRedirect', () => {
  beforeEach(fakeWindow);
  afterEach(() => {
    global.window = oldWindow;
  });

  it('should return null when an application redirect is not found', () => {
    global.window.location.search = '?application=unmappedapplication';
    expect(standaloneRedirect());
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
