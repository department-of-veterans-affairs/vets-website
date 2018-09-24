import { expect } from 'chai';

import { requestStates } from '../../../../../platform/utilities/constants';

import {
  LOAD_DISABILITY_RATING_STARTED,
  LOAD_DISABILITY_RATING_SUCCEEDED,
  LOAD_DISABILITY_RATING_FAILED,
} from '../../actions';

import reducers from '../../reducers';

const initialState = {
  isLoading: false,
  hasError: false,
  disabilityRatingState: requestStates.notCalled,
  payload: null,
};

describe('authorization686 reducer', () => {
  const { authorization686 } = reducers;
  let expectedState = {};

  it('should handle LOAD_DISABILITY_RATING_STARTED', () => {
    expectedState = {
      isLoading: true,
      hasError: false,
      disabilityRatingState: requestStates.pending,
      payload: null,
    };
    const newState = authorization686(initialState, {
      type: LOAD_DISABILITY_RATING_STARTED,
    });
    expect(newState).to.eql(expectedState);
  });

  it('should handle LOAD_DISABILITY_RATING_SUCCEEDED', () => {
    expectedState = {
      isLoading: false,
      hasError: false,
      disabilityRatingState: requestStates.succeeded,
      payload: { data: true },
    };
    const newState = authorization686(initialState, {
      type: LOAD_DISABILITY_RATING_SUCCEEDED,
      payload: { data: true },
    });
    expect(newState).to.eql(expectedState);
  });

  it('should handle LOAD_DISABILITY_RATING_FAILED', () => {
    expectedState = {
      isLoading: false,
      hasError: true,
      disabilityRatingState: requestStates.failed,
      payload: { error: true },
    };
    const newState = authorization686(initialState, {
      type: LOAD_DISABILITY_RATING_FAILED,
      error: { error: true },
    });
    expect(newState).to.eql(expectedState);
  });
});
