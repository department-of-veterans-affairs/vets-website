import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import localStorage from 'platform/utilities/storage/localStorage';
import * as authUtils from 'platform/user/authentication/utilities';
import * as profUtils from 'platform/user/profile/utilities';

import { checkAutoSession, checkAndUpdateSSOeSession } from '../sso';
import * as forceAuth from '../sso/forceAuth';

function setKeepAliveResponse(stub, sessionTimeout = 0, csid = null) {
  const response = new Response();
  response.ok = true;
  response.headers.set('content-type', 'application/json');
  response.headers.set('session-alive', 'true');
  response.headers.set('session-timeout', sessionTimeout);
  response.headers.set('va_eauth_csid', csid);
  response.headers.set(
    'va_eauth_authncontextclassref',
    {
      DSLogon: 'NOT_FOUND ',
      mhv: 'NOT_FOUND ',
      idme: 'http://idmanagement.gov/ns/assurance/loa/3',
    }[csid],
  );
  response.json = () =>
    Promise.resolve({
      status: 200,
      message: 'OK',
    });

  stub.resolves(response);
}

describe('checkAutoSession', () => {
  it('should auto logout if user is logged in and they do not have a SSOe session', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns('true');
    sandbox.stub(profUtils, 'hasSessionSSO').returns(false);
    sandbox.stub(forceAuth, 'getForceAuth').returns(null);
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, 'v1', 'sso-automatic-logout');
  });

  it('should not auto logout if user is logged in and they have a SSOe session', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(true);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(true);
    sandbox.stub(forceAuth, 'getForceAuth').returns(undefined);
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });

  it('should not auto logout if user is logged in and we dont know if they have a SSOe session', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(true);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(null);
    sandbox.stub(forceAuth, 'getForceAuth').returns(undefined);
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });

  it('should auto login if user is logged out, they have an idme SSOe session, dont need to force auth', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(true);
    sandbox.stub(forceAuth, 'getForceAuth').returns(undefined);
    mockFetch();
    setKeepAliveResponse(global.fetch.onFirstCall(), 900, 'idme');
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(
      auto,
      'custom',
      'v1',
      null,
      null,
      { authn: 'http://idmanagement.gov/ns/assurance/loa/3', inbound: 'true' },
      'sso-automatic-login',
    );
  });

  it('should auto login if user is logged out, they have an mhv SSOe session, dont need to force auth', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(true);
    sandbox.stub(forceAuth, 'getForceAuth').returns(undefined);
    mockFetch();
    setKeepAliveResponse(global.fetch.onFirstCall(), 900, 'mhv');
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(
      auto,
      'custom',
      'v1',
      null,
      null,
      { authn: 'myhealthevet', inbound: 'true' },
      'sso-automatic-login',
    );
  });

  it('should not auto login if user is logged out, they have a PIV SSOe session and dont need to force auth', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(true);
    sandbox.stub(forceAuth, 'getForceAuth').returns(undefined);
    setKeepAliveResponse(global.fetch.onFirstCall(), 900, '33');
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });

  it('should not auto login if user is logged out, they dont have a SSOe session and dont need to force auth', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(false);
    sandbox.stub(forceAuth, 'getForceAuth').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });

  it('should not auto login if user is logged out, they have a SSOe session and need to force auth', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(true);
    sandbox.stub(forceAuth, 'getForceAuth').returns(true);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });
});

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
    setKeepAliveResponse(global.fetch.onFirstCall(), 900);

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
    setKeepAliveResponse(global.fetch.onFirstCall(), 900);

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
