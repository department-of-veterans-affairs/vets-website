import { expect } from 'chai';
import { renderHook, act } from '@testing-library/react-hooks';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import { useTokenRefreshOnLoad } from './use-token-refresh-on-load';

describe('useTokenRefreshOnLoad', () => {
  let refreshStub;
  let infoTokenExistsStub;
  let sessionStorageStub;
  let consoleErrorStub;
  let sentryStub;
  let oauthUtilities;
  let originalSessionStorage;

  beforeEach(() => {
    oauthUtilities = require('platform/utilities/oauth/utilities');
    refreshStub = sinon.stub(oauthUtilities, 'refresh').resolves();
    infoTokenExistsStub = sinon.stub(oauthUtilities, 'infoTokenExists');

    // Save and mock sessionStorage properly
    originalSessionStorage = global.sessionStorage;
    global.sessionStorage = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub(),
      clear: sinon.stub(),
    };
    sessionStorageStub = global.sessionStorage.getItem;

    consoleErrorStub = sinon.stub(console, 'error');
    sentryStub = sinon.stub(Sentry, 'captureMessage');
    sinon.stub(Sentry, 'withScope').callsFake(callback => {
      const scope = {
        setExtra: sinon.stub(),
        setFingerprint: sinon.stub(),
      };
      callback(scope);
    });
  });

  afterEach(() => {
    refreshStub.restore();
    infoTokenExistsStub.restore();
    global.sessionStorage = originalSessionStorage;
    consoleErrorStub.restore();
    sentryStub.restore();
    Sentry.withScope.restore();
  });

  it('should refresh token when on loading page with valid OAuth session', async () => {
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns('idme');

    const location = { pathname: '/form/loading' };

    renderHook(() => useTokenRefreshOnLoad(location));

    // Wait for async effect
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(refreshStub.calledOnce).to.be.true;
    expect(refreshStub.calledWith({ type: 'idme' })).to.be.true;
  });

  it('should refresh token with logingov service type', async () => {
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns('logingov');

    const location = { pathname: '/application/loading' };

    renderHook(() => useTokenRefreshOnLoad(location));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(refreshStub.calledOnce).to.be.true;
    expect(refreshStub.calledWith({ type: 'logingov' })).to.be.true;
  });

  it('should not refresh token when not on loading page', async () => {
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns('idme');

    const location = { pathname: '/form/review-and-submit' };

    renderHook(() => useTokenRefreshOnLoad(location));

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(refreshStub.called).to.be.false;
  });

  it('should not refresh token when info token does not exist', async () => {
    infoTokenExistsStub.returns(false);
    sessionStorageStub.withArgs('serviceName').returns('idme');

    const location = { pathname: '/form/loading' };

    renderHook(() => useTokenRefreshOnLoad(location));

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(refreshStub.called).to.be.false;
  });

  it('should not refresh token when serviceName is not in sessionStorage', async () => {
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns(null);

    const location = { pathname: '/form/loading' };

    renderHook(() => useTokenRefreshOnLoad(location));

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(refreshStub.called).to.be.false;
  });

  it('should handle null location gracefully', async () => {
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns('idme');

    renderHook(() => useTokenRefreshOnLoad(null));

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(refreshStub.called).to.be.false;
  });

  it('should handle location without pathname', async () => {
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns('idme');

    const location = {};

    renderHook(() => useTokenRefreshOnLoad(location));

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(refreshStub.called).to.be.false;
  });

  it('should log error and send to Sentry when token refresh fails', async () => {
    const testError = new Error('Token refresh failed');
    refreshStub.rejects(testError);
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns('idme');

    const location = { pathname: '/form/loading' };

    renderHook(() => useTokenRefreshOnLoad(location));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(refreshStub.calledOnce).to.be.true;
    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(
      consoleErrorStub.calledWith(
        'Failed to refresh OAuth token on form load:',
        testError,
      ),
    ).to.be.true;
    expect(sentryStub.calledOnce).to.be.true;
    expect(Sentry.withScope.calledOnce).to.be.true;
  });

  it('should re-run effect when location changes', async () => {
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns('idme');

    const { rerender } = renderHook(({ loc }) => useTokenRefreshOnLoad(loc), {
      initialProps: { loc: { pathname: '/form/step1' } },
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(refreshStub.called).to.be.false;

    // Change to loading page
    await act(async () => {
      rerender({ loc: { pathname: '/form/loading' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(refreshStub.calledOnce).to.be.true;
  });

  it('should handle pathname with "loading" in middle of path', async () => {
    infoTokenExistsStub.returns(true);
    sessionStorageStub.withArgs('serviceName').returns('idme');

    const location = { pathname: '/some/loading/path' };

    renderHook(() => useTokenRefreshOnLoad(location));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(refreshStub.calledOnce).to.be.true;
  });
});
