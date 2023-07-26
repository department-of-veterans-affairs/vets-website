import { expect } from 'chai';
import {
  FETCH_ENROLLMENT_STATUS_BEGIN,
  FETCH_ENROLLMENT_STATUS_ERROR,
  FETCH_ENROLLMENT_STATUS_SUCCESS,
} from '../actions';
import { initialState, enrollmentStatusReducer as reducer } from './index';

describe('Enrollment Status Reducer', () => {
  describe('FETCH_ENROLLMENT_STATUS_BEGIN', () => {
    it('sets loading: true', () => {
      const action = { type: FETCH_ENROLLMENT_STATUS_BEGIN };
      const state = reducer(initialState, action);
      expect(state.priorityGroup.loading).to.be.true;
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_SUCCESS', () => {
    it('sets data, error: false, loading: false', () => {
      const payload = {
        effectiveDate: '2019-01-02T21:58:55.000-06:00',
        priorityGroup: 'Group 8G',
      };
      const action = { type: FETCH_ENROLLMENT_STATUS_SUCCESS, payload };
      const state = reducer(initialState, action);
      expect(state.priorityGroup.data).to.eq(payload);
      expect(state.priorityGroup.error).to.be.false;
      expect(state.priorityGroup.loading).to.be.false;
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_ERROR', () => {
    it('sets data, error: true, loading: false', () => {
      const payload = { errorMessage: 'it broke' };
      const action = { type: FETCH_ENROLLMENT_STATUS_ERROR, payload };
      const state = reducer(initialState, action);
      expect(state.priorityGroup.data).to.eq(payload);
      expect(state.priorityGroup.error).to.be.true;
      expect(state.priorityGroup.loading).to.be.false;
    });
  });

  describe('some other action type', () => {
    it('does not change state', () => {
      const payload = { some: 'object' };
      const action = { type: 'OTHER_ACTION_TYPE', payload };
      const state = reducer(initialState, action);
      expect(state.priorityGroup).to.deep.equal(initialState.priorityGroup);
    });
  });
});
