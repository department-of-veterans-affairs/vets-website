import { expect } from 'chai';
import compare from '../../reducers/compare';

describe('compare reducer', () => {
  it('should handle ADD_COMPARE_INSTITUTION when selected length is less than 3', () => {
    const initialState = {
      selected: [],
      search: {
        loaded: [],
        institutions: {},
      },
    };
    const action = {
      type: 'ADD_COMPARE_INSTITUTION',
      payload: {
        facilityCode: '123',
        // ...other fields
      },
    };
    const expectedState = {
      selected: ['123'],
      search: {
        loaded: ['123'],
        institutions: {
          '123': action.payload,
        },
      },
    };

    const newState = compare(initialState, action);
    expect(newState).to.deep.equal(expectedState);
  });

  it('should not modify state when selected length is 3 or more', () => {
    const initialState = {
      selected: ['123', '456', '789'],
      search: {
        loaded: ['123', '456', '789'],
        institutions: {
          '123': { facilityCode: '123' },
          '456': { facilityCode: '456' },
          '789': { facilityCode: '789' },
        },
      },
    };
    const action = {
      type: 'ADD_COMPARE_INSTITUTION',
      payload: {
        facilityCode: '101112',
      },
    };

    const newState = compare(initialState, action);
    expect(newState).to.deep.equal(initialState); // state should not change
  });

  it('should remove compare institution', () => {
    const initialState = {
      search: {
        loaded: ['123', '456', '789'],
        institutions: {
          '123': { facilityCode: '123' },
          '456': { facilityCode: '456' },
          '789': { facilityCode: '789' },
        },
      },
      details: {
        loaded: ['123', '456', '789'],
        institutions: {
          '123': { facilityCode: '123' },
          '456': { facilityCode: '456' },
          '789': { facilityCode: '789' },
        },
      },
      selected: ['123', '456', '789'],
    };

    const actions = {
      type: 'REMOVE_COMPARE_INSTITUTION',
      payload: '456',
    };

    const newState = compare(initialState, actions);
    expect(newState).to.deep.equal({
      search: {
        loaded: ['123', '789'],
        institutions: {
          '123': { facilityCode: '123' },
          '789': { facilityCode: '789' },
        },
      },
      details: {
        loaded: ['123', '789'],
        institutions: {
          '123': { facilityCode: '123' },
          '789': { facilityCode: '789' },
        },
      },
      selected: ['123', '789'],
    });
  });

  it('it should handle fetch compare failed correctly', () => {
    const initialState = {
      error: null,
      open: null,
    };

    const actions = {
      type: 'FETCH_COMPARE_FAILED',
      payload: 'Error Message',
    };

    const newState = compare(initialState, actions);
    expect(newState).to.deep.equal({
      error: 'Error Message',
      open: null,
    });
  });

  it('should handle update query params correctly', () => {
    const initialState = {
      selected: [],
    };
    const actions = {
      type: 'UPDATE_QUERY_PARAMS',
      payload: {
        facilities: 'facility1,facility2',
      },
    };
    const newState = {
      selected: ['facility1', 'facility2'],
    };
    const state = compare(initialState, actions);
    expect(state).to.deep.equal(newState);
  });
});
