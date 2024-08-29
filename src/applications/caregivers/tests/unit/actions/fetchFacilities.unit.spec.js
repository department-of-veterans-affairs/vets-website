import { expect } from 'chai';
import {
  mockApiRequest,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import * as Sentry from '@sentry/browser';
import sinon from 'sinon';
import { fetchFacilities } from '../../../actions/fetchFacilities';
import {
  mockFacilitiesResponse,
  mockFetchFacilitiesResponse,
} from '../../mocks/responses';

describe('CG fetchFacilities action', () => {
  context('success', () => {
    it('returns valid response when lat and long are passed', async () => {
      mockApiRequest(mockFacilitiesResponse);
      const response = await fetchFacilities({ lat: 1, long: 2 });
      expect(response).to.deep.eq(mockFetchFacilitiesResponse);
    });
  });

  context('when the request fails', () => {
    it('should return an error object', async () => {
      const errorResponse = { status: 503, error: 'my error message' };
      mockApiRequest(errorResponse, false);
      setFetchJSONFailure(global.fetch.onCall(0), errorResponse);

      const response = await fetchFacilities({ lat: 1, long: 2 });
      expect(response).to.eql({
        type: 'SEARCH_FAILED',
        errorMessage: 'There was an error fetching the health care facilities.',
      });
      const sentrySpy = sinon.spy(Sentry, 'captureMessage');
      expect(sentrySpy.called).to.be.true;
      expect(sentrySpy.firstCall.args[0]).to.equal(
        'Error fetching Lighthouse VA facilities',
      );
      sentrySpy.restore();
    });
  });
});
