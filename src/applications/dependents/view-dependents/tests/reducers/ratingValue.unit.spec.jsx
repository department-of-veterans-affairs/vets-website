import { expect } from 'chai';
import ratingValue from '../../reducers/ratingInfo';

import {
  FETCH_RATING_INFO_STARTED,
  FETCH_RATING_INFO_SUCCESS,
  FETCH_RATING_INFO_FAILED,
} from '../../actions/ratingInfo';

describe('ratingValue reducer', () => {
  it('should return initial state', () => {
    const initialState = ratingValue(undefined, {});
    expect(initialState.loading).to.be.true;
    expect(initialState.error).to.be.null;
    expect(initialState.serviceConnectedCombinedDegree).to.be.null;
  });

  it('should handle FETCH_RATING_INFO_STARTED', () => {
    const previousState = {
      loading: false,
      error: { code: '500' },
      serviceConnectedCombinedDegree: 50,
      hasMinimumRating: true,
    };

    const newState = ratingValue(previousState, {
      type: FETCH_RATING_INFO_STARTED,
    });

    expect(newState.loading).to.be.true;
    expect(newState.error).to.be.null;
    expect(newState.serviceConnectedCombinedDegree).to.equal(50);
    expect(newState.hasMinimumRating).to.be.true;
  });

  it('should handle FETCH_RATING_INFO_SUCCESS with rating >= 30', () => {
    const previousState = {
      loading: true,
      error: null,
      userPercentOfDisability: null,
    };

    const newState = ratingValue(previousState, {
      type: FETCH_RATING_INFO_SUCCESS,
      response: { userPercentOfDisability: 50 },
    });

    expect(newState.loading).to.be.false;
    expect(newState.hasMinimumRating).to.be.true;
  });

  it('should handle FETCH_RATING_INFO_SUCCESS with rating < 30', () => {
    const previousState = {
      loading: true,
      error: null,
      userPercentOfDisability: null,
    };

    const newState = ratingValue(previousState, {
      type: FETCH_RATING_INFO_SUCCESS,
      response: { userPercentOfDisability: 20 },
    });

    expect(newState.loading).to.be.false;
    expect(newState.hasMinimumRating).to.be.undefined;
  });

  it('should handle FETCH_RATING_INFO_FAILED', () => {
    const previousState = {
      loading: true,
      error: null,
      userPercentOfDisability: null,
    };

    const mockError = {
      errors: [
        {
          status: '503',
        },
      ],
    };

    const newState = ratingValue(previousState, {
      type: FETCH_RATING_INFO_FAILED,
      response: mockError,
    });

    expect(newState.loading).to.be.false;
    expect(newState.error).to.deep.equal({ code: '503' });
  });
});
