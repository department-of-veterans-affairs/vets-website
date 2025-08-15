import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import api from '../../../utilities/api';

describe('API utilities', () => {
  let sandbox;
  let fetchStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fetchStub = sandbox.stub(global, 'fetch');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getUser', () => {
    it('calls correct user endpoint', async () => {
      const successResponse = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      fetchStub.resolves(successResponse);

      await api.getUser();

      expect(fetchStub.called).to.be.true;
      const url = fetchStub.firstCall.args[0];
      expect(url).to.include('/user');
    });

    it('returns response when status is 304', async () => {
      const response = new Response(null, { status: 304 });
      fetchStub.resolves(response);

      const result = await api.getUser();
      expect(result.status).to.equal(304);
    });

    it('redirects on 401 when not on root path', async () => {
      const response = new Response(null, { status: 401 });
      fetchStub.resolves(response);

      const getSignInUrlStub = sandbox.stub().returns('https://fake-login-url');
      const originalLocation = window.location;

      global.window = Object.create(window);
      window.location = {
        pathname: '/not-root',
        href: 'https://current-page',
      };

      const constants = await import('../../../utilities/constants');
      const old = constants.getSignInUrl;
      constants.getSignInUrl = getSignInUrlStub;

      const result = await api.getUser();
      expect(result).to.be.null;
      expect(getSignInUrlStub.called).to.be.true;

      constants.getSignInUrl = old;
      window.location = originalLocation;
    });

    it('returns null on 401 when on root path', async () => {
      const response = new Response(null, { status: 401 });
      fetchStub.resolves(response);

      global.window = Object.create(window);
      window.location = {
        pathname: '/accredited-representative', // manifest.rootUrl
        href: 'https://current-page',
      };

      const result = await api.getUser();
      expect(result).to.equal(null);
    });

    it('logs to Sentry on network error', async () => {
      const captureStub = sandbox.stub(Sentry, 'captureMessage');

      fetchStub.rejects(new TypeError('Network failed'));

      try {
        await api.getUser();
      } catch (err) {
        expect(captureStub.calledOnce).to.be.true;
      }
    });
  });
});
