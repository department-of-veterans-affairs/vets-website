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
    it('sets the `isLoadingApplicationStatus` to `true`', () => {
      action = {
        type: actions.FETCH_ENROLLMENT_STATUS_STARTED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isLoadingApplicationStatus).toBe(true);
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_SUCCEEDED', () => {
    describe('regardless of `parsedStatus`', () => {
      it('sets the state correctly', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_SUCCEEDED,
          data: {
            parsedStatus: 'enrolled',
            effectiveDate: '2019-01-02T21:58:55.000-06:00',
            applicationDate: '2018-12-27T00:00:00.000-06:00',
            enrollmentDate: '2018-12-27T17:15:39.000-06:00',
            preferredFacility: '123 - ABC',
          },
        };
        reducedState = reducer(state, action);
        expect(reducedState.enrollmentStatus).toBe(action.data.parsedStatus);
        expect(reducedState.applicationDate).toBe(action.data.applicationDate);
        expect(reducedState.enrollmentDate).toBe(action.data.enrollmentDate);
        expect(reducedState.enrollmentStatusEffectiveDate).toBe(
          action.data.effectiveDate,
        );
        expect(reducedState.preferredFacility).toBe(
          action.data.preferredFacility,
        );
        expect(reducedState.isLoadingApplicationStatus).toBe(false);
        expect(reducedState.isUserInMVI).toBe(true);
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
        expect(reducedState.loginRequired).toBe(false);
      });
      it('sets `noESRRecordFound` to `true`', () => {
        expect(reducedState.noESRRecordFound).toBe(true);
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
        expect(reducedState.loginRequired).toBe(true);
      });
      it('sets `noESRRecordFound` to `false`', () => {
        expect(reducedState.noESRRecordFound).toBe(false);
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
        expect(reducedState.hasServerError).toBe(false);
        expect(reducedState.isLoadingApplicationStatus).toBe(false);
        expect(reducedState.loginRequired).toBe(false);
        expect(reducedState.noESRRecordFound).toBe(false);
      });
    });

    describe('if the error code if 404', () => {
      it('sets `noESRRecordFound` to `true`', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '404' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.noESRRecordFound).toBe(true);
      });
    });

    describe('if the error code is 429', () => {
      it('sets `loginRequired` to `true`', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '429' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.loginRequired).toBe(true);
      });
    });

    describe('if the error code is >=500', () => {
      it('sets `hasServerError` to `true`', () => {
        action = {
          type: actions.FETCH_ENROLLMENT_STATUS_FAILED,
          errors: [{ code: '500' }],
        };
        reducedState = reducer(state, action);
        expect(reducedState.hasServerError).toBe(true);
      });
    });
  });

  describe('SHOW_HCA_REAPPLY_CONTENT', () => {
    it('sets `showHCAReapplyContent` to `true`', () => {
      action = {
        type: actions.SHOW_HCA_REAPPLY_CONTENT,
      };
      reducedState = reducer(state, action);
      expect(reducedState.showHCAReapplyContent).toBe(true);
    });
  });

  describe('FETCH_DISMISSED_HCA_NOTIFICATION_STARTED', () => {
    it('sets `isLoadingDismissedNotification` to `true`', () => {
      state = { isLoadingDismissedNotification: false };
      action = {
        type: actions.FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isLoadingDismissedNotification).toBe(true);
    });
  });

  describe('FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED', () => {
    it('sets the state correctly', () => {
      state = {
        isLoadingDismissedNotification: true,
        dismissedNotificationDate: null,
      };
      action = {
        type: actions.FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
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
      expect(reducedState.isLoadingDismissedNotification).toBe(false);
      expect(reducedState.dismissedNotificationDate).toBe(
        '2019-02-25T01:22:00.000Z',
      );
    });
  });

  describe('FETCH_DISMISSED_HCA_NOTIFICATION_FAILED', () => {
    it('sets `isLoadingDismissedNotification` to `false`', () => {
      state = {
        isLoadingDismissedNotification: true,
      };
      action = {
        type: actions.FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isLoadingDismissedNotification).toBe(false);
    });
  });
});
