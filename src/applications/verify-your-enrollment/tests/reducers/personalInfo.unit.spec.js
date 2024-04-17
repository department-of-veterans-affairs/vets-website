import { expect } from 'chai';
import personalInfo from '../../reducers/personalInfo';
import {
  FETCH_PERSONAL_INFO,
  FETCH_PERSONAL_INFO_SUCCESS,
  FETCH_PERSONAL_INFO_FAILED,
} from '../../actions';

describe('personalInfo Reducer', () => {
  it('should return initial State', () => {
    expect(personalInfo(undefined, {})).to.deep.equal({
      personalInfo: null,
      isLoading: false,
      error: null,
    });
  });
  it('should handles FETCH_PERSONAL_INFO', () => {
    expect(
      personalInfo(undefined, { type: FETCH_PERSONAL_INFO }),
    ).to.deep.equal({
      personalInfo: null,
      isLoading: true,
      error: null,
    });
  });
  it('should FETCH_PERSONAL_INFO_SUCCESS', () => {
    const response = { data: 'some test data' };
    expect(
      personalInfo(undefined, { type: FETCH_PERSONAL_INFO_SUCCESS, response }),
    ).to.deep.equal({
      personalInfo: response,
      isLoading: false,
      error: null,
    });
  });
  it('should FETCH_PERSONAL_INFO_FAILED', () => {
    const errors = { message: 'some error message' };
    expect(
      personalInfo(undefined, { type: FETCH_PERSONAL_INFO_FAILED, errors }),
    ).to.deep.equal({
      personalInfo: null,
      isLoading: false,
      error: errors,
    });
  });
  it('should handle UPDATE_PENDING_VERIFICATIONS', () => {
    const state = {
      personalInfo: {
        'vye::UserInfo': {
          pendingVerifications: {
            awardIds: [18, 19, 20, 21],
          },
        },
      },
    };

    const action = {
      type: 'UPDATE_PENDING_VERIFICATIONS',
      payload: { awardIds: [] },
    };

    const expectedState = {
      personalInfo: {
        'vye::UserInfo': {
          pendingVerifications: {
            awardIds: [],
          },
        },
      },
    };

    const newState = personalInfo(state, action);

    expect(newState).to.deep.equal(expectedState);
  });
  it('should return an empty object when personalInfo is undefind', () => {
    const state = {};

    const action = {
      type: 'UPDATE_PENDING_VERIFICATIONS',
    };

    const expectedState = {
      personalInfo: {
        'vye::UserInfo': {
          pendingVerifications: undefined,
          verifications: [],
        },
      },
    };

    const newState = personalInfo(state, action);

    expect(newState).to.deep.equal(expectedState);
  });
  it('should handle UPDATE_VERIFICATIONS when personalInfo is undefined', () => {
    const initialState = {};

    const action = {
      type: 'UPDATE_VERIFICATIONS',
      payload: ['1'],
    };

    const expectedState = {
      personalInfo: {
        'vye::UserInfo': {
          pendingVerifications: [],
          verifications: [],
        },
      },
    };

    const newState = personalInfo(initialState, action);

    expect(newState).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_VERIFICATIONS when personalInfo is defined', () => {
    const initialState = {
      personalInfo: {
        'vye::UserInfo': {
          verifications: [],
        },
      },
    };

    const action = {
      type: 'UPDATE_VERIFICATIONS',
      payload: ['1'],
    };

    const expectedState = {
      personalInfo: {
        'vye::UserInfo': {
          verifications: ['1'],
        },
      },
    };

    const newState = personalInfo(initialState, action);

    expect(newState).to.deep.equal(expectedState);
  });
});
