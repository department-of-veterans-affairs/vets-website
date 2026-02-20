import { expect } from 'chai';

import hcaEnrollmentStatus, {
  ENROLLMENT_STATUS_ACTIONS,
  HCA_ENROLLMENT_STATUSES,
} from '../../reducers/hcaEnrollmentStatus';

describe('hcaEnrollmentStatus reducer', () => {
  const initialState = {
    applicationDate: null,
    enrollmentDate: null,
    preferredFacility: null,
    enrollmentStatus: null,
    enrollmentStatusEffectiveDate: null,
    dismissedNotificationDate: null,
    hasServerError: false,
    isLoadingApplicationStatus: false,
    isLoadingDismissedNotification: false,
    isUserInMVI: false,
    loginRequired: false,
    noESRRecordFound: false,
    showReapplyContent: false,
  };

  it('should return the initial state', () => {
    expect(hcaEnrollmentStatus(undefined, {})).to.deep.equal(initialState);
  });

  it('should return the current state for unknown action types', () => {
    const currentState = { ...initialState, enrollmentStatus: 'test' };
    expect(
      hcaEnrollmentStatus(currentState, { type: 'UNKNOWN_ACTION' }),
    ).to.deep.equal(currentState);
  });

  describe('FETCH_ENROLLMENT_STATUS_STARTED', () => {
    it('should set isLoadingApplicationStatus to true', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_STARTED,
      };
      const expectedState = {
        ...initialState,
        isLoadingApplicationStatus: true,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_SUCCEEDED', () => {
    it('should update state with enrollment data for enrolled status', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_SUCCEEDED,
        data: {
          parsedStatus: HCA_ENROLLMENT_STATUSES.enrolled,
          applicationDate: '2023-01-01',
          effectiveDate: '2023-02-01',
          enrollmentDate: '2023-01-15',
          preferredFacility: '123',
        },
      };
      const expectedState = {
        ...initialState,
        applicationDate: '2023-01-01',
        enrollmentDate: '2023-01-15',
        preferredFacility: '123',
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        enrollmentStatusEffectiveDate: '2023-02-01',
        hasServerError: false,
        isLoadingApplicationStatus: false,
        isUserInMVI: true,
        loginRequired: true,
        noESRRecordFound: false,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle noneOfTheAbove status correctly', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_SUCCEEDED,
        data: {
          parsedStatus: HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
          applicationDate: null,
          effectiveDate: null,
          enrollmentDate: null,
          preferredFacility: null,
        },
      };
      const expectedState = {
        ...initialState,
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
        hasServerError: false,
        isLoadingApplicationStatus: false,
        isUserInMVI: true,
        loginRequired: false,
        noESRRecordFound: true,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle pending status correctly', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_SUCCEEDED,
        data: {
          parsedStatus: HCA_ENROLLMENT_STATUSES.pendingMt,
          applicationDate: '2023-01-01',
          effectiveDate: '2023-02-01',
          enrollmentDate: null,
          preferredFacility: '456',
        },
      };
      const expectedState = {
        ...initialState,
        applicationDate: '2023-01-01',
        preferredFacility: '456',
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.pendingMt,
        enrollmentStatusEffectiveDate: '2023-02-01',
        hasServerError: false,
        isLoadingApplicationStatus: false,
        isUserInMVI: true,
        loginRequired: true,
        noESRRecordFound: false,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });
  });

  describe('FETCH_ENROLLMENT_STATUS_FAILED', () => {
    it('should handle 404 error (no ESR record found)', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_FAILED,
        errors: [{ code: '404' }],
      };
      const expectedState = {
        ...initialState,
        hasServerError: false,
        isLoadingApplicationStatus: false,
        loginRequired: false,
        noESRRecordFound: true,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle 429 error (rate limit)', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_FAILED,
        errors: [{ code: '429' }],
      };
      const expectedState = {
        ...initialState,
        hasServerError: false,
        isLoadingApplicationStatus: false,
        loginRequired: true,
        noESRRecordFound: false,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle other server errors', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_FAILED,
        errors: [{ code: '500' }],
      };
      const expectedState = {
        ...initialState,
        hasServerError: true,
        isLoadingApplicationStatus: false,
        loginRequired: false,
        noESRRecordFound: false,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle multiple errors with 404 taking precedence', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_FAILED,
        errors: [{ code: '429' }, { code: '404' }],
      };
      const expectedState = {
        ...initialState,
        hasServerError: false,
        isLoadingApplicationStatus: false,
        loginRequired: true,
        noESRRecordFound: true,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle no errors array', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_ENROLLMENT_STATUS_FAILED,
      };
      const expectedState = {
        ...initialState,
        hasServerError: true,
        isLoadingApplicationStatus: false,
        loginRequired: false,
        noESRRecordFound: false,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });
  });

  describe('RESET_ENROLLMENT_STATUS', () => {
    it('should reset to initial state', () => {
      const modifiedState = {
        ...initialState,
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        hasServerError: true,
        isLoadingApplicationStatus: true,
        loginRequired: true,
      };
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.RESET_ENROLLMENT_STATUS,
      };
      expect(hcaEnrollmentStatus(modifiedState, action)).to.deep.equal(
        initialState,
      );
    });
  });

  describe('FETCH_DISMISSED_HCA_NOTIFICATION_STARTED', () => {
    it('should set isLoadingDismissedNotification to true', () => {
      const action = {
        type:
          ENROLLMENT_STATUS_ACTIONS.FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
      };
      const expectedState = {
        ...initialState,
        isLoadingDismissedNotification: true,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });
  });

  describe('FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED', () => {
    it('should update dismissedNotificationDate and set loading to false', () => {
      const action = {
        type:
          ENROLLMENT_STATUS_ACTIONS.FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
        response: {
          data: {
            attributes: {
              statusEffectiveAt: '2023-12-01T00:00:00.000Z',
            },
          },
        },
      };
      const expectedState = {
        ...initialState,
        dismissedNotificationDate: '2023-12-01T00:00:00.000Z',
        isLoadingDismissedNotification: false,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });
  });

  describe('FETCH_DISMISSED_HCA_NOTIFICATION_FAILED', () => {
    it('should set isLoadingDismissedNotification to false', () => {
      const modifiedState = {
        ...initialState,
        isLoadingDismissedNotification: true,
      };
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
      };
      const expectedState = {
        ...initialState,
        isLoadingDismissedNotification: false,
      };
      expect(hcaEnrollmentStatus(modifiedState, action)).to.deep.equal(
        expectedState,
      );
    });
  });

  describe('SET_DISMISSED_HCA_NOTIFICATION', () => {
    it('should set dismissedNotificationDate to the provided data', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.SET_DISMISSED_HCA_NOTIFICATION,
        data: '2023-12-01T00:00:00.000Z',
      };
      const expectedState = {
        ...initialState,
        dismissedNotificationDate: '2023-12-01T00:00:00.000Z',
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });
  });

  describe('SHOW_HCA_REAPPLY_CONTENT', () => {
    it('should set showReapplyContent to true', () => {
      const action = {
        type: ENROLLMENT_STATUS_ACTIONS.SHOW_HCA_REAPPLY_CONTENT,
      };
      const expectedState = {
        ...initialState,
        showReapplyContent: true,
      };
      expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
        expectedState,
      );
    });
  });
});
