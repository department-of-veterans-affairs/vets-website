import { expect } from 'chai';
import {
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
} from '../../actions';
import { totalRating } from '../../reducers/total-disabilities';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  totalDisabilityRating: null,
  disabilityDecisionTypeName: null,
};

describe('totalDisabilities reducer', () => {
  it('should return the initial state', () => {
    const state = totalRating(initialState, {});
    expect(state.loading).to.equal(true);
    expect(state.error).to.equal(null);
    expect(state.totalDisabilityRating).to.equal(null);
  });

  it('should handle an error from the API call', () => {
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

  it('should return the state if a type is not matched', () => {
    const state = totalRating(initialState, {
      type: 'BLERG',
    });

    expect(state.loading).to.equal(true);
    expect(state.error).to.equal(null);
    expect(state.totalDisabilityRating).to.equal(null);
    expect(state.disabilityDecisionTypeName).to.equal(null);
  });
});
