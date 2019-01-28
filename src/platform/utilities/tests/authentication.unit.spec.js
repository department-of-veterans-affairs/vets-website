import { expect } from 'chai';
import sinon from 'sinon';
import Raven from 'raven-js';

import {
  login,
  mfa,
  verify,
  logout,
  signup,
} from '../../user/authentication/utilities';

import { mockApiRequest, resetFetch } from '../../testing/unit/helpers';

let oldSessionStorage;
let oldWindow;

const fakeWindow = () => {
  oldSessionStorage = global.sessionStorage;
  oldWindow = window;
  global.sessionStorage = { setItem: () => {} };
  window = {
    dataLayer: [],
    location: {
      get: () => window.location,
      set: value => { window.location = value; },
    }
  };
};

describe('auth URL helpers', () => {
  beforeEach(fakeWindow);
  afterEach(() => {
    window = oldWindow;
    global.sessionStorage = oldSessionStorage;
    resetFetch();
  });

  it('should redirect to an error page', () => {
    mockApiRequest({ error: "Couldn't find url" }, false);
    login('idme')
      .then(() => {
        expect(window.location).to.include('/auth/login/callback');
      });
  });

  it('should redirect for signup', () => {
    mockApiRequest({ url: 'signup-url' });
    signup()
      .then(() => {
        expect(window.location).to.eq('signup-url');
      });
  });

  it('should redirect for login', () => {
    mockApiRequest({ url: 'login-url' });
    login('idme')
      .then(() => {
        expect(window.location).to.eq('login-url');
      });
  });

  it('should redirect for logout', () => {
    mockApiRequest({ url: 'logout-url' });
    logout()
      .then(() => {
        expect(window.location).to.eq('logout-url');
      });
  });

  it('should redirect for MFA', () => {
    mockApiRequest({ url: 'mfa-url' });
    mfa()
      .then(() => {
        expect(window.location).to.eq('mfa-url');
      });
  });

  it('should redirect for verify', () => {
    mockApiRequest({ url: 'verify-url' });
    verify()
      .then(() => {
        expect(window.location).to.eq('verify-url');
      });
  });
});
