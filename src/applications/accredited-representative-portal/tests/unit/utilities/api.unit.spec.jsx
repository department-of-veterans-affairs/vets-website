import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import localStorage from 'platform/utilities/storage/localStorage';
import * as sessionApi from 'platform/utilities/api';
import { SORT_DEFAULTS } from '../../../utilities/constants';
import api from '../../../utilities/api';
import manifest from '../../../manifest.json';

describe('API utilities', () => {
  let sandbox;
  let sentryCaptureMessageStub;
  let getItemStub;
  let sessionStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sentryCaptureMessageStub = sandbox.stub(Sentry, 'captureMessage');
    getItemStub = sandbox.stub(localStorage, 'getItem');
    sessionStub = sandbox.stub(sessionApi, 'fetchAndUpdateSessionExpiration');

    sandbox.stub(window, 'location').value({
      pathname: '/something-else',
      href: 'http://example.com/path',
      assign: sinon.stub(),
    });

    getItemStub.withArgs('csrfToken').returns('existingToken');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Error handling', () => {
    it('does not log Response objects to Sentry', async () => {
      const errorResponse = new Response(
        JSON.stringify({ errors: ['Forbidden'], status: 'FORBIDDEN' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      );
      sessionStub.resolves(errorResponse);

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
      sessionStub.rejects(networkError);

      try {
        await api.getPOARequest('123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(sentryCaptureMessageStub.called).to.be.true;
        expect(sentryCaptureMessageStub.firstCall.args[0]).to.equal(
          'vets_client_error: Failed to fetch',
        );
      }
    });
  });

  describe('getPOARequests', () => {
    it('builds correct URL with query params', async () => {
      const res = new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: new Headers(),
      });
      sessionStub.resolves(res);

      await api.getPOARequests({
        status: 'pending',
        sort: 'created_at',
        sortBy: 'desc',
        size: 10,
        number: 2,
      });

      const url = sessionStub.firstCall.args[0];
      expect(url).to.include('/power_of_attorney_requests?status=pending');
      expect(url).to.include('&page[size]=10');
      expect(url).to.include('&page[number]=2');
    });
  });

  describe('getPOARequest', () => {
    it('builds correct URL with ID', async () => {
      const res = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: new Headers(),
      });
      sessionStub.resolves(res);

      await api.getPOARequest('123');
      const url = sessionStub.firstCall.args[0];
      expect(url).to.include('/power_of_attorney_requests/123');
    });

    it('preserves 403 forbidden responses', async () => {
      const res = new Response(
        JSON.stringify({ errors: ['Forbidden'], status: 'FORBIDDEN' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      );
      sessionStub.resolves(res);

      try {
        await api.getPOARequest('123');
      } catch (error) {
        expect(error.status).to.equal(403);
        const body = await error.json();
        expect(body.errors).to.include('Forbidden');
      }
    });

    it('preserves 404 responses', async () => {
      const res = new Response(
        JSON.stringify({ errors: ['Not Found'], status: 'NOT_FOUND' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
      sessionStub.resolves(res);

      try {
        await api.getPOARequest('123');
      } catch (error) {
        expect(error.status).to.equal(404);
      }
    });

    it('preserves 500 responses', async () => {
      const res = new Response(
        JSON.stringify({ errors: ['Internal Error'], status: 'SERVER_ERROR' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
      sessionStub.resolves(res);

      try {
        await api.getPOARequest('123');
      } catch (error) {
        expect(error.status).to.equal(500);
      }
    });
  });

  describe('Successful response handling', () => {
    it('returns the response when response.ok is true', async () => {
      const res = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: new Headers(),
      });
      sessionStub.resolves(res);

      const result = await api.getUser();
      expect(result).to.equal(res);
    });

    it('returns the response when status is 304 and ok is false', async () => {
      const res = new Response(null, {
        status: 304,
        headers: new Headers(),
      });
      Object.defineProperty(res, 'ok', { value: false });
      sessionStub.resolves(res);

      const result = await api.getUser();
      expect(result.status).to.equal(304);
    });
  });

  describe('claimantSearch', () => {
    it('sends correct POST body', async () => {
      const res = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: new Headers(),
      });
      sessionStub.resolves(res);

      const payload = { ssn: '123456789', lastName: 'Doe' };
      await api.claimantSearch(payload);

      const [url, options] = sessionStub.firstCall.args;
      expect(url).to.include('/claimant/search');
      expect(options.method).to.equal('POST');
      expect(JSON.parse(options.body)).to.deep.equal(payload);
    });
  });

  describe('getSubmissions', () => {
    it('uses default sort and pagination when none provided', async () => {
      const res = new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: new Headers(),
      });
      sessionStub.resolves(res);

      await api.getSubmissions({});

      const url = sessionStub.firstCall.args[0];
      expect(url).to.include(`page[size]=${SORT_DEFAULTS.SIZE}`);
      expect(url).to.include(`page[number]=${SORT_DEFAULTS.NUMBER}`);
      expect(url).to.include(
        `sort[by]=${SORT_DEFAULTS.SORT_BY}&sort[order]=${
          SORT_DEFAULTS.SORT_ORDER
        }`,
      );
    });
  });

  describe('401 redirect logic', () => {
    it('redirects to login on 401 if not on a root/sign-in page', async () => {
      const res = new Response(JSON.stringify({}), { status: 401 });
      sessionStub.resolves(res);

      const getSignInUrlStub = sandbox
        .stub()
        .returns('https://example.com/login');
      const constants = require('../../../utilities/constants');
      sandbox.stub(constants, 'getSignInUrl').value(getSignInUrlStub);

      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/some-other-path',
          href: 'http://original.com',
        },
        writable: true,
      });

      await api.getUser();
      expect(window.location).to.equal('https://example.com/login');
    });

    it('does NOT redirect to login if pathname is in allowed list', async () => {
      const res = new Response('{}', { status: 401 });
      Object.defineProperty(res, 'ok', { value: false });
      sessionStub.resolves(res);

      const getSignInUrlStub = sandbox
        .stub()
        .returns('https://example.com/login');
      const constants = require('../../../utilities/constants');
      sandbox.stub(constants, 'getSignInUrl').value(getSignInUrlStub);

      Object.defineProperty(window, 'location', {
        value: {
          pathname: manifest.rootUrl,
          href: 'http://allowed.com',
        },
        writable: true,
      });

      try {
        await api.getUser();
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(Response);
        expect(error.status).to.equal(401);
      }
    });
  });

  describe('createPOARequestDecision', () => {
    it('sends POST with correct decision payload', async () => {
      const res = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: new Headers(),
      });
      sessionStub.resolves(res);

      const decision = { type: 'acceptance' };
      await api.createPOARequestDecision('abc123', decision);

      const [url, options] = sessionStub.firstCall.args;
      expect(url).to.include('/power_of_attorney_requests/abc123/decision');
      expect(options.method).to.equal('POST');
      expect(JSON.parse(options.body)).to.deep.equal({ decision });
    });
  });

  describe('getClaimantOverview', () => {
    it('builds correct URL with claimant id', async () => {
      const res = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: new Headers(),
      });
      sessionStub.resolves(res);

      await api.getClaimantOverview('abc123');

      const url = sessionStub.firstCall.args[0];
      expect(url).to.include('/claimant/abc123');
    });
  });

  describe('getIntentToFile', () => {
    const okRes = new Response(JSON.stringify({ data: {} }), {
      status: 200,
      headers: new Headers(),
    });

    it('builds correct query params for non-survivor (no claimant fields)', async () => {
      sessionStub.resolves(okRes);

      await api.getIntentToFile({
        benefitType: 'compensation',
        veteranSsn: '123456789',
        veteranDateOfBirth: '19900101',
        veteranFullName: { first: 'Pat', last: 'Smith' },
      });

      const url = sessionStub.firstCall.args[0];

      expect(url).to.include('/intent_to_file?');
      expect(url).to.include('benefitType=compensation');
      expect(url).to.include('veteranSsn=123456789');
      expect(url).to.include('veteranDateOfBirth=19900101');

      // URLSearchParams encodes bracket keys
      expect(url).to.include('veteranFullName%5Bfirst%5D=Pat');
      expect(url).to.include('veteranFullName%5Blast%5D=Smith');

      expect(url).to.not.include('claimantSsn=');
      expect(url).to.not.include('claimantDateOfBirth=');
      expect(url).to.not.include('claimantFullName%5Bfirst%5D=');
      expect(url).to.not.include('claimantFullName%5Blast%5D=');
    });

    it('builds correct query params for survivor (includes claimant fields)', async () => {
      sessionStub.resolves(okRes);

      await api.getIntentToFile({
        benefitType: 'survivor',
        veteranSsn: '123456789',
        veteranDateOfBirth: '19900101',
        veteranFullName: { first: 'Vet', last: 'Person' },
        claimantSsn: '987654321',
        claimantDateOfBirth: '19700101',
        claimantFullName: { first: 'Survivor', last: 'Person' },
      });

      const url = sessionStub.firstCall.args[0];

      expect(url).to.include('/intent_to_file?');
      expect(url).to.include('benefitType=survivor');

      expect(url).to.include('veteranSsn=123456789');
      expect(url).to.include('veteranDateOfBirth=19900101');
      expect(url).to.include('veteranFullName%5Bfirst%5D=Vet');
      expect(url).to.include('veteranFullName%5Blast%5D=Person');

      expect(url).to.include('claimantSsn=987654321');
      expect(url).to.include('claimantDateOfBirth=19700101');
      expect(url).to.include('claimantFullName%5Bfirst%5D=Survivor');
      expect(url).to.include('claimantFullName%5Blast%5D=Person');
    });

    it('does not include empty/undefined params', async () => {
      sessionStub.resolves(okRes);

      await api.getIntentToFile({
        benefitType: 'compensation',
        veteranSsn: null,
        veteranDateOfBirth: undefined,
        veteranFullName: { first: '', last: 'Smith' }, // only last should be included
      });

      const url = sessionStub.firstCall.args[0];

      expect(url).to.include('benefitType=compensation');
      expect(url).to.include('veteranFullName%5Blast%5D=Smith');

      expect(url).to.not.include('veteranSsn=');
      expect(url).to.not.include('veteranDateOfBirth=');
      expect(url).to.not.include('veteranFullName%5Bfirst%5D=');
    });
  });
});
