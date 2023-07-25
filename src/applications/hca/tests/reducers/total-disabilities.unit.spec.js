import { expect } from 'chai';
import {
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
} from '../../utils/actions';
import totalRating from '../../reducers/total-disabilities';

describe('hca TotalDisabilities reducer', () => {
  const initialState = {
    loading: true, // app starts in loading state
    error: null,
    totalDisabilityRating: null,
    disabilityDecisionTypeName: null,
  };

  describe('default behavior', () => {
    it('should return the initial state', () => {
      const state = totalRating(initialState, {});
      expect(state.loading).to.equal(true);
      expect(state.error).to.equal(null);
      expect(state.totalDisabilityRating).to.equal(null);
    });
  });

  describe('when the API returns an error', () => {
    it('should handle the error from the API call', () => {
      const state = totalRating(initialState, {
        type: FETCH_TOTAL_RATING_FAILED,
        error: {
          code: 500,
          detail: 'failed to load',
        },
      });
      const err = { code: 500, detail: 'failed to load' };
      expect(state.loading).to.equal(false);
      expect(state.error.code).to.equal(err.code);
      expect(state.error.detail).to.equal(err.detail);
      expect(state.totalDisabilityRating).to.equal(null);
    });
  });

  describe('when the API returns a success response', () => {
    it('should handle a successful API call', () => {
      const state = totalRating(initialState, {
        type: FETCH_TOTAL_RATING_SUCCEEDED,
        response: {
          disabilityDecisionTypeName: 'Service Connected',
          userPercentOfDisability: 80,
        },
      });
      expect(state.loading).to.equal(false);
      expect(state.error).to.equal(null);
      expect(state.totalDisabilityRating).to.equal(80);
      expect(state.disabilityDecisionTypeName).to.equal('Service Connected');
    });
  });

  describe('when the type is not a match', () => {
    it('should return the state when there is a type mismatch', () => {
      const state = totalRating(initialState, {
        type: 'BLERG',
      });

      expect(state.loading).to.equal(true);
      expect(state.error).to.equal(null);
      expect(state.totalDisabilityRating).to.equal(null);
      expect(state.disabilityDecisionTypeName).to.equal(null);
    });
  });
});
