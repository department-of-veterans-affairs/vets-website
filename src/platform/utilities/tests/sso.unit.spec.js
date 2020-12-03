import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import localStorage from 'platform/utilities/storage/localStorage';
import * as authUtils from 'platform/user/authentication/utilities';
import * as keepAliveMod from 'platform/utilities/sso/keepAliveSSO';

import { checkAutoSession, checkAndUpdateSSOeSession } from '../sso';
import * as loginAttempted from '../sso/loginAttempted';
import { keepAlive } from '../sso/keepAliveSSO';

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

let oldWindow;

const fakeWindow = () => {
  oldWindow = global.window;
  global.window = Object.create(global.window);
  Object.assign(global.window, {
    dataLayer: [],
    location: {
      get: () => global.window.location,
      set: value => {
        global.window.location = value;
      },
      pathname: '',
      search: '',
    },
  });
};

describe('checkAutoSession', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fakeWindow();
  });

  afterEach(() => {
    sandbox.restore();
    global.window = oldWindow;
  });

  it('should redirect user to cerner if logged in via SSOe and on the "/sign-in/?application=myvahealth" subroute', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: 'dslogon',
      transactionid: 'X',
    });
    global.window.location.origin = 'http://localhost';
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=myvahealth';
    const profile = { verified: true };
    await checkAutoSession(true, 'X', profile);

    expect(global.window.location).to.eq(
      'https://ehrm-va-test.patientportal.us.healtheintent.com/',
    );
  });

  it('should do nothing if on "/sign-in/?application=myvahealth" and not verified', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: 'dslogon',
      transactionid: 'X',
    });
    global.window.location.origin = 'http://localhost';
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=myvahealth';
    const profile = { verified: false };
    await checkAutoSession(true, 'X', profile);

    expect(global.window.location.origin).to.eq('http://localhost');
    expect(global.window.location.pathname).to.eq('/sign-in/');
    expect(global.window.location.search).to.eq('?application=myvahealth');
  });

  it('should redirect user to home page if logged in via SSOe, verified, and on the standalone sign in page', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: 'dslogon',
      transactionid: 'X',
    });
    global.window.location.origin = 'http://localhost';
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '';
    const profile = { verified: true };

    await checkAutoSession(true, 'X', profile);

    expect(global.window.location).to.eq('http://localhost');
  });

  it('should re login user before redirect to myvahealth because transactions are different', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: 'dslogon',
      transactionid: 'X',
    });
    global.window.location.origin = 'http://localhost';
    global.window.location.pathname = '/sign-in/';
    global.window.location.search = '?application=myvahealth';
    const profile = { verified: true };

    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession(true, 'Y', profile);

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(
      auto,
      'custom',
      'v1',
      { authn: 'dslogon' },
      'sso-automatic-login',
    );
  });

  it('should auto logout if user has logged in via SSOe and they do not have a SSOe session anymore', async () => {
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: false, ttl: 0, authn: undefined });
    const auto = sandbox.stub(authUtils, 'logout');

    await checkAutoSession(true, 'X');

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, 'v1', 'sso-automatic-logout', {
      'auto-logout': 'true',
    });
  });

  it('should not auto logout if user is logged without SSOe and they do not have a SSOe session', async () => {
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: false, ttl: 0, authn: undefined });
    const auto = sandbox.stub(authUtils, 'logout');

    await checkAutoSession(true, undefined);

    sinon.assert.notCalled(auto);
  });

  it('should auto login if user is logged in and they have a mismatched SSOe session', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: 'dslogon',
      transactionid: 'X',
    });
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession(true, 'Y');

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(
      auto,
      'custom',
      'v1',
      { authn: 'dslogon' },
      'sso-automatic-login',
    );
  });

  it('should not auto logout if user is logged in and they have a matched SSOe session', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: 'dslogon',
      transactionid: 'Y',
    });
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession(true, 'Y');

    sinon.assert.notCalled(auto);
  });

  it('should not auto logout if user is logged in and we dont know if they have a SSOe session', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({});
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession(true, 'Y');

    sinon.assert.notCalled(auto);
  });

  it('should not auto logout if user is logged in without SSOe and they dont have a SSOe session', async () => {
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: true, ttl: 0, authn: undefined });
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should auto login if user is logged out, they have an idme SSOe session, have not previously tried to login', async () => {
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
      { authn: 'dslogon' },
      'sso-automatic-login',
    );
  });

  it('should auto login if user is logged out, they have an mhv SSOe session, dont need to force auth', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: 'myhealthevet',
      transactionid: 'X',
    });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(
      auto,
      'custom',
      'v1',
      { authn: 'myhealthevet' },
      'sso-automatic-login',
    );
  });

  it('should not auto login if user is logged out, they have a PIV SSOe session and dont need to force auth', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: null,
      transactionid: 'X',
    });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should not auto login if user is logged out, they dont have a SSOe session and dont need to force auth', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: false,
      ttl: 0,
      authn: undefined,
      transactionid: undefined,
    });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should not auto login if user is logged out, they have a SSOe session and need to force auth', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      sessionAlive: true,
      ttl: 900,
      authn: 'dslogon',
      transactionid: 'X',
    });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(true);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });
});

describe('checkAndUpdateSSOeSession', () => {
  beforeEach(() => {
    localStorage.clear();
  });

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

describe.skip('keepAlive', () => {
  let sandbox;
  let stubFetch;

  before(() => {
    sandbox = sinon.createSandbox();
    stubFetch = sandbox.stub(global, 'fetch');
  });

  after(() => {
    sandbox.restore();
  });

  it('should return an empty object on a type error', () => {
    stubFetch.rejects('TypeError');
    return keepAlive().then(res => expect(res).to.eql({}));
  });

  it('should return ttl 0 when not alive', () => {
    const resp = new Response('{}', {
      headers: {
        'session-alive': 'false',
        'session-timeout': '900',
      },
    });
    stubFetch.resolves(resp);
    return keepAlive().then(res => {
      expect(res).to.eql({
        ttl: 0,
        transactionid: null,
        authn: undefined,
      });
    });
  });

  it('should return active dslogon session', () => {
    /* eslint-disable camelcase */
    const resp = new Response('{}', {
      headers: {
        'session-alive': 'true',
        'session-timeout': '900',
        va_eauth_transactionid: 'X',
        va_eauth_csid: 'DSLogon',
      },
    });
    /* eslint-enable camelcase */
    stubFetch.resolves(resp);
    return keepAlive().then(res => {
      expect(res).to.eql({
        ttl: 900,
        transactionid: 'X',
        authn: 'dslogon',
      });
    });
  });

  it('should return active mhv session', () => {
    /* eslint-disable camelcase */
    const resp = new Response('{}', {
      headers: {
        'session-alive': 'true',
        'session-timeout': '900',
        va_eauth_transactionid: 'X',
        va_eauth_csid: 'mhv',
      },
    });
    /* eslint-enable camelcase */
    stubFetch.resolves(resp);
    return keepAlive().then(res => {
      expect(res).to.eql({
        ttl: 900,
        transactionid: 'X',
        authn: 'myhealthevet',
      });
    });
  });

  it('should return active idme session', () => {
    /* eslint-disable camelcase */
    const resp = new Response('{}', {
      headers: {
        'session-alive': 'true',
        'session-timeout': '900',
        va_eauth_transactionid: 'X',
        va_eauth_csid: 'idme',
        va_eauth_authncontextclassref: '/loa1',
      },
    });
    /* eslint-enable camelcase */
    stubFetch.resolves(resp);
    return keepAlive().then(res => {
      expect(res).to.eql({
        ttl: 900,
        transactionid: 'X',
        authn: '/loa1',
      });
    });
  });
});
