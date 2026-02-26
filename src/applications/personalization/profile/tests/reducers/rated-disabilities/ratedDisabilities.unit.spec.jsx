import { expect } from 'chai';

import { ratedDisabilities } from '@@profile/reducers/rated-disabilities/ratedDisabilities';
import {
  FETCH_RATED_DISABILITIES_SUCCESS,
  FETCH_RATED_DISABILITIES_FAILED,
} from '../../../../common/actions/ratedDisabilities';

describe('ratedDisabilities reducer', () => {
  const initialState = {
    ratedDisabilities: null,
  };

  it('should return the initial state', () => {
    expect(ratedDisabilities(undefined, {})).to.deep.equal(initialState);
  });

  it('should handle FETCH_RATED_DISABILITIES_SUCCESS', () => {
    const response = [
      {
        name: 'PTSD',
        ratingPercentage: 50,
        effectiveDate: '2020-01-01',
      },
      {
        name: 'Tinnitus',
        ratingPercentage: 10,
        effectiveDate: '2020-01-01',
      },
    ];
    const action = {
      type: FETCH_RATED_DISABILITIES_SUCCESS,
      response,
    };
    const expectedState = {
      ratedDisabilities: response,
    };
    expect(ratedDisabilities(initialState, action)).to.deep.equal(
      expectedState,
    );
  });

  it('should handle FETCH_RATED_DISABILITIES_FAILED', () => {
    const response = { error: 'Failed to fetch rated disabilities' };
    const action = {
      type: FETCH_RATED_DISABILITIES_FAILED,
      response,
    };
    const expectedState = {
      ratedDisabilities: response,
    };
    expect(ratedDisabilities(initialState, action)).to.deep.equal(
      expectedState,
    );
  });

  it('should handle unknown action type', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(ratedDisabilities(initialState, action)).to.deep.equal(initialState);
  });
});
