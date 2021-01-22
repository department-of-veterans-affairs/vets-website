import {
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
} from 'platform/user/selectors';
import { HCA_ENROLLMENT_STATUSES } from './constants';

const nonActiveInESRStatuses = new Set([
  null,
  HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
  HCA_ENROLLMENT_STATUSES.activeDuty,
  HCA_ENROLLMENT_STATUSES.canceledDeclined,
  HCA_ENROLLMENT_STATUSES.deceased,
  HCA_ENROLLMENT_STATUSES.nonMilitary,
]);

// top-level selectors
export const selectEnrollmentStatus = state => state.hcaEnrollmentStatus;
export const isEnrollmentStatusLoading = state =>
  selectEnrollmentStatus(state).isLoadingApplicationStatus;
export const isLoadingDismissedNotification = state =>
  selectEnrollmentStatus(state).isLoadingDismissedNotification;
export const hasServerError = state =>
  selectEnrollmentStatus(state).hasServerError;
export const noESRRecordFound = state =>
  selectEnrollmentStatus(state).noESRRecordFound;
export const isShowingHCAReapplyContent = state =>
  selectEnrollmentStatus(state).showHCAReapplyContent;
export const hasApplicationInESR = state => {
  const status = selectEnrollmentStatus(state).enrollmentStatus;
  return nonActiveInESRStatuses.has(status) === false;
};
export const isEnrolledInESR = state =>
  selectEnrollmentStatus(state).enrollmentStatus ===
  HCA_ENROLLMENT_STATUSES.enrolled;
export const dismissedHCANotificationDate = state =>
  selectEnrollmentStatus(state).dismissedNotificationDate;

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
export const isLoggedOut = state =>
  !isProfileLoading(state) && !isLoggedIn(state);
// If we can't get enrollment status for LOA3 users, treat them like a
// logged-out user (ie, just let them start a new application)
export const shouldShowLoggedOutContent = state =>
  !isLoading(state) &&
  (!isLoggedIn(state) || hasServerError(state) || noESRRecordFound(state));
export const shouldHideFormFooter = state =>
  !isLoading(state) &&
  (isUserLOA1(state) ||
    (isUserLOA3(state) && !isShowingHCAReapplyContent(state)));
