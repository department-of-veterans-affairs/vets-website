import { expect } from 'chai';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { fetchFacilities } from '../../../actions/fetchFacilities';
import {
  mockLightHouseFacilitiesResponse,
  mockLightHouseFacilitiesResponseWithTransformedAddresses,
} from '../../mocks/responses';

describe('CG fetchFacilities action', () => {
  const mockCoordinates = [1, 2, 3, 4];

  context('when the `mapBoxResponse` param is an error', () => {
    it('should return the mapBox error', async () => {
      const errorMessage = 'Something went wrong. Some bad error.';
      const response = await fetchFacilities({
        type: 'SEARCH_FAILED',
        errorMessage,
      });
      expect(response).to.eq(errorMessage);
    });
  });

  context('when the request succeeds', () => {
    const { data } = mockLightHouseFacilitiesResponseWithTransformedAddresses;

    it('should return facility results when request is omitted', async () => {
      mockApiRequest(mockLightHouseFacilitiesResponse);
      const response = await fetchFacilities(mockCoordinates);
      expect(response).to.deep.eq(data);
    });

    it('should return facility results when request is passed', async () => {
      const response = await fetchFacilities(
        mockCoordinates,
        Promise.resolve(mockLightHouseFacilitiesResponse),
      );
      expect(response).to.deep.eq(data);
    });
  });

  context('when the request fails', () => {
    it('should return an error object', async () => {
      const mockErrors = {
        errors: [{ title: 'Some bad error' }, { detail: 'Another bad error' }],
      };
      const response = await fetchFacilities(
        mockCoordinates,
        Promise.reject(mockErrors),
      );
      expect(response).to.be.a('object');
      expect(response.errorMessage[0]).to.eq(mockErrors.errors[0].title);
      expect(response.errorMessage[1]).to.eq(mockErrors.errors[1].detail);
    });
  });
});
