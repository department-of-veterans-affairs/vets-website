import { expect } from 'chai';

import { ENROLLMENT_STATUS_ACTIONS } from '../../../utils/constants';
import reducer from '../../../reducers/enrollment-status';

describe('hca EnrollmentStatus reducer', () => {
  let state;
  let reducedState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('default behavior', () => {
    it('should return the initial state', () => {
      action = {};
      reducedState = reducer(state, action);
      expect(reducedState.applicationDate).to.be.null;
      expect(reducedState.enrollmentDate).to.be.null;
      expect(reducedState.preferredFacility).to.be.null;
      expect(reducedState.enrollmentStatus).to.be.null;
      expect(reducedState.enrollmentStatusEffectiveDate).to.be.null;
      expect(reducedState.isUserInMVI).to.be.false;
      expect(reducedState.loginRequired).to.be.false;
      expect(reducedState.noESRRecordFound).to.be.false;
      expect(reducedState.showReapplyContent).to.be.false;
      expect(reducedState.hasServerError).to.be.false;
      expect(reducedState.isLoadingApplicationStatus).to.be.false;
      expect(reducedState.isLoadingDismissedNotification).to.be.false;
    });
  });

  describe('when the action type is not a match', () => {
    it('should return the initial state', () => {
      action = { type: '@@INIT' };
      reducedState = reducer(state, action);
      expect(reducedState.applicationDate).to.be.null;
      expect(reducedState.enrollmentDate).to.be.null;
      expect(reducedState.preferredFacility).to.be.null;
      expect(reducedState.enrollmentStatus).to.be.null;
      expect(reducedState.enrollmentStatusEffectiveDate).to.be.null;
      expect(reducedState.isUserInMVI).to.be.false;
      expect(reducedState.loginRequired).to.be.false;
      expect(reducedState.noESRRecordFound).to.be.false;
      expect(reducedState.showReapplyContent).to.be.false;
      expect(reducedState.hasServerError).to.be.false;
      expect(reducedState.isLoadingApplicationStatus).to.be.false;
      expect(reducedState.isLoadingDismissedNotification).to.be.false;
    });
  });

  describe('when `FETCH_ENROLLMENT_STATUS_STARTED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_STARTED } = ENROLLMENT_STATUS_ACTIONS;
    it('should set `isLoadingApplicationStatus` to `true`', () => {
      action = {
        type: FETCH_ENROLLMENT_STATUS_STARTED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isLoadingApplicationStatus).to.be.true;
    });
  });

  describe('when `FETCH_ENROLLMENT_STATUS_SUCCEEDED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_SUCCEEDED } = ENROLLMENT_STATUS_ACTIONS;
    describe('when `parsedStatus` contains any value', () => {
      it('should set the state correctly', () => {
        action = {
          type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
          data: {
            parsedStatus: 'enrolled',
            effectiveDate: '2019-01-02T21:58:55.000-06:00',
            applicationDate: '2018-12-27T00:00:00.000-06:00',
            enrollmentDate: '2018-12-27T17:15:39.000-06:00',
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
        expect(reducedState.enrollmentStatusEffectiveDate).to.equal(
          action.data.effectiveDate,
        );
        expect(reducedState.preferredFacility).to.equal(
          action.data.preferredFacility,
        );
        expect(reducedState.isLoadingApplicationStatus).to.be.false;
        expect(reducedState.isUserInMVI).to.be.true;
      });
    });

    describe('when `parsedStatus` is `none_of_the_above`', () => {
      beforeEach(() => {
        action = {
          type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
          data: {
            parsedStatus: 'none_of_the_above',
          },
        };
        reducedState = reducer(state, action);
      });
      it('should set `loginRequired` to `false`', () => {
        expect(reducedState.loginRequired).to.be.false;
      });
      it('should set `noESRRecordFound` to `true`', () => {
        expect(reducedState.noESRRecordFound).to.be.true;
      });
    });

    describe('when `parsedStatus` is anything other than `none_of_the_above`', () => {
      beforeEach(() => {
        action = {
          type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
          data: {
            parsedStatus: 'enrolled',
          },
        };
        reducedState = reducer(state, action);
      });
      it('should set `loginRequired` to `true`', () => {
        expect(reducedState.loginRequired).to.be.true;
      });
      it('should set `noESRRecordFound` to `false`', () => {
        expect(reducedState.noESRRecordFound).to.be.false;
      });
    });
  });

  describe('when `FETCH_ENROLLMENT_STATUS_FAILED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_FAILED } = ENROLLMENT_STATUS_ACTIONS;
    describe('when the error code is 404', () => {
      it('should set `noESRRecordFound` to `true` and `hasServerError` to `false`', () => {
        action = {
          type: FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '404' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.noESRRecordFound).to.be.true;
        expect(reducedState.hasServerError).to.be.false;
        expect(reducedState.loginRequired).to.be.false;
        expect(reducedState.isLoadingApplicationStatus).to.be.false;
      });
    });

    describe('when the error code is 429', () => {
      it('should set `loginRequired` to `true` and `hasServerError` to `false`', () => {
        action = {
          type: FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '429' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.loginRequired).to.be.true;
        expect(reducedState.noESRRecordFound).to.be.false;
        expect(reducedState.hasServerError).to.be.false;
        expect(reducedState.isLoadingApplicationStatus).to.be.false;
      });
    });

    describe('when the error code is >=500', () => {
      it('should set `hasServerError` to `true`', () => {
        action = {
          type: FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '500' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.hasServerError).to.be.true;
        expect(reducedState.loginRequired).to.be.false;
        expect(reducedState.noESRRecordFound).to.be.false;
        expect(reducedState.isLoadingApplicationStatus).to.be.false;
      });
    });

    describe('when the error code cannot be determined', () => {
      it('should set `hasServerError` to `true`', () => {
        action = {
          type: FETCH_ENROLLMENT_STATUS_FAILED,
          errors: null,
        };
        reducedState = reducer(state, action);
        expect(reducedState.hasServerError).to.be.true;
        expect(reducedState.isLoadingApplicationStatus).to.be.false;
      });
    });
  });

  describe('when `RESET_ENROLLMENT_STATUS` executes', () => {
    const { RESET_ENROLLMENT_STATUS } = ENROLLMENT_STATUS_ACTIONS;
    it('should reset enrollment data', () => {
      action = {
        type: RESET_ENROLLMENT_STATUS,
      };
      reducedState = reducer(state, action);
      expect(reducedState.applicationDate).to.be.null;
      expect(reducedState.enrollmentDate).to.be.null;
      expect(reducedState.preferredFacility).to.be.null;
      expect(reducedState.enrollmentStatus).to.be.null;
      expect(reducedState.enrollmentStatusEffectiveDate).to.be.null;
    });

    it('should reset user lookup values', () => {
      action = {
        type: RESET_ENROLLMENT_STATUS,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isUserInMVI).to.be.false;
      expect(reducedState.loginRequired).to.be.false;
      expect(reducedState.noESRRecordFound).to.be.false;
      expect(reducedState.showReapplyContent).to.be.false;
    });

    it('should reset loading and error values', () => {
      action = {
        type: RESET_ENROLLMENT_STATUS,
      };
      reducedState = reducer(state, action);
      expect(reducedState.hasServerError).to.be.false;
      expect(reducedState.isLoadingApplicationStatus).to.be.false;
      expect(reducedState.isLoadingDismissedNotification).to.be.false;
    });
  });

  describe('when `FETCH_DISMISSED_HCA_NOTIFICATION_STARTED` executes', () => {
    const {
      FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
    } = ENROLLMENT_STATUS_ACTIONS;
    it('should set `isLoadingDismissedNotification` to `true`', () => {
      state = { isLoadingDismissedNotification: false };
      action = {
        type: FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isLoadingDismissedNotification).to.be.true;
    });
  });

  describe('when `FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED` executes', () => {
    const {
      FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
    } = ENROLLMENT_STATUS_ACTIONS;
    it('should set the state correctly', () => {
      state = {
        isLoadingDismissedNotification: true,
        dismissedNotificationDate: null,
      };
      action = {
        type: FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
        response: {
          data: {
            attributes: {
              subject: 'form_10_10ez',
              status: 'pending_mt',
              statusEffectiveAt: '2019-02-25T01:22:00.000Z',
              readAt: '2019-02-26T21:20:50.151Z',
            },
          },
        },
      };
      reducedState = reducer(state, action);
      expect(reducedState.isLoadingDismissedNotification).to.be.false;
      expect(reducedState.dismissedNotificationDate).to.equal(
        '2019-02-25T01:22:00.000Z',
      );
    });
  });

  describe('when `FETCH_DISMISSED_HCA_NOTIFICATION_FAILED` executes', () => {
    const {
      FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
    } = ENROLLMENT_STATUS_ACTIONS;
    it('should set `isLoadingDismissedNotification` to `false`', () => {
      state = {
        isLoadingDismissedNotification: true,
      };
      action = {
        type: FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isLoadingDismissedNotification).to.be.false;
    });
  });

  describe('when `SHOW_HCA_REAPPLY_CONTENT` executes', () => {
    const { SHOW_HCA_REAPPLY_CONTENT } = ENROLLMENT_STATUS_ACTIONS;
    it('should set `showReapplyContent` to `true`', () => {
      action = {
        type: SHOW_HCA_REAPPLY_CONTENT,
      };
      reducedState = reducer(state, action);
      expect(reducedState.showReapplyContent).to.be.true;
    });
  });
});
