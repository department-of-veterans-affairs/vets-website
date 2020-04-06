import {
  FETCH_FACILITY_FAILED,
  FETCH_FACILITY_STARTED,
  FETCH_FACILITY_SUCCESS,
} from '../../facilities/actions';
import { facilityReducer as reducer } from '../../facilities/reducers';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';

describe('Facility Reducer', () => {
  let state;
  let reducedState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('FETCH_FACILITY_STARTED', () => {
    test('sets the `isLoading` to `true`', () => {
      action = {
        type: FETCH_FACILITY_STARTED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.loading).toBe(true);
    });
  });

  describe('FETCH_FACILITY_SUCCESS', () => {
    test('sets the state correctly', () => {
      action = {
        type: FETCH_FACILITY_SUCCESS,
        facility: mockFacilityLocatorApiResponse.data[0],
      };
      reducedState = reducer(state, action);
      expect(reducedState.data.id).toBe(action.facility.id);
      expect(reducedState.loading).toBe(false);
      expect(reducedState.error).toBe(false);
    });

    describe('FETCH_FACILITY_FAILED', () => {
      describe('regardless of the error codes', () => {
        test('sets the state correctly', () => {
          action = {
            type: FETCH_FACILITY_FAILED,
            errors: [{ code: '400' }],
          };
          reducedState = reducer(state, action);

          expect(reducedState.error).toBe(true);
          expect(reducedState.loading).toBe(false);
          expect(!Object.keys(reducedState.data)).toBe(false);
        });
      });
    });
  });
});
