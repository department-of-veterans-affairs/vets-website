import { expect } from 'chai';
import * as api from 'platform/utilities/api';
import sinon from 'sinon-v20';
import { fetchFacilities } from '../../../actions/fetchFacilities';
import { API_ENDPOINTS } from '../../../utils/constants';
import {
  mockFetchFacilitiesResponse,
  mockVetsApiFacilitiesResponse,
  mockFetchFacilitiesReponseWithoutAddress,
  mockVetsApiFacilitiesWithoutAddressResponse,
} from '../../mocks/fetchFacility';
import content from '../../../locales/en/content.json';

// declare error message content
const ERROR_MSG_NO_RESULTS = content['error--no-results-found'];
const ERROR_MSG_GENERIC = content['error--facilities--generic'];

describe('CG fetchFacilities action', () => {
  const buildExpectedBody = ({
    lat = null,
    long = null,
    radius = null,
    page = null,
    perPage = null,
    type = 'health',
    facilityIds = '',
  } = {}) =>
    JSON.stringify({
      type,
      lat,
      long,
      radius,
      page,
      perPage,
      facilityIds,
    });
  const requestArgs = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };
  const lat = 1;
  const long = 2;
  const perPage = 5;
  const page = 1;
  const radius = 500;
  const facilityIds = ['12', '34'];
  const endpoint = API_ENDPOINTS.facilities;
  let apiRequestStub;

  beforeEach(() => {
    localStorage.setItem('csrfToken', 'my-token');
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
  });

  afterEach(() => {
    localStorage.clear();
    sinon.restore();
  });

  context('when the fetch succeeds', () => {
    it('should make the correct request when all params are passed', async () => {
      await fetchFacilities({ long, lat, perPage, radius, page, facilityIds });
      sinon.assert.calledOnceWithExactly(apiRequestStub, endpoint, {
        ...requestArgs,
        body: buildExpectedBody({
          lat,
          long,
          radius,
          page,
          perPage,
          facilityIds: `${facilityIds[0]},${facilityIds[1]}`,
        }),
      });
    });

    it('should make the correct request when no params are passed', async () => {
      await fetchFacilities({});
      sinon.assert.calledOnceWithExactly(apiRequestStub, endpoint, {
        ...requestArgs,
        body: buildExpectedBody(),
      });
    });

    it('should correctly format facility IDs when only one ID is provided', async () => {
      await fetchFacilities({ facilityIds: ['1'] });
      sinon.assert.calledOnceWithExactly(apiRequestStub, endpoint, {
        ...requestArgs,
        body: buildExpectedBody({ facilityIds: '1' }),
      });
    });

    it('should correctly format facility with address data', async () => {
      apiRequestStub.resolves(mockVetsApiFacilitiesResponse);
      const response = await fetchFacilities({ long, lat, perPage, radius });
      expect(response).to.deep.eq(mockFetchFacilitiesResponse);
      sinon.assert.calledOnce(apiRequestStub);
    });

    it('should correctly format facility without address data', async () => {
      apiRequestStub.resolves(mockVetsApiFacilitiesWithoutAddressResponse);
      const response = await fetchFacilities({ long, lat, perPage, radius });
      expect(response).to.deep.eq(mockFetchFacilitiesReponseWithoutAddress);
      sinon.assert.calledOnce(apiRequestStub);
    });

    it('should return `NO_SEARCH_RESULTS` if no data array', async () => {
      apiRequestStub.resolves({ meta: {} });
      const response = await fetchFacilities({ long, lat, perPage, radius });
      expect(response).to.deep.eq({
        type: 'NO_SEARCH_RESULTS',
        errorMessage: ERROR_MSG_NO_RESULTS,
      });
      sinon.assert.calledOnce(apiRequestStub);
    });
  });

  context('when the fetch fails', () => {
    it('should return correctly-formatted error object', async () => {
      apiRequestStub.rejects({ bad: 'some error' });
      const response = await fetchFacilities({ long, lat });
      expect(response).to.deep.eq({
        type: 'SEARCH_FAILED',
        errorMessage: ERROR_MSG_GENERIC,
      });
      sinon.assert.calledOnce(apiRequestStub);
    });

    it('should reset csrfToken on `403 - Invalid Authenticity Token` error', async () => {
      const invalidAuthenticityTokenResponse = {
        errors: [{ status: '403', detail: 'Invalid Authenticity Token' }],
      };
      apiRequestStub.rejects(invalidAuthenticityTokenResponse);
      expect(localStorage.getItem('csrfToken')).to.eq('my-token');

      const response = await fetchFacilities({ long, lat });
      expect(response).to.deep.eq({
        type: 'SEARCH_FAILED',
        errorMessage: ERROR_MSG_GENERIC,
      });
      expect(localStorage.getItem('csrfToken')).to.be.null;
      sinon.assert.calledOnce(apiRequestStub);
    });
  });
});
