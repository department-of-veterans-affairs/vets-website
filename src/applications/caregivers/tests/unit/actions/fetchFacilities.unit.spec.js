import { expect } from 'chai';
import * as api from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';
import sinon from 'sinon';
import environment from 'platform/utilities/environment';
import { fetchFacilities } from '../../../actions/fetchFacilities';
import {
  mockFacilitiesResponse,
  mockFetchFacilitiesResponse,
} from '../../mocks/responses';

describe('CG fetchFacilities action', () => {
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

      const expectedUrl = `${
        environment.API_URL
      }/v0/health_care_applications/facilities?type=health&lat=${lat}&long=${long}&radius=${radius}&page=${page}&per_page=${perPage}&facilityIds[]=${
        facilityIds[0]
      }&facilityIds[]=${facilityIds[1]}`;
      sinon.assert.calledWith(apiRequestStub, expectedUrl);
    });

    it('calls url without params when no params are passed', async () => {
      await fetchFacilities({});

      const expectedUrl = `${
        environment.API_URL
      }/v0/health_care_applications/facilities?type=health`;
      sinon.assert.calledWith(apiRequestStub, expectedUrl);
    });

    it('formats facility addresses', async () => {
      apiRequestStub.resolves(mockFacilitiesResponse);
      const response = await fetchFacilities({ long, lat, perPage, radius });
      expect(response).to.deep.eq(mockFetchFacilitiesResponse);
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
