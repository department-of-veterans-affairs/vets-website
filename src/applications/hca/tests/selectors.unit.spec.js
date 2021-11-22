import { expect } from 'chai';
import * as selectors from '../selectors';
import { HCA_ENROLLMENT_STATUSES } from '../constants';

const basicEnrollmentStatusState = {
  applicationDate: null,
  enrollmentDate: null,
  preferredFacility: null,
  enrollmentStatus: null,
  hasServerError: false,
  isLoadingApplicationStatus: false,
  isLoadingDismissedNotification: false,
  isUserInMVI: false,
  loginRequired: false,
  noESRRecordFound: false,
  showHCAReapplyContent: false,
};
const loggedOutUserState = {
  login: {
    currentlyLoggedIn: false,
  },
  profile: {
    loa: {
      current: null,
      highest: null,
    },
    verified: false,
    loading: false,
  },
};
const loadingUserState = {
  login: {
    currentlyLoggedIn: false,
  },
  profile: {
    loa: {
      current: null,
      highest: null,
    },
    verified: false,
    loading: true,
  },
};
const LOA3UserState = {
  login: {
    currentlyLoggedIn: true,
  },
  profile: {
    loa: {
      current: 3,
      highest: 3,
    },
    verified: true,
    loading: false,
    status: 'OK',
  },
};
const LOA1UserState = {
  login: {
    currentlyLoggedIn: true,
  },
  profile: {
    loa: {
      current: 1,
      highest: 1,
    },
    verified: true,
    loading: false,
  },
};
describe('simple top-level selectors', () => {
  describe('isLoggedOut', () => {
    it('is `true` if the profile is not loading and the user is not logged in', () => {
      const state = {
        user: { ...loggedOutUserState },
      };
      const isLoggedOut = selectors.isLoggedOut(state);
      expect(isLoggedOut).to.be.true;
    });
    it('is `false` if the profile is loading', () => {
      const state = {
        user: { ...loadingUserState },
      };
      const isLoggedOut = selectors.isLoggedOut(state);
      expect(isLoggedOut).to.be.false;
    });
    it('is `false` if the profile is not loading and the user is logged in', () => {
      const state = {
        user: { ...LOA3UserState },
      };
      const isLoggedOut = selectors.isLoggedOut(state);
      expect(isLoggedOut).to.be.false;
    });
  });

  describe('selectEnrollmentStatus', () => {
    it('selects the correct part of the state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...loggedOutUserState },
      };
      const enrollmentStatus = selectors.selectEnrollmentStatus(state);
      expect(enrollmentStatus).to.deep.equal(basicEnrollmentStatusState);
    });
  });

  describe('isEnrollmentStatusLoading', () => {
    it('returns the correct part of the enrollment status state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      let isLoading = selectors.isEnrollmentStatusLoading(state);
      expect(isLoading).to.equal(false);
      state.hcaEnrollmentStatus.isLoadingApplicationStatus = true;
      isLoading = selectors.isEnrollmentStatusLoading(state);
      expect(isLoading).to.equal(true);
    });
  });

  describe('hasServerError', () => {
    it('returns the correct part of the enrollment status state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      let hasServerError = selectors.hasServerError(state);
      expect(hasServerError).to.equal(false);
      state.hcaEnrollmentStatus.hasServerError = true;
      hasServerError = selectors.hasServerError(state);
      expect(hasServerError).to.equal(true);
    });
  });

  describe('noESRRecordFound', () => {
    it('returns the correct part of the enrollment status state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      let noESRRecordFound = selectors.noESRRecordFound(state);
      expect(noESRRecordFound).to.equal(false);
      state.hcaEnrollmentStatus.noESRRecordFound = true;
      noESRRecordFound = selectors.noESRRecordFound(state);
      expect(noESRRecordFound).to.equal(true);
    });
  });

  describe('isShowingHCAReapplyContent', () => {
    it('returns the correct part of the enrollment status state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      let isShowingHCAReapplyContent = selectors.isShowingHCAReapplyContent(
        state,
      );
      expect(isShowingHCAReapplyContent).to.equal(false);
      state.hcaEnrollmentStatus.showHCAReapplyContent = true;
      isShowingHCAReapplyContent = selectors.isShowingHCAReapplyContent(state);
      expect(isShowingHCAReapplyContent).to.equal(true);
    });
  });

  describe('isEnrolledInESR', () => {
    it('returns `false` if the enrollmentStatus is not set', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      const isEnrolledInESR = selectors.isEnrolledInESR(state);
      expect(isEnrolledInESR).to.be.false;
    });
    it('returns `false` if the enrollmentStatus is not enrolled', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.pendingOther,
        },
      };
      const isEnrolledInESR = selectors.isEnrolledInESR(state);
      expect(isEnrolledInESR).to.be.false;
    });
    it('returns `true` if the enrollmentStatus is enrolled', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        },
      };
      const isEnrolledInESR = selectors.isEnrolledInESR(state);
      expect(isEnrolledInESR).to.be.true;
    });
  });

  describe('isInESR', () => {
    it('returns `false` if the enrollmentStatus is not set', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      const isInESR = selectors.hasApplicationInESR(state);
      expect(isInESR).to.be.false;
    });
    it('returns `false` if the enrollmentStatus is noneOfTheAbove', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
        },
      };
      const isInESR = selectors.hasApplicationInESR(state);
      expect(isInESR).to.be.false;
    });
    it('returns `false` if the enrollmentStatus is active duty', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.activeDuty,
        },
      };
      const isInESR = selectors.hasApplicationInESR(state);
      expect(isInESR).to.be.false;
    });
    it('returns `false` if the enrollmentStatus is canceled', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.canceledDeclined,
        },
      };
      const isInESR = selectors.hasApplicationInESR(state);
      expect(isInESR).to.be.false;
    });
    it('returns `false` if the enrollmentStatus is deceased', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.deceased,
        },
      };
      const isInESR = selectors.hasApplicationInESR(state);
      expect(isInESR).to.be.false;
    });
    it('returns `true` if the enrollmentStatus is enrolled', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        },
      };
      const isInESR = selectors.hasApplicationInESR(state);
      expect(isInESR).to.be.true;
    });
    it('returns `true` if the enrollmentStatus is pending', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.pendingOther,
        },
      };
      const isInESR = selectors.hasApplicationInESR(state);
      expect(isInESR).to.be.true;
    });
  });
});

describe('compound selectors', () => {
  describe('isLoading', () => {
    it('returns true if the enrollment status is loading', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          isLoadingApplicationStatus: true,
        },
        user: { ...loggedOutUserState },
      };
      const isLoading = selectors.isLoading(state);
      expect(isLoading).to.equal(true);
    });
    it('returns true if the profile is loading', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...loadingUserState },
      };
      const isLoading = selectors.isLoading(state);
      expect(isLoading).to.equal(true);
    });
    it('returns false if neither the profile or enrollment status is loading', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...loggedOutUserState },
      };
      const isLoading = selectors.isLoading(state);
      expect(isLoading).to.equal(false);
    });
  });

  describe('isUserLOA1', () => {
    it('returns true if everything is loaded and user is LOA1', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...LOA1UserState },
      };
      const isLOA1 = selectors.isUserLOA1(state);
      expect(isLOA1).to.equal(true);
    });
    it('returns false if everything is loaded and user is LOA3', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...LOA3UserState },
      };
      const isLOA1 = selectors.isUserLOA1(state);
      expect(isLOA1).to.equal(false);
    });
    it('returns false if enrollment status still loading', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          isLoadingApplicationStatus: true,
        },
        user: { ...LOA1UserState },
      };
      const isLOA1 = selectors.isUserLOA1(state);
      expect(isLOA1).to.equal(false);
    });
    it('returns false if the profile still loading', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...loadingUserState },
      };
      const isLOA1 = selectors.isUserLOA1(state);
      expect(isLOA1).to.equal(false);
    });
    it('returns false if the user is logged out', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...loggedOutUserState },
      };
      const isLOA1 = selectors.isUserLOA1(state);
      expect(isLOA1).to.equal(false);
    });
  });

  describe('isUserLOA3', () => {
    it('returns true if everything is loaded and user is LOA3', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...LOA3UserState },
      };
      const isLOA3 = selectors.isUserLOA3(state);
      expect(isLOA3).to.equal(true);
    });
    it('returns false if everything is loaded and user is LOA1', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...LOA1UserState },
      };
      const isLOA3 = selectors.isUserLOA3(state);
      expect(isLOA3).to.equal(false);
    });
    it('returns true if enrollment status is loading but the user has resolved', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          isLoadingApplicationStatus: true,
        },
        user: { ...LOA3UserState },
      };
      const isLOA3 = selectors.isUserLOA3(state);
      expect(isLOA3).to.equal(true);
    });
    it('returns false if the profile still loading', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...loadingUserState },
      };
      const isLOA3 = selectors.isUserLOA3(state);
      expect(isLOA3).to.equal(false);
    });
    it('returns false if the user is logged out', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...loggedOutUserState },
      };
      const isLOA3 = selectors.isUserLOA3(state);
      expect(isLOA3).to.equal(false);
    });
    it('returns false if there is a server error', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          hasServerError: true,
        },
        user: { ...LOA3UserState },
      };
      const isLOA3 = selectors.isUserLOA3(state);
      expect(isLOA3).to.equal(false);
    });
    it('returns false if the user was not found in ESR', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          noESRRecordFound: true,
        },
        user: { ...LOA3UserState },
      };
      const isLOA3 = selectors.isUserLOA3(state);
      expect(isLOA3).to.equal(false);
    });
  });

  describe('shouldShowLoggedOutContent', () => {
    it('returns true if the user is not logged in', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
        },
        user: { ...loggedOutUserState },
      };
      const shouldShowLoggedOutContent = selectors.shouldShowLoggedOutContent(
        state,
      );
      expect(shouldShowLoggedOutContent).to.equal(true);
    });
    it('returns true if there is an enrollment status server error', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          hasServerError: true,
        },
        user: { ...LOA3UserState },
      };
      const shouldShowLoggedOutContent = selectors.shouldShowLoggedOutContent(
        state,
      );
      expect(shouldShowLoggedOutContent).to.equal(true);
    });
    it('returns true if the user was not found in ESR', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          noESRRecordFound: true,
        },
        user: { ...LOA3UserState },
      };
      const shouldShowLoggedOutContent = selectors.shouldShowLoggedOutContent(
        state,
      );
      expect(shouldShowLoggedOutContent).to.equal(true);
    });
    it('returns false if the user is logged in, is in ESR, and there are no enrollment status server errors', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
        },
        user: { ...LOA3UserState },
      };
      const shouldShowLoggedOutContent = selectors.shouldShowLoggedOutContent(
        state,
      );
      expect(shouldShowLoggedOutContent).to.equal(false);
    });
  });

  describe('shouldHideFormFooter', () => {
    it('returns false if the user is loading', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
        },
        user: { ...loadingUserState },
      };
      const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
      expect(shouldHideFormFooter).to.equal(false);
    });

    it('returns false if the enrollment status is loading', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          isLoadingApplicationStatus: true,
        },
        user: { ...LOA1UserState },
      };
      const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
      expect(shouldHideFormFooter).to.equal(false);
    });

    it('returns true if the user is LOA1', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
        },
        user: { ...LOA1UserState },
      };
      const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
      expect(shouldHideFormFooter).to.equal(true);
    });

    it('returns true if the user is LOA3 and the Reapply For Healthcare content is not shown', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
        },
        user: { ...LOA3UserState },
      };
      const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
      expect(shouldHideFormFooter).to.equal(true);
    });

    it('returns false if the user is LOA3 but the Reapply For Healthcare content is shown', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          showHCAReapplyContent: true,
        },
        user: { ...LOA3UserState },
      };
      const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
      expect(shouldHideFormFooter).to.equal(false);
    });
  });
});
