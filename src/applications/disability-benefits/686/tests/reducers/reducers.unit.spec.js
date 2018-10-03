import { expect } from 'chai';

import {
  LOAD_30_PERCENT_DISABILITY_RATING_STARTED,
  LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED,
  LOAD_30_PERCENT_DISABILITY_RATING_FAILED,
} from '../../actions';

import reducers from '../../reducers';

const initialState = {
  isLoading: false,
  isAuthorized: false,
};

describe('authorization686 reducer', () => {
  const { authorization686 } = reducers;
  let expectedState = {};

  it('should handle LOAD_30_PERCENT_DISABILITY_RATING_STARTED', () => {
    expectedState = {
      isLoading: true,
      isAuthorized: false,
    };
    const newState = authorization686(initialState, {
      type: LOAD_30_PERCENT_DISABILITY_RATING_STARTED,
    });

    expect(newState).to.eql(expectedState);
  });

  it('should handle LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED with authorization', () => {
    expectedState = {
      isLoading: false,
      isAuthorized: true,
    };
    const newState = authorization686(initialState, {
      type: LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED,
      payload: { has30Percent: true },
    });

    expect(newState).to.eql(expectedState);
  });

  it('should handle LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED without authorization', () => {
    expectedState = {
      isLoading: false,
      isAuthorized: false,
    };
    const newState = authorization686(initialState, {
      type: LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED,
      payload: { has30Percent: false },
    });

    expect(newState).to.eql(expectedState);
  });

  it('should handle LOAD_30_PERCENT_DISABILITY_RATING_FAILED', () => {
    const payload = {
      error: true,
    };

    expectedState = {
      isLoading: false,
      isAuthorized: false,
      payload,
    };
    const newState = authorization686(initialState, {
      type: LOAD_30_PERCENT_DISABILITY_RATING_FAILED,
      error: payload,
    });
    expect(newState).to.eql(expectedState);
  });
});
