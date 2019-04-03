import { expect } from 'chai';

import * as actions from '../actions';
import { hcaEnrollmentStatus as reducer } from '../reducer';

describe('HCA Enrollment Status Reducer', () => {
  let state;
  let reducedState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('FETCH_ENROLLMENT_STATUS_STARTED', () => {
    it('sets the `isLoading` to `true`', () => {
      action = {
        type: actions.FETCH_ENROLLMENT_STATUS_STARTED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isLoading).to.be.true;
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_SUCCEEDED', () => {
    describe('regardless of `parsedStatus`', () => {
      it('sets the state correctly', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_SUCCEEDED,
          data: {
            parsedStatus: 'enrolled',
            applicationDate: 'application date',
            enrollmentData: 'enrollment data',
            preferredFacility: '123 - ABC',
          },
        };
        reducedState = reducer(state, action);
        expect(reducedState.enrollmentStatus).to.equal(
          action.data.parsedStatus,
        );
        expect(reducedState.applicationDate).to.equal(
          action.data.applicationDate,
        );
        expect(reducedState.enrollmentDate).to.equal(
          action.data.enrollmentDate,
        );
        expect(reducedState.preferredFacility).to.equal(
          action.data.preferredFacility,
        );
        expect(reducedState.isLoading).to.be.false;
        expect(reducedState.isUserInMVI).to.be.true;
      });
    });

    describe('if `parsedStatus` is `none_of_the_above`', () => {
      beforeEach(() => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_SUCCEEDED,
          data: {
            parsedStatus: 'none_of_the_above',
          },
        };
        reducedState = reducer(state, action);
      });
      it('sets `loginRequired` to `false`', () => {
        expect(reducedState.loginRequired).to.be.false;
      });
      it('sets `noESRRecordFound` to `true`', () => {
        expect(reducedState.noESRRecordFound).to.be.true;
      });
    });

    describe('if `parsedStatus` is anything other than `none_of_the_above`', () => {
      beforeEach(() => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_SUCCEEDED,
          data: {
            parsedStatus: 'enrolled',
          },
        };
        reducedState = reducer(state, action);
      });
      it('sets `loginRequired` to `true`', () => {
        expect(reducedState.loginRequired).to.be.true;
      });
      it('sets `noESRRecordFound` to `false`', () => {
        expect(reducedState.noESRRecordFound).to.be.false;
      });
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_FAILED', () => {
    describe('regardless of the error codes', () => {
      it('sets the state correctly', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '400' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.hasServerError).to.be.false;
        expect(reducedState.isLoading).to.be.false;
        expect(reducedState.loginRequired).to.be.false;
        expect(reducedState.noESRRecordFound).to.be.false;
      });
    });

    describe('if the error code if 404', () => {
      it('sets `noESRRecordFound` to `true`', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '404' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.noESRRecordFound).to.be.true;
      });
    });

    describe('if the error code is 429', () => {
      it('sets `loginRequired` to `true`', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '429' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.loginRequired).to.be.true;
      });
    });

    describe('if the error code is >=500', () => {
      it('sets `hasServerError` to `true`', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '500' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.hasServerError).to.be.true;
      });
    });
  });

  describe('SHOW_HCA_REAPPLY_CONTENT', () => {
    it('sets `showHCAReapplyContent` to `true`', () => {
      action = {
        type: actions.SHOW_HCA_REAPPLY_CONTENT,
      };
      reducedState = reducer(state, action);
      expect(reducedState.showHCAReapplyContent).to.be.true;
    });
  });
});
