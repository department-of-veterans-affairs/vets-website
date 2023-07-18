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
      expect(state.loading).to.be.true;
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
      expect(state.data).to.eq(payload);
      expect(state.error).to.be.false;
      expect(state.loading).to.be.false;
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_ERROR', () => {
    it('sets data, error: true, loading: false', () => {
      const payload = { errorMessage: 'it broke' };
      const action = { type: FETCH_ENROLLMENT_STATUS_ERROR, payload };
      const state = reducer(initialState, action);
      expect(state.data).to.eq(payload);
      expect(state.error).to.be.true;
      expect(state.loading).to.be.false;
    });
  });
});
