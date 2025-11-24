import { expect } from 'chai';
import sinon from 'sinon';

import localStorage from 'platform/utilities/storage/localStorage';
import * as authUtils from 'platform/user/authentication/utilities';
import * as keepAliveMod from 'platform/utilities/sso/keepAliveSSO';

import {
  checkAutoSession,
  checkAndUpdateSSOeSession,
  verifySession,
} from 'platform/utilities/sso';
import * as loginAttempted from 'platform/utilities/sso/loginAttempted';
import {
  AUTHN_HEADERS,
  AUTHN_KEYS,
  CSP_AUTHN,
  CSP_KEYS,
} from 'platform/utilities/sso/constants';
import {
  API_VERSION,
  AUTH_EVENTS,
  CSP_IDS,
} from 'platform/user/authentication/constants';

const defaultKeepAliveOpts = {
  [AUTHN_HEADERS.ALIVE]: 'false',
  [AUTHN_HEADERS.TIMEOUT]: 900,
  [AUTHN_HEADERS.TRANSACTION_ID]: null,
  [AUTHN_HEADERS.CSP]: undefined,
  [AUTHN_HEADERS.AUTHN_CONTEXT]: 'NOT_FOUND',
  [AUTHN_HEADERS.IAL]: null,
  [AUTHN_HEADERS.CSP_METHOD]: '',
};

function generateMockKeepAliveResponse(
  { headers = {}, status = 200 } = {
    headers: {
      ...defaultKeepAliveOpts,
    },
  },
) {
  const mergedHeaders = { ...defaultKeepAliveOpts, ...headers };
  return new Response('{}', {
    headers: { ...mergedHeaders },
    status,
    text: () => 'ok',
    json: () => Promise.resolve({ status }),
  });
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
      host: 'dev.va.gov',
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
    localStorage.clear();
  });

  ['sandbox', 'staging'].forEach(cernerEndpoint => {
    it('should redirect user to cerner if logged in via SSOe and on the "/sign-in/?application=myvahealth" subroute', async () => {
      sandbox.stub(keepAliveMod, 'keepAlive').returns({
        ttl: 900,
        authn: CSP_IDS.ID_ME,
        transactionid: 'X',
      });
      const startingLocation = new URL(
        `http://localhost/sign-in/?application=myvahealth&to=%2Fsession-api%2Frealm%2Ff0fded0d-d00b-4b28-9190-853247fd9f9d%3Fto%3Dhttps%253A%252F%252F${cernerEndpoint}-patientportal.myhealth.va.gov%252F`,
      );
      if (Window.prototype.href) {
        global.window.location.href = startingLocation;
      } else {
        global.window.location = startingLocation;
      }
      const profile = { verified: true };
      await checkAutoSession(true, 'X', profile);

      const location = global.window.location.href || global.window.location;
      expect(location).to.eq(
        `https://${cernerEndpoint}-patientportal.myhealth.va.gov/session-api/realm/f0fded0d-d00b-4b28-9190-853247fd9f9d?authenticated=true`,
      );
    });
  });

  it('should do nothing if on "/sign-in/?application=myvahealth" and not verified', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      ttl: 900,
      authn: CSP_IDS.ID_ME,
      transactionid: 'X',
    });
    const startingLocation = new URL(
      'http://localhost/sign-in/?application=myvahealth',
    );
    if (Window.prototype.href) {
      global.window.location.href = startingLocation;
    } else {
      global.window.location = startingLocation;
    }
    const profile = { verified: false };
    await checkAutoSession(true, 'X', profile);

    expect(global.window.location.origin).to.eq('http://localhost');
    expect(global.window.location.pathname).to.eq('/sign-in/');
    expect(global.window.location.search).to.eq('?application=myvahealth');
  });

  it('should redirect user to home page if logged in via SSOe, verified, and on the standalone sign in page', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      ttl: 900,
      authn: CSP_IDS.ID_ME,
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
      transactionid: 'X',
    });
    const startingLocation = new URL('http://localhost/sign-in/');
    if (Window.prototype.href) {
      global.window.location.href = startingLocation;
    } else {
      global.window.location = startingLocation;
    }
    const profile = { verified: true };

    await checkAutoSession(true, 'X', profile);

    const location = global.window.location.href || global.window.location;
    expect(location).to.be.oneOf(['http://localhost', 'http://localhost/']);
  });

  it('should re login user before redirect to myvahealth because transactions are different', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      ttl: 900,
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
      authn: CSP_IDS.ID_ME,
      transactionid: 'X',
    });
    const startingLocation = new URL(
      'http://localhost/sign-in/?application=myvahealth',
    );
    if (Window.prototype.href) {
      global.window.location.href = startingLocation;
    } else {
      global.window.location = startingLocation;
    }
    const profile = { verified: true };

    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession(true, 'Y', profile);

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, {
      policy: 'custom',
      queryParams: {
        authn: CSP_IDS.ID_ME,
        [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
      },
      clickedEvent: AUTH_EVENTS.SSO_LOGIN,
    });
  });

  it('should auto logout if user has logged in via SSOe and they do not have a SSOe session anymore', async () => {
    sandbox
      .stub(keepAliveMod, 'keepAlive')
      .returns({ sessionAlive: false, ttl: 0, authn: undefined });
    const auto = sandbox.stub(authUtils, 'logout');

    await checkAutoSession(true, 'X');

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, API_VERSION, AUTH_EVENTS.SSO_LOGOUT, {
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
      ttl: 900,
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.LOGINGOV.toLowerCase(),
      ial: '2',
      transactionid: 'X',
    });
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession(true, 'Y');

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, {
      policy: 'custom',
      queryParams: {
        [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.LOGINGOV.toLowerCase(),
        ial: '2',
      },
      clickedEvent: AUTH_EVENTS.SSO_LOGIN,
    });
  });

  it('should not auto logout if user is logged in and they have a matched SSOe session', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      ttl: 900,
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
      authn: CSP_IDS.ID_ME,
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
      .returns({ ttl: 0, authn: undefined });
    const auto = sandbox.stub(authUtils, 'logout');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should auto login if user is logged out, they have an ID.me SSOe session, have not previously tried to login', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      ttl: 900,
      authn: CSP_IDS.ID_ME,
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
    });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, {
      policy: 'custom',
      queryParams: {
        authn: CSP_IDS.ID_ME,
        [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
      },
      clickedEvent: AUTH_EVENTS.SSO_LOGIN,
    });
  });

  it('should auto login if user is logged out, they have an MHV SSOe session, dont need to force auth', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      ttl: 900,
      authn: CSP_IDS.ID_ME,
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
      transactionid: 'X',
    });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    sandbox.stub();
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, {
      policy: 'custom',
      queryParams: {
        authn: CSP_IDS.ID_ME,
        [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
      },
      clickedEvent: AUTH_EVENTS.SSO_LOGIN,
    });
  });

  it('should auto login if user is logged out, they have an MHV SSOe session, dont need to force auth', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      ttl: 900,
      authn: CSP_IDS.MHV_VERBOSE,
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.MHV,
      transactionid: 'X',
    });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(undefined);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.calledOnce(auto);
    sinon.assert.calledWith(auto, {
      policy: 'custom',
      queryParams: {
        authn: CSP_IDS.MHV_VERBOSE,
        [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.MHV,
      },
      clickedEvent: AUTH_EVENTS.SSO_LOGIN,
    });
  });

  it('should not auto login if user is logged out, they have a PIV SSOe session and dont need to force auth', async () => {
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
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
      ttl: 900,
      authn: CSP_IDS.ID_ME,
      transactionid: 'X',
    });
    sandbox.stub(loginAttempted, 'getLoginAttempted').returns(true);
    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession();

    sinon.assert.notCalled(auto);
  });

  it('should log a user in if they `loginAttempted` is true but the `loggedIn` is false', async () => {
    global.window.location.host = `dev.va.gov`;
    localStorage.setItem('loginAttempted', true);
    localStorage.setItem('hasSessionSSO', true);
    localStorage.setItem('sessionExpirationSSO', 'some date value');
    sandbox.stub(keepAliveMod, 'keepAlive').returns({
      ttl: 900,
      authn: 'logingov',
      transactionid: 'X',
      [AUTHN_KEYS.CSP_TYPE]: 'logingov',
    });

    const auto = sandbox.stub(authUtils, 'login');
    await checkAutoSession(false);

    sinon.assert.called(auto);
    sinon.assert.calledWith(auto, {
      policy: 'custom',
      queryParams: {
        authn: 'logingov',
        [AUTHN_KEYS.CSP_TYPE]: 'logingov',
      },
      clickedEvent: AUTH_EVENTS.SSO_LOGIN,
    });
    localStorage.clear();
  });
});

describe('checkAndUpdateSSOeSession', () => {
  let sandbox;
  let stubFetch;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubFetch = sandbox.stub(global, 'fetch');
    localStorage.clear();
  });

  afterEach(() => {
    sandbox.restore();
    stubFetch.restore();
  });

  it('should should do nothing if there is not SSO session active', () => {
    expect(localStorage.getItem('sessionExpirationSSO')).to.be.null;
    checkAndUpdateSSOeSession();
    expect(localStorage.getItem('sessionExpirationSSO')).to.be.null;
  });

  it('should do nothing if the session expiration is above the timeout threshold', () => {
    const { ALIVE, TIMEOUT, TRANSACTIONID, AUTHN_CONTEXT } = AUTHN_HEADERS;
    stubFetch.resolves(
      generateMockKeepAliveResponse({
        headers: {
          [ALIVE]: 'true',
          [TIMEOUT]: '900',
          [TRANSACTIONID]: 'g',
          [AUTHN_CONTEXT]: '/loa1',
        },
        status: 200,
      }),
    );
    localStorage.setItem('hasSessionSSO', 'true');
    localStorage.setItem('sessionExpirationSSO', 'some value');

    checkAndUpdateSSOeSession();

    expect(localStorage.getItem('sessionExpirationSSO')).to.equal('some value');
  });

  it('should make a keepalive request for active SSO sessions below the timeout threshold', () => {
    const { ALIVE, TIMEOUT, TRANSACTIONID, AUTHN_CONTEXT } = AUTHN_HEADERS;
    stubFetch.resolves(
      generateMockKeepAliveResponse({
        headers: {
          [ALIVE]: 'true',
          [TIMEOUT]: '900',
          [TRANSACTIONID]: 'g',
          [AUTHN_CONTEXT]: '/loa1',
        },
        status: 200,
      }),
    );
    const expiringSession = new Date();
    expiringSession.setTime(Date.now() + 5000);
    localStorage.setItem('hasSessionSSO', 'true');
    localStorage.setItem('sessionExpirationSSO', expiringSession);

    checkAndUpdateSSOeSession();

    // The expiration should be different since it will get updated
    expect(localStorage.getItem('sessionExpirationSSO')).to.not.equal(
      expiringSession,
    );
  });

  afterEach(() => {
    localStorage.clear();
  });
});

describe('keepAlive', () => {
  let sandbox;
  let stubFetch;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubFetch = sandbox.stub(global, 'fetch');
  });

  afterEach(() => {
    sandbox.restore();
    stubFetch.restore();
  });

  it('should return an empty object on a type error', async () => {
    stubFetch.rejects(generateMockKeepAliveResponse());
    const KA_RESPONSE = await keepAliveMod.keepAlive();
    expect(KA_RESPONSE).to.eql({});
  });

  it('should return ttl 0 when not alive', async () => {
    const { ALIVE, TIMEOUT, TRANSACTIONID, CSP, CSP_METHOD } = AUTHN_HEADERS;
    stubFetch.resolves(
      generateMockKeepAliveResponse({
        headers: {
          [ALIVE]: 'false',
          [TIMEOUT]: 900,
          [TRANSACTIONID]: 'g',
          [CSP]: 'idme',
          [CSP_METHOD]: 'IDME_DSL',
        },
        status: 200,
      }),
    );
    const KA_RESPONSE = await keepAliveMod.keepAlive();
    expect(KA_RESPONSE.ttl).to.equal(0);
    expect(KA_RESPONSE.transactionid).to.be.oneOf([null, 'null']);
    expect(KA_RESPONSE.authn).to.equal('NOT_FOUND');
    expect(KA_RESPONSE[AUTHN_KEYS.CSP_TYPE]).to.equal('idme');
    expect(KA_RESPONSE[AUTHN_KEYS.CSP_METHOD]).to.equal('IDME_DSL');
  });

  it('should return active mhv session', async () => {
    const { ALIVE, CSP, TRANSACTION_ID, CSP_METHOD } = AUTHN_HEADERS;
    stubFetch.resolves(
      generateMockKeepAliveResponse({
        headers: {
          [ALIVE]: 'true',
          [TRANSACTION_ID]: 'q',
          [CSP]: 'mhv',
          [CSP_METHOD]: 'IDME_MHV',
        },
        status: 200,
      }),
    );
    const KA_RESPONSE = await keepAliveMod.keepAlive();

    expect(KA_RESPONSE).to.eql({
      ttl: 900,
      transactionid: 'q',
      authn: CSP_AUTHN.MHV,
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.MHV,
      [AUTHN_KEYS.CSP_METHOD]: 'IDME_MHV',
    });
  });

  it('should return active idme session', async () => {
    const {
      ALIVE,
      AUTHN_CONTEXT,
      CSP,
      CSP_METHOD,
      TIMEOUT,
      TRANSACTION_ID,
    } = AUTHN_HEADERS;

    stubFetch.resolves(
      generateMockKeepAliveResponse({
        headers: {
          [ALIVE]: 'true',
          [TIMEOUT]: 400,
          [TRANSACTION_ID]: 'IDME_WORKS',
          [CSP]: CSP_IDS.ID_ME,
          [AUTHN_CONTEXT]: '/loa1',
          [CSP_METHOD]: 'IDME_LOA1',
        },
        status: 200,
      }),
    );

    const KA_RESPONSE = await keepAliveMod.keepAlive();

    expect(KA_RESPONSE).to.eql({
      ttl: 400,
      transactionid: 'IDME_WORKS',
      authn: '/loa1',
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.IDME,
      [AUTHN_KEYS.CSP_METHOD]: 'IDME_LOA1',
    });
  });

  it('should return active logingov session', async () => {
    const {
      ALIVE,
      CSP,
      CSP_METHOD,
      TRANSACTION_ID,
      TIMEOUT,
      AUTHN_CONTEXT,
      IAL,
    } = AUTHN_HEADERS;

    const ial = '2';
    stubFetch.resolves(
      generateMockKeepAliveResponse({
        headers: {
          [ALIVE]: 'true',
          [TIMEOUT]: 100,
          [TRANSACTION_ID]: 'login_gov',
          [CSP]: 'LOGINGOV',
          [AUTHN_CONTEXT]: '/ial2',
          [IAL]: ial,
          [CSP_METHOD]: 'LGV_IAL2',
        },
        status: 200,
      }),
    );

    const KA_RESPONSE = await keepAliveMod.keepAlive();

    expect(KA_RESPONSE).to.eql({
      ttl: 100,
      transactionid: 'login_gov',
      [AUTHN_KEYS.CSP_TYPE]: CSP_KEYS.LOGINGOV.toLowerCase(),
      ial,
      [AUTHN_KEYS.CSP_METHOD]: 'LGV_IAL2',
    });
  });
});

describe('sanitizeAuthn', () => {
  let stubbedUrl;

  afterEach(() => {
    stubbedUrl = '';
  });

  it('should return a `NOT_FOUND` string when passed nothing', () => {
    expect(keepAliveMod.sanitizeAuthn('')).to.eql(undefined);
    expect(keepAliveMod.sanitizeAuthn(null)).to.eql(undefined);
    expect(keepAliveMod.sanitizeAuthn(undefined)).to.eql(undefined);
  });

  it('should strip out the `?skip_dupe` query param', () => {
    stubbedUrl = '/loa1?skip_dupe=true';
    expect(keepAliveMod.sanitizeAuthn(stubbedUrl)).to.eql('/loa1');
  });

  it('should strip out the `&skip_dupe` query param', () => {
    stubbedUrl = '/ial2?key=value&skip_dupe=true';
    expect(keepAliveMod.sanitizeAuthn(stubbedUrl)).to.eql('/ial2?key=value');
  });
});

describe('generateAuthnContext', () => {
  it('should return an empty object without headers', () => {
    expect(keepAliveMod.generateAuthnContext()).to.eql({});
  });

  it('should return a string for each csp', () => {
    [CSP_KEYS.MHV, CSP_KEYS.IDME, CSP_KEYS.LOGINGOV].forEach(csp => {
      const {
        ALIVE,
        CSP,
        CSP_METHOD,
        TRANSACTION_ID,
        TIMEOUT,
        AUTHN_CONTEXT,
        IAL,
      } = AUTHN_HEADERS;

      // mocked
      const ial = '2';

      const { headers } = generateMockKeepAliveResponse({
        headers: {
          [ALIVE]: 'true',
          [TIMEOUT]: 500,
          [TRANSACTION_ID]: `tx-${csp}`,
          [CSP]: csp,
          [CSP_METHOD]: `${csp}_auth_method`,
          [IAL]: ial,
          ...(csp === 'idme' && {
            [AUTHN_CONTEXT]: 'idme-test?skip_dupe=true',
          }),
        },
        status: 200,
      });

      expect(
        keepAliveMod.generateAuthnContext({
          headers,
        }),
      ).to.eql({
        [AUTHN_KEYS.CSP_TYPE]: csp.toLowerCase(),
        [AUTHN_KEYS.CSP_METHOD]: `${csp}_auth_method`,
        ...(csp !== CSP_KEYS.LOGINGOV
          ? {
              authn: {
                [CSP_KEYS.MHV]: CSP_AUTHN.MHV,
                [CSP_KEYS.IDME]: 'idme-test',
              }[csp],
            }
          : {
              [AUTHN_KEYS.IAL]: ial,
            }),
      });
    });
  });
});

describe('verifySession', () => {
  beforeEach(() => {
    fakeWindow();
  });
  afterEach(() => {
    global.window = oldWindow;
    localStorage.clear();
  });
  it('should return true when conditions', () => {
    global.window.location.host = `dev.va.gov`;
    localStorage.setItem('hasSessionSSO', true);
    localStorage.setItem('loginAttempted', true);
    localStorage.setItem('sessionExpirationSSO', new Date());
    expect(verifySession()).to.eql(true);
  });
  it('should return false when conditions not met', () => {
    localStorage.setItem('hasSessionSSO', false);
    localStorage.setItem('loginAttempted', true);
    expect(verifySession()).to.eql(false);
    localStorage.clear();
    expect(verifySession()).to.eql(false);
  });
  it('should return false if the pathname is terms-of-use', () => {
    const startingLocation = new URL('http://localhost/terms-of-use/');
    if (Window.prototype.href) {
      global.window.location.href = startingLocation;
    } else {
      global.window.location = startingLocation;
    }
    localStorage.setItem('hasSessionSSO', true);
    localStorage.setItem('loginAttempted', true);
    localStorage.setItem('sessionExpirationSSO', new Date());
    expect(verifySession()).to.eql(false);
  });
});
