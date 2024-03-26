import { expect } from 'chai';
import getDataReducer from '../../reducers/getData';
import { GET_DATA, GET_DATA_SUCCESS } from '../../actions';

const initialState = {
  loading: false,
  data: null,
};

describe('getDataReducer', () => {
  it('should return initialState when unknown action is provided', () => {
    const unknownAction = { type: 'UNKOWN' };
    expect(getDataReducer(undefined, unknownAction)).to.deep.equal(
      initialState,
    );
  });
  it('should handles GET_DATA action', () => {
    const action = { type: GET_DATA };
    const newState = {
      ...initialState,
      loading: true,
    };
    expect(getDataReducer(undefined, action)).to.deep.equal(newState);
  });
  it('should handles GET_DATA_SUCCESS action', () => {
    const mockData = {
      'vye::UserInfo': {
        suffix: 'CPA',
        fullName: 'Ben Simonis MD',
        addressLine2: 'Apt. 116',
        addressLine3: 'Park Crossing',
        addressLine4: 'Leanneside',
        addressLine5: 'Montana',
        addressLine6: '03729-2762',
        zip: '46786-3217',
        remEnt: '022025',
      },
    };
    const action = { type: GET_DATA_SUCCESS, response: mockData };
    const newState = {
      ...initialState,
      loading: false,
      data: mockData,
    };
    expect(getDataReducer(undefined, action)).to.deep.equal(newState);
  });
  it('should handle UPDATE_PENDING_VERIFICATIONS', () => {
    const state = {
      data: {
        'vye::UserInfo': {
          pendingVerifications: [],
        },
      },
    };

    const action = {
      type: 'UPDATE_PENDING_VERIFICATIONS',
      payload: ['1'],
    };

    const expectedState = {
      data: {
        'vye::UserInfo': {
          pendingVerifications: ['1'],
        },
      },
    };

    const newState = getDataReducer(state, action);

    expect(newState).to.deep.equal(expectedState);
  });
  it('should handle UPDATE_VERIFICATIONS', () => {
    const state = {
      data: {
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
      data: {
        'vye::UserInfo': {
          verifications: ['1'],
        },
      },
    };

    const newState = getDataReducer(state, action);

    expect(newState).to.deep.equal(expectedState);
  });
});
