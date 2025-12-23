/* eslint-disable no-unused-vars */
import { expect } from 'chai';
import sinon from 'sinon';
import * as sessionUtil from 'platform/utilities/api';
import localStorage from 'platform/utilities/storage/localStorage';
import * as Sentry from '@sentry/browser';
import * as constantsModule from '../../../utilities/constants';
import * as apiModule from '../../../utilities/api';
import manifest from '../../../manifest.json';

describe('wrapApiRequest', () => {
  const sandbox = sinon.createSandbox();
  let fetchStub;
  let csrfGetItemStub;
  let csrfSetItemStub;
  let originalWindow;

  // Helper to create mock response with headers.get()
  function createMockResponse(status = 200, headersObj = {}) {
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: {
        get: key => headersObj[key] || null,
      },
      json: async () => ({}),
    };
  }

  beforeEach(() => {
    originalWindow = global.window;

    // Clear any lingering stubs from other tests to avoid double-wrapping errors.
    sandbox.restore();
    if (constantsModule.getSignInUrl?.restore) {
      constantsModule.getSignInUrl.restore();
    }

    fetchStub = sandbox.stub(sessionUtil, 'fetchAndUpdateSessionExpiration');
    csrfGetItemStub = sandbox
      .stub(localStorage, 'getItem')
      .returns('old-token');
    csrfSetItemStub = sandbox.stub(localStorage, 'setItem');
  });

  afterEach(() => {
    sandbox.restore();
    // Restore original window to avoid read-only location assignment errors in jsdom
    if (originalWindow) {
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        configurable: true,
        writable: true,
      });
    }
  });

  it('returns response on success', async () => {
    const fakeResponse = createMockResponse(200);
    fetchStub.resolves(fakeResponse);

    const response = await apiModule.default.getUser();
    expect(response).to.equal(fakeResponse);
  });

  it('does not update CSRF token if not present', async () => {
    const fakeResponse = createMockResponse(200);

    fetchStub.resolves(fakeResponse);

    await apiModule.default.getUser();

    expect(csrfSetItemStub.called).to.be.false;
  });

  it.skip('redirects to login if 401 is returned and pathname is not root', async () => {
    // skipping to support node 22 upgrade, window.location assigning not supported
    // may want to stub differently and test for rendered content

    const fakeResponse = createMockResponse(401);

    fetchStub.resolves(fakeResponse);

    const getSignInUrlStub = sinon
      .stub(constantsModule, 'getSignInUrl')
      .returns('https://fake-login-url');

    Object.defineProperty(global, 'window', {
      value: {
        ...originalWindow,
        location: {
          pathname: '/some-other-path',
          href: 'http://example.com/current-page',
        },
        appName: originalWindow?.appName,
      },
      configurable: true,
      writable: true,
    });

    await apiModule.default.getUser();

    expect(getSignInUrlStub.calledOnce).to.be.true;
    expect(window.location).to.equal('https://fake-login-url');

    getSignInUrlStub.restore();
  });

  it('redirects to login when pathname is missing', async () => {
    const fakeResponse = createMockResponse(401);
    fetchStub.resolves(fakeResponse);

    const getSignInUrlStub = sandbox
      .stub(constantsModule, 'getSignInUrl')
      .returns('https://fake-login-url');

    Object.defineProperty(global, 'window', {
      value: {
        ...originalWindow,
        location: {
          pathname: undefined,
          href: 'http://example.com/current-page',
        },
        appName: originalWindow?.appName,
      },
      configurable: true,
      writable: true,
    });

    const result = await apiModule.default.getUser();

    expect(result).to.be.null;
    expect(getSignInUrlStub.calledOnce).to.be.true;
    expect(window.location).to.equal('https://fake-login-url');

    getSignInUrlStub.restore();
  });

  it('does not redirect to login if pathname is root', async () => {
    const fakeResponse = createMockResponse(401);

    fetchStub.resolves(fakeResponse);

    const getSignInUrlStub = sandbox.stub(constantsModule, 'getSignInUrl');

    Object.defineProperty(global, 'window', {
      value: {
        ...originalWindow,
        location: { pathname: manifest.rootUrl, href: 'http://example.com/' },
        appName: originalWindow?.appName,
      },
      configurable: true,
      writable: true,
    });

    try {
      await apiModule.default.getUser();
      throw new Error('Should have thrown');
    } catch (err) {
      expect(err).to.equal(fakeResponse);
      expect(getSignInUrlStub.called).to.be.false;
    }

    getSignInUrlStub.restore();
  });

  it('throws response for other errors', async () => {
    const fakeResponse = createMockResponse(500);

    fetchStub.resolves(fakeResponse);

    try {
      await apiModule.default.getUser();
      throw new Error('Should have thrown');
    } catch (err) {
      expect(err).to.equal(fakeResponse);
    }
  });

  it('logs to Sentry for network errors', async () => {
    const captureMessageStub = sinon.stub(Sentry, 'captureMessage');
    const withScopeStub = sinon.stub(Sentry, 'withScope').callsFake(cb => {
      cb({
        setExtra: () => {},
        setFingerprint: () => {},
        _tags: { source: 'test' },
      });
    });

    fetchStub.rejects(new Error('Network error'));

    try {
      await apiModule.default.getUser();
    } catch (err) {
      expect(captureMessageStub.calledOnce).to.be.true;
    }

    captureMessageStub.restore();
    withScopeStub.restore();
  });
});
