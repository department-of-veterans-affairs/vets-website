import { expect } from 'chai';
import * as api from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import environment from 'platform/utilities/environment';
import * as recordEventModule from 'platform/monitoring/record-event';
import { fetchFacilities } from '../../../actions/fetchFacilities';
import {
  mockFetchFacilitiesResponse,
  mockFacilitiesResponse,
} from '../../mocks/responses';
import content from '../../../locales/en/content.json';

describe('CG fetchFacilities action', () => {
  const method = 'POST';
  const headers = { 'Content-Type': 'application/json' };
  const lat = 1;
  const long = 2;
  const perPage = 5;
  const page = 1;
  const radius = 500;
  const facilityIds = ['12', '34'];
  const errorResponse = { bad: 'some error' };
  let apiRequestStub;
  let sentrySpy;
  let recordEventStub;

  beforeEach(() => {
    localStorage.setItem('csrfToken', 'my-token');
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
    sentrySpy = sinon.spy(Sentry, 'captureMessage');
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    apiRequestStub.restore();
    localStorage.clear();
    sentrySpy.restore();
    recordEventStub.restore();
  });

  context('success', () => {
    it('calls correct url when all params are passed', async () => {
      await fetchFacilities({ long, lat, perPage, radius, page, facilityIds });

      const expectedBody = JSON.stringify({
        type: 'health',
        lat,
        long,
        radius,
        page,
        perPage,
        facilityIds: `${facilityIds[0]},${facilityIds[1]}`,
      });

      const expectedUrl = `${
        environment.API_URL
      }/v0/caregivers_assistance_claims/facilities`;
      sinon.assert.calledWith(apiRequestStub, expectedUrl, {
        method,
        headers,
        body: expectedBody,
      });

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
        expect(sentrySpy.called).to.be.true;
        expect(sentrySpy.firstCall.args[0]).to.equal(
          'FetchFacilities facilityIds',
        );
      });
    });

    it('calls url without params when no params are passed', async () => {
      await fetchFacilities({});

      const expectedBody = JSON.stringify({
        type: 'health',
        lat: null,
        long: null,
        radius: null,
        page: null,
        perPage: null,
        facilityIds: '',
      });

      const expectedUrl = `${
        environment.API_URL
      }/v0/caregivers_assistance_claims/facilities`;
      sinon.assert.calledWith(apiRequestStub, expectedUrl, {
        method,
        headers,
        body: expectedBody,
      });
    });

    it('formats facility ids correctly when only one facility id', async () => {
      await fetchFacilities({ facilityIds: ['1'] });

      const expectedBody = JSON.stringify({
        type: 'health',
        lat: null,
        long: null,
        radius: null,
        page: null,
        perPage: null,
        facilityIds: '1',
      });

      const expectedUrl = `${
        environment.API_URL
      }/v0/caregivers_assistance_claims/facilities`;
      sinon.assert.calledWith(apiRequestStub, expectedUrl, {
        method,
        headers,
        body: expectedBody,
      });

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });

    it('formats facility addresses', async () => {
      apiRequestStub.resolves(mockFacilitiesResponse);
      const response = await fetchFacilities({ long, lat, perPage, radius });
      expect(response).to.deep.eq(mockFetchFacilitiesResponse);

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });

    it('returns NO_SEARCH_RESULTS if no data array', async () => {
      apiRequestStub.resolves({ meta: {} });
      const response = await fetchFacilities({ long, lat, perPage, radius });

      expect(response).to.deep.eq({
        type: 'NO_SEARCH_RESULTS',
        errorMessage: content['error--no-results-found'],
      });

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });
  });

  context('failure', () => {
    it('should log to sentry and return an error object', async () => {
      apiRequestStub.rejects(errorResponse);

      const response = await fetchFacilities({ long, lat });
      expect(response).to.eql({
        type: 'SEARCH_FAILED',
        errorMessage: 'There was an error fetching the health care facilities.',
      });

      expect(sentrySpy.called).to.be.true;
      expect(sentrySpy.firstCall.args[0]).to.equal(
        'FetchFacilities facilityIds',
      );
      expect(sentrySpy.secondCall.args[0]).to.equal(
        'Error fetching Lighthouse VA facilities',
      );

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });

    it('should log to sentry and reset csrfToken on 403 Invalid Authenticity Token error', async () => {
      expect(localStorage.getItem('csrfToken')).to.eql('my-token');
      const invalidAuthenticityTokenResponse = {
        errors: [{ status: '403', detail: 'Invalid Authenticity Token' }],
      };
      apiRequestStub.rejects(invalidAuthenticityTokenResponse);

      const response = await fetchFacilities({ long, lat });
      expect(response).to.eql({
        type: 'SEARCH_FAILED',
        errorMessage: 'There was an error fetching the health care facilities.',
      });

      expect(sentrySpy.called).to.be.true;
      expect(sentrySpy.firstCall.args[0]).to.equal(
        'FetchFacilities facilityIds',
      );
      expect(sentrySpy.secondCall.args[0]).to.equal(
        'Error fetching Lighthouse VA facilities',
      );
      expect(sentrySpy.thirdCall.args[0]).to.equal(
        'Error in fetchFacilities. Clearing csrfToken in localStorage.',
      );
      expect(localStorage.getItem('csrfToken')).to.eql('');

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });
  });
});
