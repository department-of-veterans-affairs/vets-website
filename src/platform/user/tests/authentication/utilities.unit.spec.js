import { expect } from 'chai';

import {
  login,
  mfa,
  verify,
  logout,
  signup,
} from '../../authentication/utilities';

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
    expect(global.window.location).to.include('/sessions/idme/new?signup');
  });

  it('should redirect for login', () => {
    login('idme');
    expect(global.window.location).to.include('/sessions/idme/new');
  });

  it('should redirect for logout', () => {
    logout();
    expect(global.window.location).to.include('/sessions/slo/new');
  });

  it('should redirect for MFA', () => {
    mfa();
    expect(global.window.location).to.include('/sessions/mfa/new');
  });

  it('should redirect for verify', () => {
    verify();
    expect(global.window.location).to.include('/sessions/verify/new');
  });
});
