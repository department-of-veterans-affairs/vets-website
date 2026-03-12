/* eslint-disable camelcase */
import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import { server, rest } from 'platform/testing/unit/mocha-setup';
import sinon from 'sinon';
import {
  createGetHandler,
  createPostHandler,
  createDeleteHandler,
  jsonResponse,
  binaryResponse,
} from 'platform/testing/unit/msw-adapter';
import { apiRequest, fetchAndUpdateSessionExpiration } from '../../api';
import environment from '../../environment';
import * as ssoModule from '../../sso';
import * as oauthModule from '../../oauth/utilities';

describe('test wrapper', () => {
  describe('apiRequest', () => {
    const mockEnv = {
      ...environment,
      isProduction: sinon.stub().returns(true),
    };

    afterEach(() => {
      server.resetHandlers();
      sessionStorage.removeItem('shouldRedirectExpiredSession');
    });

    it('should behave as if in production', async () => {
      server.use(
        createGetHandler('*', () =>
          jsonResponse({ status: 'ok' }, { status: 200 }),
        ),
      );
      await apiRequest('/status', {}, null, null, mockEnv);
      expect(mockEnv.isProduction.called).to.be.true;
    });

    it('should redirect to LoginModal if in production and session expired (401)', async () => {
      server.use(
        createGetHandler('*', () =>
          jsonResponse(
            { errors: [{ status: '401', title: 'Unauthorized' }] },
            { status: 401 },
          ),
        ),
      );

      sessionStorage.setItem('shouldRedirectExpiredSession', 'true');

      window.location.href = 'http://localhost/some-other-page';

      try {
        await apiRequest(
          '/status',
          { headers: { 'Content-Type': 'application/json' } },
          null,
          null,
          mockEnv,
        );
      } catch (error) {
        expect(mockEnv.isProduction.called).to.be.true;
        // After window.location = string, window.location becomes a string in happy-dom
        expect(window.location).to.eql(
          '/?next=loginModal&status=session_expired',
        );
      }
    });

    it('should NOT redirect if not in production, even if session expired (401)', async () => {
      const nonProdEnv = {
        ...environment,
        isProduction: sinon.stub().returns(false),
      };

      server.use(
        createGetHandler('*', () =>
          jsonResponse(
            { errors: [{ status: '401', title: 'Unauthorized' }] },
            { status: 401 },
          ),
        ),
      );

      sessionStorage.setItem('shouldRedirectExpiredSession', 'true');

      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/some-other-page',
          assign: sinon.stub(),
        },
        writable: true,
      });

      try {
        await apiRequest(
          '/status',
          { headers: { 'Content-Type': 'application/json' } },
          null,
          null,
          nonProdEnv,
        );
      } catch (error) {
        // Verify there is no redirect outside of production
        expect(nonProdEnv.isProduction.called).to.be.true;
        expect(window.location.assign.called).to.be.false;
      }
    });

    it('should not redirect to /session-expired if on /declined page (status: 401)', async () => {
      server.use(
        createGetHandler('*', () =>
          jsonResponse(
            { errors: [{ status: '401', title: 'Unauthorized' }] },
            { status: 401 },
          ),
        ),
      );

      sessionStorage.setItem('shouldRedirectExpiredSession', 'true');

      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/terms-of-use/declined',
          assign: sinon.stub(),
        },
        writable: true,
      });

      try {
        await apiRequest('/status', {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        expect(window.location.assign.called).to.be.false;
      }
    });

    it('should not redirect if shouldRedirectExpiredSession is not set (status: 401)', async () => {
      server.use(
        createGetHandler('*', () =>
          jsonResponse(
            { errors: [{ status: '401', title: 'Unauthorized' }] },
            { status: 401 },
          ),
        ),
      );

      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/some-other-page',
          assign: sinon.stub(),
        },
        writable: true,
      });

      try {
        await apiRequest('/status', {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        expect(window.location.assign.called).to.be.false;
      }
    });

    it('should return JSON when appropriate headers are specified on (status: 200)', async () => {
      const expectedJsonResponse = { status: 'ok' };
      server.use(
        createGetHandler(/v0\/status/, () =>
          jsonResponse(expectedJsonResponse, { status: 200 }),
        ),
      );

      const response = await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      expect(response.status).to.eql('ok');
    });

    it('should not return JSON on (status: 204)', async () => {
      server.use(
        createGetHandler(/v0\/status/, () =>
          jsonResponse(null, { status: 204 }),
        ),
      );

      const response = await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      expect(response.ok).to.eql(true);
      expect(response.status).to.eql(204);
    });

    it('should not return JSON on (status: 404)', async () => {
      const errorResponse = { errors: [{ status: '404', title: 'Not found' }] };
      server.use(
        rest.get('*', (req, res, ctx) =>
          res(ctx.status(404), ctx.json(errorResponse)),
        ),
      );

      await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      }).catch(error => {
        expect(error).to.deep.equal(errorResponse);
      });
    });

    it('should return JSON on (status: 403)', async () => {
      const errorResponse = { errors: [{ status: '403', title: 'Forbidden' }] };
      server.use(
        rest.get('*', (req, res, ctx) =>
          res(ctx.status(403), ctx.json(errorResponse)),
        ),
      );

      await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      }).catch(error => {
        expect(error).to.deep.equal(errorResponse);
      });
    });

    it('should not impact empty JSON with (status: 202) No Content', async () => {
      server.use(
        createDeleteHandler(
          `https://dev-api.va.gov/my_health/v1/messaging/messages/1`,
          () => jsonResponse(null, { status: 202 }),
        ),
      );

      const response = await apiRequest(
        'https://dev-api.va.gov/my_health/v1/messaging/messages/1',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(response.ok).to.eql(true);
      expect(response.status).to.eql(202);
    });

    it('should not fail when downloading a file', async () => {
      const benefitLetterOptions = {
        letterName: 'Benefit Summary Letter',
        letterType: 'benefit_summary',
        letterOptions: {
          militaryService: true,
          monthlyAward: true,
          serviceConnectedEvaluation: true,
          chapter35Eligibility: true,
          serviceConnectedDisabilities: true,
        },
      };

      server.use(
        createPostHandler(
          `https://dev-api.va.gov/v0/letters/benefit_summary`,
          () => {
            const pdfFile = fs.readFileSync(
              path.resolve(__dirname, './pdfFixture.pdf'),
            );

            return binaryResponse(pdfFile, {
              status: 200,
              headers: {
                'Content-Length': pdfFile.byteLength.toString(),
                'Content-Type': 'application/pdf',
              },
            });
          },
        ),
      );

      const response = await apiRequest('/letters/benefit_summary', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(benefitLetterOptions),
      });

      expect(response.bodyUsed).to.be.false;
      expect(response.status).to.eql(200);
    });
  });

  describe('fetchAndUpdateSessionExpiration', () => {
    let checkAndUpdateSSOSessionMock;
    let checkOrSetSessionExpirationMock;
    let infoTokenExistsMock;
    let refreshIfAccessTokenExpiringSoonMock;

    beforeEach(() => {
      checkAndUpdateSSOSessionMock = sinon.stub(
        ssoModule,
        'checkAndUpdateSSOeSession',
      );
      checkOrSetSessionExpirationMock = sinon.stub(
        oauthModule,
        'checkOrSetSessionExpiration',
      );
      infoTokenExistsMock = sinon
        .stub(oauthModule, 'infoTokenExists')
        .returns(false);
      refreshIfAccessTokenExpiringSoonMock = sinon
        .stub(oauthModule, 'refreshIfAccessTokenExpiringSoon')
        .resolves(false);

      sessionStorage.setItem('serviceName', 'logingov');

      delete window.Mocha;

      server.use(
        rest.get(environment.API_URL, (req, res, ctx) =>
          res(ctx.status(200), ctx.json({ ok: true })),
        ),
      );
    });

    afterEach(() => {
      server.resetHandlers();
      checkOrSetSessionExpirationMock.restore();
      checkAndUpdateSSOSessionMock.restore();
      infoTokenExistsMock.restore();
      refreshIfAccessTokenExpiringSoonMock.restore();

      sessionStorage.removeItem('serviceName');

      delete window.Mocha;
    });

    it('calls checkOrSetSessionExpiration and checkAndUpdateSSOSession if the hasSessionSSO flag is set', async () => {
      server.use(
        createGetHandler(environment.API_URL, () =>
          jsonResponse({}, { status: 200 }),
        ),
      );
      localStorage.setItem('hasSessionSSO', 'true');
      await fetchAndUpdateSessionExpiration(environment.API_URL, {});
      expect(checkOrSetSessionExpirationMock.callCount).to.equal(1);
      expect(checkAndUpdateSSOSessionMock.callCount).to.equal(1);
    });

    it('does not call checkAndUpdateSSOSession if the hasSessionSSO flag is not set', async () => {
      server.use(
        createGetHandler(environment.API_URL, () =>
          jsonResponse({}, { status: 500 }),
        ),
      );
      await fetchAndUpdateSessionExpiration(environment.API_URL, {});
      expect(checkAndUpdateSSOSessionMock.callCount).to.equal(0);
      checkAndUpdateSSOSessionMock.restore();
    });

    it('does not call checkOrSetSessionExpiration and checkAndUpdateSSOSession if the url does not include the API url', async () => {
      server.use(
        rest.get('*', (req, res, ctx) => res(ctx.status(404), ctx.json({}))),
      );
      await fetchAndUpdateSessionExpiration(environment.BASE_URL, {});
      expect(checkOrSetSessionExpirationMock.callCount).to.equal(0);
      expect(checkAndUpdateSSOSessionMock.callCount).to.equal(0);
    });

    it('proactively attempts refresh before fetch when info token exists and serviceName is set', async () => {
      const callOrder = [];

      infoTokenExistsMock.restore();
      infoTokenExistsMock = sinon
        .stub(oauthModule, 'infoTokenExists')
        .callsFake(() => {
          callOrder.push('infoTokenExists');
          return true;
        });

      refreshIfAccessTokenExpiringSoonMock.restore();
      refreshIfAccessTokenExpiringSoonMock = sinon
        .stub(oauthModule, 'refreshIfAccessTokenExpiringSoon')
        .callsFake(async () => {
          callOrder.push('refreshIfAccessTokenExpiringSoon');
          return true;
        });

      server.use(
        rest.get(environment.API_URL, (req, res, ctx) => {
          callOrder.push('fetch');
          return res(ctx.status(200), ctx.json({ ok: true }));
        }),
      );

      await fetchAndUpdateSessionExpiration(environment.API_URL, {});

      expect(callOrder).to.eql([
        'infoTokenExists',
        'refreshIfAccessTokenExpiringSoon',
        'fetch',
      ]);
      expect(refreshIfAccessTokenExpiringSoonMock.calledOnce).to.be.true;
      expect(
        refreshIfAccessTokenExpiringSoonMock.firstCall.args[0],
      ).to.deep.include({
        thresholdSeconds: 30,
        type: 'logingov',
      });
    });

    it('does not proactively refresh when info token does not exist', async () => {
      infoTokenExistsMock.returns(false);

      await fetchAndUpdateSessionExpiration(environment.API_URL, {});

      expect(refreshIfAccessTokenExpiringSoonMock.called).to.be.false;
    });

    it('does not proactively refresh when serviceName is missing', async () => {
      infoTokenExistsMock.returns(true);
      sessionStorage.removeItem('serviceName');

      await fetchAndUpdateSessionExpiration(environment.API_URL, {});

      expect(refreshIfAccessTokenExpiringSoonMock.called).to.be.false;
    });

    it('does not proactively refresh when window.Mocha is set', async () => {
      infoTokenExistsMock.returns(true);
      window.Mocha = true;

      await fetchAndUpdateSessionExpiration(environment.API_URL, {});

      expect(refreshIfAccessTokenExpiringSoonMock.called).to.be.false;
    });
  });

  describe('proactive token refresh', () => {
    let infoTokenExistsStub;
    let getInfoTokenStub;
    let refreshStub;
    let dateNowStub;

    beforeEach(() => {
      // Mock Date.now() instead of using fake timers
      dateNowStub = sinon
        .stub(Date, 'now')
        .returns(new Date('2025-01-01T12:00:00Z').getTime());
      infoTokenExistsStub = sinon.stub(oauthModule, 'infoTokenExists');
      getInfoTokenStub = sinon.stub(oauthModule, 'getInfoToken');
      refreshStub = sinon.stub(oauthModule, 'refresh').resolves();
      sessionStorage.setItem('serviceName', 'idme');
    });

    afterEach(() => {
      dateNowStub.restore();
      infoTokenExistsStub.restore();
      getInfoTokenStub.restore();
      refreshStub.restore();
      sessionStorage.removeItem('serviceName');
      server.resetHandlers();
    });

    it('should proactively refresh token when expiring within 30 seconds', async () => {
      // Token expires in 25 seconds
      const expirationTime = new Date('2025-01-01T12:00:25Z');
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        access_token_expiration: expirationTime,
        refresh_token_expiration: new Date('2025-01-01T12:30:00Z'),
      });

      server.use(
        createGetHandler(/v0\/status/, () =>
          jsonResponse({ status: 'ok' }, { status: 200 }),
        ),
      );

      // Temporarily unset window.Mocha to allow retryOn to be used
      const originalMocha = window.Mocha;
      window.Mocha = false;

      await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      // Restore window.Mocha
      window.Mocha = originalMocha;

      expect(refreshStub.calledOnce).to.be.true;
      expect(refreshStub.calledWith({ type: 'idme' })).to.be.true;
    });

    it('should not refresh token when not close to expiring', async () => {
      // Token expires in 5 minutes
      const expirationTime = new Date('2025-01-01T12:05:00Z');
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        access_token_expiration: expirationTime,
        refresh_token_expiration: new Date('2025-01-01T12:30:00Z'),
      });

      server.use(
        createGetHandler(/v0\/status/, () =>
          jsonResponse({ status: 'ok' }, { status: 200 }),
        ),
      );

      await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      expect(refreshStub.called).to.be.false;
    });

    it('should not refresh when info token does not exist', async () => {
      infoTokenExistsStub.returns(false);

      server.use(
        createGetHandler(/v0\/status/, () =>
          jsonResponse({ status: 'ok' }, { status: 200 }),
        ),
      );

      await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      expect(refreshStub.called).to.be.false;
    });

    it('should still handle reactive 403 refresh as fallback', async () => {
      // Token not close to expiring
      const expirationTime = new Date('2025-01-01T12:05:00Z');
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        access_token_expiration: expirationTime,
        refresh_token_expiration: new Date('2025-01-01T12:30:00Z'),
      });

      let callCount = 0;
      server.use(
        createGetHandler(/v0\/status/, () => {
          callCount += 1;
          if (callCount === 1) {
            // First call returns 403
            return jsonResponse(
              { errors: 'Access token has expired' },
              { status: 403 },
            );
          }
          // Second call (after refresh) returns success
          return jsonResponse({ status: 'ok' }, { status: 200 });
        }),
      );

      // Temporarily unset window.Mocha to allow retryOn to be used
      const originalMocha = window.Mocha;
      window.Mocha = false;

      const response = await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      // Restore window.Mocha
      window.Mocha = originalMocha;

      expect(refreshStub.calledOnce).to.be.true;
      expect(response.status).to.eql('ok');
    });

    it('should refresh proactively even if token already expired', async () => {
      // Token expired 5 seconds ago
      const expirationTime = new Date('2025-01-01T11:59:55Z');
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        access_token_expiration: expirationTime,
        refresh_token_expiration: new Date('2025-01-01T12:30:00Z'),
      });

      server.use(
        createGetHandler(/v0\/status/, () =>
          jsonResponse({ status: 'ok' }, { status: 200 }),
        ),
      );

      // Temporarily unset window.Mocha to allow retryOn to be used
      const originalMocha = window.Mocha;
      window.Mocha = false;

      await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      // Restore window.Mocha
      window.Mocha = originalMocha;

      expect(refreshStub.calledOnce).to.be.true;
    });

    it('should not refresh if serviceName is missing', async () => {
      // Token expires in 25 seconds but no serviceName
      const expirationTime = new Date('2025-01-01T12:00:25Z');
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        access_token_expiration: expirationTime,
        refresh_token_expiration: new Date('2025-01-01T12:30:00Z'),
      });
      sessionStorage.removeItem('serviceName');

      server.use(
        createGetHandler(/v0\/status/, () =>
          jsonResponse({ status: 'ok' }, { status: 200 }),
        ),
      );

      await apiRequest('/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      expect(refreshStub.called).to.be.false;
    });
  });
});
