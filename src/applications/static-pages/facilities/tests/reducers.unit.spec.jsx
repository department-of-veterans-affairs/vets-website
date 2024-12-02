import { expect } from 'chai';

import {
  FETCH_FACILITY_FAILED,
  FETCH_FACILITY_STARTED,
  FETCH_FACILITY_SUCCESS,
} from '../actions';
import { facilityReducer as reducer } from '../reducers';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';

describe('Facility Reducer', () => {
  let state;
  let reducedState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('FETCH_FACILITY_STARTED', () => {
    it('sets the `isLoading` to `true`', () => {
      action = {
        type: FETCH_FACILITY_STARTED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.true;
    });
  });

  describe('FETCH_FACILITY_SUCCESS', () => {
    it('sets the state correctly', () => {
      action = {
        type: FETCH_FACILITY_SUCCESS,
        facility: mockFacilityLocatorApiResponse.data[0],
      };
      reducedState = reducer(state, action);
      expect(reducedState.data.id).to.equal(action.facility.id);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.error).to.be.false;
    });

    describe('FETCH_FACILITY_FAILED', () => {
      describe('regardless of the error codes', () => {
        it('sets the state correctly', () => {
          action = {
            type: FETCH_FACILITY_FAILED,
            errors: [{ code: '400' }],
          };
          reducedState = reducer(state, action);

          expect(reducedState.error).to.be.true;
          expect(reducedState.loading).to.be.false;
          expect(!Object.keys(reducedState.data)).to.be.false;
        });
      });
    });
  });
});
