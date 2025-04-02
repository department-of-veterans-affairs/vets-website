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

  const UPDATE_COMPARE_DETAILS = 'UPDATE_COMPARE_DETAILS';

  const mockActionPayload = [
    {
      attributes: {
        facilityCode: 'FAC001',
        name: 'Institution 1',
      },
    },
    {
      attributes: {
        facilityCode: 'FAC002',
        name: 'Institution 2',
      },
    },
  ];

  const initialState = {
    search: {
      loaded: [],
      institutions: {},
    },
    details: {
      loaded: [],
      institutions: {},
    },
    selected: [],
  };
  describe('reducer for UPDATE_COMPARE_DETAILS', () => {
    it('should update the state with details from the action payload', () => {
      const action = {
        type: UPDATE_COMPARE_DETAILS,
        payload: mockActionPayload,
      };

      const expectedLoadedCodes = mockActionPayload.map(
        item => item.attributes.facilityCode,
      );
      const newState = compare(initialState, action);
      expect(newState.search.loaded).to.deep.equal(expectedLoadedCodes);
      expect(newState.details.loaded).to.deep.equal(expectedLoadedCodes);
      mockActionPayload.forEach(item => {
        const code = item.attributes.facilityCode;
        expect(newState.search.institutions).to.have.property(code);
        expect(newState.search.institutions[code].name).to.equal(
          item.attributes.name,
        );
        expect(newState.details.institutions).to.have.property(code);
        expect(newState.details.institutions[code]).to.include(item.attributes);
        expect(newState.details.institutions[code].feesAndTuition).to.be.a(
          'number',
        );
        expect(
          newState.details.institutions[code].feesAndTuition,
        ).to.be.at.least(10000);
        expect(newState.details.institutions[code].feesAndTuition).to.be.below(
          20000,
        );
      });
      expect(newState.error).to.be.null;
    });
  });
  it('should update selected facilities when facilities exist in payload', () => {
    const initialState2 = { selected: [] };

    const action = {
      type: 'UPDATE_QUERY_PARAMS',
      payload: { facilities: 'facility1,facility2,facility3' },
    };

    const expectedState = { selected: ['facility1', 'facility2', 'facility3'] };

    const newState = compare(initialState2, action);
    expect(newState).to.deep.equal(expectedState);
  });

  it('should not modify state when facilities are not in payload', () => {
    const initialState2 = { selected: ['facility1'] };

    const action = { type: 'UPDATE_QUERY_PARAMS', payload: {} };

    const newState = compare(initialState2, action);
    expect(newState).to.deep.equal(initialState2);
  });
});
