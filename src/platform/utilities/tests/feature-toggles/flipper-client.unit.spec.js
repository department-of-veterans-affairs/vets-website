import { expect } from 'chai';
import { addHours } from 'date-fns';
import environments from 'platform/utilities/environment';
import FlipperClient from '../../feature-toggles/flipper-client';

const { setDisableCacheSession, isSignOutTriggered } = FlipperClient({
  host: environments.API_URL,
});

describe('setDisableCacheSession', () => {
  beforeEach(() => {
    localStorage.clear(); // clear localStorage before each test
  });

  it('should return true if window.Cypress is truthy', () => {
    window.Cypress = true;
    expect(setDisableCacheSession('8')).to.be.true;
  });

  it('should remove disableCacheTime from localStorage if disableCacheTime is "0"', () => {
    localStorage.setItem('disableCacheTime', 'some value');
    setDisableCacheSession('0');
    expect(localStorage.getItem('disableCacheTime')).to.be.null;
  });

  it('should set disableCacheTime in localStorage if disableCacheTime is "8", "16", or "24"', () => {
    setDisableCacheSession('8');
    expect(localStorage.getItem('disableCacheTime')).to.not.be.null;
  });

  it('should return true if disableCacheTime is set in localStorage and has not expired', () => {
    const now = new Date();
    const disableCacheTime = '8';
    const expiresAt = addHours(now, disableCacheTime);
    localStorage.setItem('disableCacheTime', JSON.stringify({ expiresAt }));
    expect(setDisableCacheSession('8')).to.be.true;
  });

  it('should return false if disableCacheTime is set in localStorage and has expired', () => {
    const now = new Date();
    const disableCacheTime = '8';
    const expiresAt = addHours(now, -disableCacheTime); // set expiresAt to a past date
    localStorage.setItem('disableCacheTime', JSON.stringify({ expiresAt }));
    expect(setDisableCacheSession(null)).to.be.false;
  });

  it('should return false if disableCacheTime is not set in localStorage', () => {
    expect(setDisableCacheSession('10')).to.be.false;
  });
});

describe('isSignOutTriggered', () => {
  beforeEach(() => {
    sessionStorage.clear(); // clear sessionStorage before each test
  });

  it('should return true if sessionStorage.getItem("signOut") is "true"', () => {
    sessionStorage.setItem('signOut', 'true');
    expect(isSignOutTriggered()).to.be.true;
  });

  it('should remove "signOut" from sessionStorage after 10 seconds if it is "true"', done => {
    sessionStorage.setItem('signOut', 'true');
    isSignOutTriggered();
    setTimeout(() => {
      expect(sessionStorage.getItem('signOut')).to.be.null;
      done();
    }, 11 * 1000);
  }).timeout(20000);

  it('should return false if sessionStorage.getItem("signOut") is not "true"', () => {
    sessionStorage.setItem('signOut', 'false');
    expect(isSignOutTriggered()).to.be.false;
  });

  it('should return false if sessionStorage.getItem("signOut") is null', () => {
    expect(isSignOutTriggered()).to.be.false;
  });
});
