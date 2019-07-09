/**
 * The expected result of these tests came from manually determining
 * the combined rating using the data tables located at
 * https://www.benefits.va.gov/compensation/rates-index.asp.
 */

import { expect } from 'chai';
import inputs from './inputs.json';

import { calculateCombinedRating } from '../../utils/helpers';

describe('Disability Calculator helpers:', () => {
  describe('calculateCombinedRating', () => {
    for (const input of inputs) {
      const { ratings, combinedRating: expectedResult } = input;

      it(`should calculate a CDR of ${expectedResult.exact} (rounded to ${
        expectedResult.rounded
      }) from the following ratings: ${ratings.join(', ')}`, () => {
        const result = calculateCombinedRating(ratings);

        expect(result).to.have.keys(['exact', 'rounded']);
        expect(result.exact).to.be.equal(expectedResult.exact);
        expect(result.rounded).to.be.equal(expectedResult.rounded);
      });
    }
  });
});
