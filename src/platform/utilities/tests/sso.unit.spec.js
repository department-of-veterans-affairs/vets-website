import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import localStorage from 'platform/utilities/storage/localStorage';
import * as authUtils from 'platform/user/authentication/utilities';
import * as apiUtils from 'platform/utilities/api';
import * as keepAliveMod from 'platform/utilities/sso/keepAliveSSO';

import { checkAutoSession, checkAndUpdateSSOeSession } from '../sso';
import * as loginAttempted from '../sso/loginAttempted';

function setKeepAliveResponse(stub, sessionTimeout = 0, csid = null) {
  const response = new Response();
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
  response.json = () => Promise.resolve({ status: 200 });

  stub.resolves(response);
}

describe('checkAutoSession', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should auto logout if user has logged in via SSOe and they do not have a SSOe session anymore', async () => {
    mockFetch({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            attributes: {
              profile: {
                // eslint-disable-next-line camelcase
                sign_in: {
                  ssoe: true,
                },
              },
            },
          },
        }),
    });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: false, ttl: 0, authn: undefined });
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, 'v1', 'sso-automatic-logout');
  });

  it('should not auto logout if user is logged without SSOe and they do not have a SSOe session', async () => {
    mockFetch({ ok: true });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: false, ttl: 0, authn: undefined });
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should not auto logout if user is logged in and they have a SSOe session', async () => {
    mockFetch({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            attributes: {
              profile: {},
            },
          },
        }),
    });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: true, ttl: 900, authn: 'dslogon' });
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should not auto logout if user is logged in and we dont know if they have a SSOe session', async () => {
    mockFetch({ ok: true });
    sandbox.stub(keepAliveMod, 'keepAlive').returns({});
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should not auto logout if user is logged in without SSOe and they dont have a SSOe session', async () => {
    mockFetch({ ok: true });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: true, ttl: 0, authn: undefined });
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should auto login if user is logged out, they have an idme SSOe session, have not previously tried to login', async () => {
    mockFetch({ ok: false });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: true, ttl: 900, authn: 'dslogon' });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(
      auto,
      'custom',
      'v1',
      null,
      null,
      { authn: 'dslogon' },
      'sso-automatic-login',
    );
  });

  it('should auto login if user is logged out, they have an mhv SSOe session, dont need to force auth', async () => {
    mockFetch({ ok: false });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: true, ttl: 900, authn: 'myhealthevet' });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(
      auto,
      'custom',
      'v1',
      null,
      null,
      { authn: 'myhealthevet' },
      'sso-automatic-login',
    );
  });

  it('should not auto login if user is logged out, they have a PIV SSOe session and dont need to force auth', async () => {
    mockFetch({ ok: false });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: true, ttl: 900, authn: null });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should not auto login if user is logged out, they dont have a SSOe session and dont need to force auth', async () => {
    mockFetch({ ok: false });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: false, ttl: 0, authn: undefined });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should not auto login if user is logged out, they have a SSOe session and need to force auth', async () => {
    mockFetch({ ok: false });
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: true, ttl: 900, authn: 'dslogon' });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(true);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

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
