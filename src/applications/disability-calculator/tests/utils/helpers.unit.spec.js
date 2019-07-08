/**
 * The expected result of these tests came from manually determining
 * the combined rating using the data tables located at
 * https://www.benefits.va.gov/compensation/rates-index.asp.
 */

import { expect } from 'chai';
import inputs from './inputs.json';

import { calculateCombinedRating } from '../../utils/helpers';

describe('Disability Caclulator helpers', () => {
  describe('calculateCombinedRating', () => {
    for (const input of inputs) {
      it('should calculate the correct result', () => {
        const { ratings, combinedRating: expectedResult } = input;
        const result = calculateCombinedRating(ratings);

        expect(result).to.have.keys(['exact', 'rounded']);
        expect(result.exact).to.be.equal(expectedResult.exact);
        expect(result.rounded).to.be.equal(expectedResult.rounded);
      });
    }
  });
});
