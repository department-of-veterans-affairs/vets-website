import { expect } from 'chai';
import {
  FETCH_HCA_ENROLLMENT_STATUS_FAILED,
  FETCH_HCA_ENROLLMENT_STATUS_STARTED,
  FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED,
} from '../../actions/hca-es';
import {
  initialState,
  hcaEnrollmentStatusReducer as reducer,
} from '../../reducers/hca-es';

describe('HCA Enrollment Status reducer', () => {
  describe('FETCH_HCA_ENROLLMENT_STATUS_STARTED', () => {
    it('sets loading: true', () => {
      const action = { type: FETCH_HCA_ENROLLMENT_STATUS_STARTED };
      const state = reducer(initialState, action);
      expect(state.loading).to.be.true;
    });
  });

  describe('FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED', () => {
    it('sets data, error: false, loading: false', () => {
      const payload = {
        effectiveDate: '2019-01-02T21:58:55.000-06:00',
        priorityGroup: 'Group 8G',
      };
      const action = { type: FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED, payload };
      const state = reducer(initialState, action);
      expect(state.data).to.eq(payload);
      expect(state.error).to.be.false;
      expect(state.loading).to.be.false;
    });
  });

  describe('FETCH_HCA_ENROLLMENT_STATUS_FAILED', () => {
    it('sets data, error: true, loading: false', () => {
      const payload = { errorMessage: 'it broke' };
      const action = { type: FETCH_HCA_ENROLLMENT_STATUS_FAILED, payload };
      const state = reducer(initialState, action);
      expect(state.data).to.eq(payload);
      expect(state.error).to.be.true;
      expect(state.loading).to.be.false;
    });
  });

  describe('some other action type', () => {
    it('does not change state', () => {
      const payload = { some: 'object' };
      const action = { type: 'OTHER_ACTION_TYPE', payload };
      const state = reducer(initialState, action);
      expect(state).to.deep.equal(initialState);
    });
  });
});
