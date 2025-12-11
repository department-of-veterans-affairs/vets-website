import { expect } from 'chai';
import sinon from 'sinon';
import * as sessionUtil from 'platform/utilities/api';
import localStorage from 'platform/utilities/storage/localStorage';
import * as Sentry from '@sentry/browser';
import * as constantsModule from '../../../utilities/constants';
import * as apiModule from '../../../utilities/api';
import manifest from '../../../manifest.json';

describe('wrapApiRequest', () => {
  let fetchStub;
  let csrfGetItemStub;
  let csrfSetItemStub;
  let locationStub;

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
    fetchStub = sinon.stub(sessionUtil, 'fetchAndUpdateSessionExpiration');
    csrfGetItemStub = sinon.stub(localStorage, 'getItem').returns('old-token');
    csrfSetItemStub = sinon.stub(localStorage, 'setItem');
  });

  afterEach(() => {
    fetchStub.restore();
    csrfGetItemStub.restore();
    csrfSetItemStub.restore();
    if (locationStub) {
      locationStub.restore();
      locationStub = null;
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

    locationStub = sinon.stub(window, 'location').value({
      pathname: '/some-other-path',
      href: 'http://example.com/current-page',
    });

    await apiModule.default.getUser();

    expect(getSignInUrlStub.calledOnce).to.be.true;
    expect(window.location).to.equal('https://fake-login-url');

    getSignInUrlStub.restore();
  });

  it('redirects to login when pathname is missing', async () => {
    const fakeResponse = createMockResponse(401);
    fetchStub.resolves(fakeResponse);

    const getSignInUrlStub = sinon
      .stub(constantsModule, 'getSignInUrl')
      .returns('https://fake-login-url');

    locationStub = sinon.stub(window, 'location').value({
      pathname: undefined,
      href: 'http://example.com/current-page',
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

    const getSignInUrlStub = sinon.stub(constantsModule, 'getSignInUrl');

    locationStub = sinon.stub(window, 'location').value({
      pathname: manifest.rootUrl,
      href: 'http://example.com/',
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
