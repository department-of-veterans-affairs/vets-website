import { expect } from 'chai';

import { totalRating } from '@@profile/reducers/rated-disabilities/totalDisabilities';
import {
  FETCH_TOTAL_RATING_STARTED,
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
} from '../../../../common/actions/ratedDisabilities';

describe('totalRating reducer', () => {
  const initialState = {
    loading: true,
    error: null,
    totalDisabilityRating: null,
    disabilityDecisionTypeName: null,
  };

  it('should return the initial state', () => {
    expect(totalRating(undefined, {})).to.deep.equal(initialState);
  });

  it('should handle FETCH_TOTAL_RATING_STARTED', () => {
    const modifiedState = {
      ...initialState,
      loading: false,
      error: 'some error',
      totalDisabilityRating: 70,
      disabilityDecisionTypeName: 'Service Connected',
    };
    const action = { type: FETCH_TOTAL_RATING_STARTED };
    expect(totalRating(modifiedState, action)).to.deep.equal(initialState);
  });

  it('should handle FETCH_TOTAL_RATING_SUCCEEDED', () => {
    const response = {
      userPercentOfDisability: 70,
      disabilityDecisionTypeName: 'Service Connected',
    };
    const action = {
      type: FETCH_TOTAL_RATING_SUCCEEDED,
      response,
    };
    const expectedState = {
      ...initialState,
      loading: false,
      totalDisabilityRating: 70,
      disabilityDecisionTypeName: 'Service Connected',
    };
    expect(totalRating(initialState, action)).to.deep.equal(expectedState);
  });

  it('should handle FETCH_TOTAL_RATING_FAILED', () => {
    const error = 'Failed to fetch total rating';
    const action = {
      type: FETCH_TOTAL_RATING_FAILED,
      error,
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error,
    };
    expect(totalRating(initialState, action)).to.deep.equal(expectedState);
  });

  it('should handle unknown action type', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(totalRating(initialState, action)).to.deep.equal(initialState);
  });
});
