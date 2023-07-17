import { expect } from 'chai';
import {
  FETCH_ENROLLMENT_STATUS_FAILED,
  FETCH_ENROLLMENT_STATUS_STARTED,
  FETCH_ENROLLMENT_STATUS_SUCCEEDED,
} from '../actions';
import { initialState, enrollmentStatusReducer as reducer } from './index';

describe('Enrollment Status Reducer', () => {
  describe('FETCH_ENROLLMENT_STATUS_STARTED', () => {
    it('sets loading', () => {
      const action = { type: FETCH_ENROLLMENT_STATUS_STARTED };
      const state = reducer(initialState, action);
      expect(state.loading).to.be.true;
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_SUCCEEDED', () => {
    it('sets loading: false, error: false, data', () => {
      const data = {
        effectiveDate: '2019-01-02T21:58:55.000-06:00',
        priorityGroup: 'Group 8G',
      };
      const action = { type: FETCH_ENROLLMENT_STATUS_SUCCEEDED, data };
      const state = reducer(initialState, action);
      expect(state.loading).to.be.false;
      expect(state.error).to.be.false;
      expect(state.data).to.eq(data);
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_FAILED', () => {
    it('sets loading: false, error: false, data', () => {
      const action = { type: FETCH_ENROLLMENT_STATUS_FAILED };
      const state = reducer(initialState, action);
      expect(state.loading).to.be.false;
      expect(state.error).to.be.true;
      expect(state.data).to.be.empty;
    });
  });
});
