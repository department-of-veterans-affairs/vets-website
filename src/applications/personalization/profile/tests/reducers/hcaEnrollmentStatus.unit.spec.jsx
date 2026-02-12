import { expect } from 'chai';

import hcaEnrollmentStatus from '../../reducers/hcaEnrollmentStatus';

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

  it('should handle FETCH_ENROLLMENT_STATUS_STARTED', () => {
    const action = { type: 'FETCH_ENROLLMENT_STATUS_STARTED' };
    const expectedState = {
      ...initialState,
      isLoadingApplicationStatus: true,
    };
    expect(hcaEnrollmentStatus(initialState, action)).to.deep.equal(
      expectedState,
    );
  });
});
