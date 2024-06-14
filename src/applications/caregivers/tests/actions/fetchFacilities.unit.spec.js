import { expect } from 'chai';
import { fetchFacilities } from '../../actions/fetchFacilities';
import {
  mockLightHouseFacilitiesResponse,
  mockLightHouseFacilitiesResponseWithTransformedAddresses,
} from '../mocks/responses';

describe('fetchFacilities', () => {
  context("when the 'mapBoxResponse' param is an error", () => {
    // eslint-disable-next-line cypress/no-async-tests
    it('should return the mapBox error', async () => {
      const facilities = await fetchFacilities({
        type: 'SEARCH_FAILED',
        errorMessage: 'Something went wrong. Some bad error.',
      });

      expect(facilities).to.be.a('string');
      expect(facilities).to.eq('Something went wrong. Some bad error.');
    });
  });

  context('when the response is successful', () => {
    it('should return facility results', async () => {
      // Use the mockLightHouseFacilitiesResponse as the response data
      const facilities = await fetchFacilities(
        [1, 2, 3, 4],
        Promise.resolve(mockLightHouseFacilitiesResponse),
      );

      const expectedFacilities =
        mockLightHouseFacilitiesResponseWithTransformedAddresses.data;

      // expect(facilities).to.be.an('array');
      expect(facilities).to.deep.eq(expectedFacilities);
    });
  });

  context('when the response is unsuccessful', () => {
    const mockErrors = {
      errors: [
        {
          title: 'Some bad error',
        },
        {
          detail: 'Another bad error',
        },
      ],
    };
    // eslint-disable-next-line cypress/no-async-tests
    it('should return an error object', async () => {
      const facilities = await fetchFacilities(
        [4, 3, 2, 1],
        Promise.reject(mockErrors),
      );

      expect(facilities).to.be.a('object');
      expect(facilities.errorMessage[0]).to.eq('Some bad error');
      expect(facilities.errorMessage[1]).to.eq('Another bad error');
    });
  });
});
