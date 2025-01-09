import { expect } from 'chai';
import * as api from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';
import sinon from 'sinon';
import environment from 'platform/utilities/environment';
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
  let apiRequestStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
  });

  afterEach(() => {
    apiRequestStub.restore();
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
    });

    it('formats facility addresses', async () => {
      apiRequestStub.resolves(mockFacilitiesResponse);
      const response = await fetchFacilities({ long, lat, perPage, radius });
      expect(response).to.deep.eq(mockFetchFacilitiesResponse);
    });

    it('returns NO_SEARCH_RESULTS if no data array', async () => {
      apiRequestStub.resolves({ meta: {} });
      const response = await fetchFacilities({ long, lat, perPage, radius });

      expect(response).to.deep.eq({
        type: 'NO_SEARCH_RESULTS',
        errorMessage: content['error--no-results-found'],
      });
    });
  });

  context('failure', () => {
    let sentrySpy;

    beforeEach(() => {
      sentrySpy = sinon.spy(Sentry, 'captureMessage');
    });

    afterEach(() => {
      sentrySpy.restore();
    });

    it('should log to sentry and return an error object', async () => {
      const errorResponse = { bad: 'some error' };
      apiRequestStub.rejects(errorResponse);

      const response = await fetchFacilities({ long, lat });
      expect(response).to.eql({
        type: 'SEARCH_FAILED',
        errorMessage: 'There was an error fetching the health care facilities.',
      });

      expect(sentrySpy.called).to.be.true;
      expect(sentrySpy.firstCall.args[0]).to.equal(
        'Error fetching Lighthouse VA facilities',
      );
    });
  });
});
