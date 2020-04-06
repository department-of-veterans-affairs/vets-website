/**
 * The expected result of these tests came from manually determining
 * the combined rating using the data tables located at
 * https://www.benefits.va.gov/compensation/rates-index.asp.
 */

import inputs from './inputs.json';

import {
  calculateCombinedRating,
  getRatingErrorMessage,
} from '../../utils/helpers';

describe('Disability Calculator helpers:', () => {
  describe('calculateCombinedRating', () => {
    for (const input of inputs) {
      const { ratings, combinedRating: expectedResult } = input;

      test(`should calculate a CDR of ${expectedResult.exact} (rounded to ${
        expectedResult.rounded
      }) from the following ratings: ${ratings.join(', ')}`, () => {
        const result = calculateCombinedRating(ratings);

        expect(result).toEqual(expect.arrayContaining(['exact', 'rounded']));
        expect(result.exact).toBe(expectedResult.exact);
        expect(result.rounded).toBe(expectedResult.rounded);
      });
    }
  });

  describe('getRatingErrorMessage', () => {
    const validRatings = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    const invalidRatings = [0, -1, 5, 11, 100, 101, 123];

    for (const rating of validRatings) {
      test(`accepts ${rating} as valid input`, () => {
        const result = getRatingErrorMessage(rating);
        expect(result).toBe(false);
      });
    }

    for (const rating of invalidRatings) {
      test(`rejects ${rating} as valid input`, () => {
        const result = getRatingErrorMessage(rating);
        expect(result).toEqual(expect.arrayContaining(['title', 'body']));
      });
    }
  });
});
