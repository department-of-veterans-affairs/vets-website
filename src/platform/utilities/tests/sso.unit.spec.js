import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import localStorage from 'platform/utilities/storage/localStorage';
import { checkAndUpdateSSOeSession } from '../sso';

function setKeepAliveResponse(stub, sessionTimeout = 0) {
  const response = new Response();
  response.ok = true;
  response.headers.set('content-type', 'application/json');
  response.headers.set('session-alive', 'true');
  response.headers.set('session-timeout', sessionTimeout);
  response.json = () =>
    Promise.resolve({
      status: 200,
      message: 'OK',
    });

  stub.resolves(response);
}

const SSO_SESSION_TIMEOUT = 900; // seconds

describe('checkAndUpdateSSOeSession', () => {
  it('should should do nothing if there is not SSO session active', () => {
    expect(localStorage.getItem('sessionExpirationSSO')).to.be.null;
    checkAndUpdateSSOeSession();
    expect(localStorage.getItem('sessionExpirationSSO')).to.be.null;
  });

  it('should do nothing if the session expiration is above the timeout threshold', () => {
    mockFetch();
    localStorage.setItem('hasSessionSSO', 'true');
    localStorage.setItem('sessionExpirationSSO', 'some value');
    setKeepAliveResponse(global.fetch.onFirstCall(), SSO_SESSION_TIMEOUT);

    checkAndUpdateSSOeSession();

    expect(localStorage.getItem('sessionExpirationSSO')).to.equal('some value');

    resetFetch();
  });

  it('should make a keepalive request for active SSO sessions below the timeout threshold', () => {
    mockFetch();
    const expiringSession = new Date();
    expiringSession.setTime(Date.now() + 5000);
    localStorage.setItem('hasSessionSSO', 'true');
    localStorage.setItem('sessionExpirationSSO', expiringSession);
    setKeepAliveResponse(global.fetch.onFirstCall(), SSO_SESSION_TIMEOUT);

    checkAndUpdateSSOeSession();

    // The expiration should be different since it will get updated
    expect(localStorage.getItem('sessionExpirationSSO')).to.not.equal(
      expiringSession,
    );
    resetFetch();
  });

  afterEach(() => {
    localStorage.clear();
  });
});
