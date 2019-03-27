import { expect } from 'chai';
import * as selectors from '../selectors';

const basicEnrollmentStatusState = {
  applicationDate: null,
  enrollmentDate: null,
  preferredFacility: null,
  enrollmentStatus: null,
  hasServerError: false,
  isLoading: false,
  isUserInMVI: false,
  loginRequired: false,
  noESRRecordFound: false,
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
      state.hcaEnrollmentStatus.isLoading = true;
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
});

describe('compound selectors', () => {
  describe('isLoading', () => {
    it('returns true if the enrollment status is loading', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState, isLoading: true },
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
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState, isLoading: true },
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
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState, isLoading: true },
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

  describe('isLoggedOut', () => {
    it('returns true if the user is not logged in', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
        },
        user: { ...loggedOutUserState },
      };
      const isLoggedOut = selectors.isLoggedOut(state);
      expect(isLoggedOut).to.equal(true);
    });
    it('returns true if there is an enrollment status server error', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          hasServerError: true,
        },
        user: { ...LOA3UserState },
      };
      const isLoggedOut = selectors.isLoggedOut(state);
      expect(isLoggedOut).to.equal(true);
    });
    it('returns true if the user was not found in ESR', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
          noESRRecordFound: true,
        },
        user: { ...LOA3UserState },
      };
      const isLoggedOut = selectors.isLoggedOut(state);
      expect(isLoggedOut).to.equal(true);
    });
    it('returns false if the user is logged in, is in ESR, and there are no enrollment status server errors', () => {
      const state = {
        hcaEnrollmentStatus: {
          ...basicEnrollmentStatusState,
        },
        user: { ...LOA3UserState },
      };
      const isLoggedOut = selectors.isLoggedOut(state);
      expect(isLoggedOut).to.equal(false);
    });
  });
});
