import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import api from '../../../utilities/api';

describe('API utilities', () => {
  let sandbox;
  let fetchStub;
  let sentryCaptureMessageStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fetchStub = sandbox.stub(global, 'fetch');
    sentryCaptureMessageStub = sandbox.stub(Sentry, 'captureMessage');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Error handling', () => {
    it('does not log Response objects to Sentry', async () => {
      const errorResponse = new Response(
        JSON.stringify({
          errors: ['User is not authorized to access this resource'],
          status: 'FORBIDDEN',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      fetchStub.resolves(errorResponse);

      try {
        await api.getPOARequest('123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Response);
        expect(sentryCaptureMessageStub.called).to.be.false;
      }
    });

    it('logs network errors to Sentry', async () => {
      const networkError = new TypeError('Failed to fetch');
      fetchStub.rejects(networkError);

      try {
        await api.getPOARequest('123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError);
        expect(sentryCaptureMessageStub.called).to.be.true;
        expect(sentryCaptureMessageStub.firstCall.args[0]).to.equal(
          'vets_client_error: Failed to fetch',
        );
      }
    });
  });

  describe('getPOARequests', () => {
    it('builds correct URL with query params', async () => {
      const successResponse = new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      fetchStub.resolves(successResponse);

      await api.getPOARequests({ status: 'pending', sort: 'created_at_desc' });

      expect(fetchStub.called).to.be.true;
      const url = fetchStub.firstCall.args[0];
      expect(url).to.include(
        '/power_of_attorney_requests?status=pending&sort=created_at_desc',
      );
    });
  });

  describe('getPOARequest', () => {
    it('builds correct URL with ID', async () => {
      const successResponse = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      fetchStub.resolves(successResponse);

      await api.getPOARequest('123');

      expect(fetchStub.called).to.be.true;
      const url = fetchStub.firstCall.args[0];
      expect(url).to.include('/power_of_attorney_requests/123');
    });

    it('preserves 401 unauthorized responses', async () => {
      const errorResponse = new Response(
        JSON.stringify({
          errors: ['Access token JWT is malformed'],
          status: 'UNAUTHORIZED',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      fetchStub.resolves(errorResponse);

      try {
        await api.getPOARequest('123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Response);
        expect(error.status).to.equal(401);
        const errorData = await error.json();
        expect(errorData.errors).to.deep.equal([
          'Access token JWT is malformed',
        ]);
        expect(errorData.status).to.equal('UNAUTHORIZED');
      }
    });

    it('preserves 403 forbidden responses', async () => {
      const errorResponse = new Response(
        JSON.stringify({
          errors: ['User is not authorized to access this resource'],
          status: 'FORBIDDEN',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      fetchStub.resolves(errorResponse);

      try {
        await api.getPOARequest('123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Response);
        expect(error.status).to.equal(403);
        const errorData = await error.json();
        expect(errorData.errors).to.deep.equal([
          'User is not authorized to access this resource',
        ]);
        expect(errorData.status).to.equal('FORBIDDEN');
      }
    });

    it('preserves 404 not found responses', async () => {
      const errorResponse = new Response(
        JSON.stringify({
          errors: ['Power of attorney request not found'],
          status: 'NOT_FOUND',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      fetchStub.resolves(errorResponse);

      try {
        await api.getPOARequest('123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Response);
        expect(error.status).to.equal(404);
        const errorData = await error.json();
        expect(errorData.errors).to.deep.equal([
          'Power of attorney request not found',
        ]);
        expect(errorData.status).to.equal('NOT_FOUND');
      }
    });

    it('preserves 500 server error responses', async () => {
      const errorResponse = new Response(
        JSON.stringify({
          errors: ['An internal server error occurred'],
          status: 'SERVER_ERROR',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      fetchStub.resolves(errorResponse);

      try {
        await api.getPOARequest('123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Response);
        expect(error.status).to.equal(500);
        const errorData = await error.json();
        expect(errorData.errors).to.deep.equal([
          'An internal server error occurred',
        ]);
        expect(errorData.status).to.equal('SERVER_ERROR');
      }
    });

    it('handles network errors', async () => {
      const networkError = new TypeError('Failed to fetch');
      fetchStub.rejects(networkError);

      try {
        await api.getPOARequest('123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError);
        expect(error.message).to.equal('Failed to fetch');
      }
    });
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
  });

  describe('createPOARequestDecision', () => {
    it('sends POST with correct decision payload', async () => {
      const successResponse = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      fetchStub.resolves(successResponse);

      const decision = { type: 'acceptance' };
      await api.createPOARequestDecision('123', decision);

      expect(fetchStub.called).to.be.true;
      const url = fetchStub.firstCall.args[0];
      const options = fetchStub.firstCall.args[1];

      expect(url).to.include('/power_of_attorney_requests/123/decision');
      expect(options.method).to.equal('POST');
      expect(JSON.parse(options.body)).to.deep.equal({ decision });
    });
  });
});
