import {
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
} from 'platform/user/selectors';

// top-level selectors
export const selectEnrollmentStatus = state => state.hcaEnrollmentStatus;
export const isEnrollmentStatusLoading = state =>
  selectEnrollmentStatus(state).isLoading;
export const hasServerError = state =>
  selectEnrollmentStatus(state).hasServerError;
export const noESRRecordFound = state =>
  selectEnrollmentStatus(state).noESRRecordFound;

// compound selectors
export const isLoading = state =>
  isProfileLoading(state) || isEnrollmentStatusLoading(state);
export const isUserLOA1 = state =>
  !isLoading(state) && isLoggedIn(state) && isLOA1(state);
export const isUserLOA3 = state =>
  !isProfileLoading(state) &&
  isLoggedIn(state) &&
  !hasServerError(state) &&
  !noESRRecordFound(state) &&
  isLOA3(state);
// If we can't get enrollment status for LOA3 users, treat them like a
// logged-out user (ie, just let them start a new application)
export const isLoggedOut = state =>
  !isLoading(state) &&
  (!isLoggedIn(state) || hasServerError(state) || noESRRecordFound(state));
