import {
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { HCA_ENROLLMENT_STATUSES } from '../constants';

const nonActiveInESRStatuses = new Set([
  null,
  HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
  HCA_ENROLLMENT_STATUSES.activeDuty,
  HCA_ENROLLMENT_STATUSES.canceledDeclined,
  HCA_ENROLLMENT_STATUSES.deceased,
  HCA_ENROLLMENT_STATUSES.nonMilitary,
]);

/*
 * Top-level selectors
 */
export const selectEnrollmentStatus = state => state.hcaEnrollmentStatus;

export const isEnrollmentStatusLoading = state =>
  selectEnrollmentStatus(state).isLoadingApplicationStatus;

export const hasServerError = state =>
  selectEnrollmentStatus(state).hasServerError;

export const noESRRecordFound = state =>
  selectEnrollmentStatus(state).noESRRecordFound;

export const shouldShowReapplyContent = state =>
  selectEnrollmentStatus(state).showReapplyContent;

export const hasApplicationInESR = state => {
  const status = selectEnrollmentStatus(state).enrollmentStatus;
  return nonActiveInESRStatuses.has(status) === false;
};

export const isEnrolledInESR = state =>
  selectEnrollmentStatus(state).enrollmentStatus ===
  HCA_ENROLLMENT_STATUSES.enrolled;

/*
 * Compound Selectors
 */
export const isLoading = state =>
  isProfileLoading(state) || isEnrollmentStatusLoading(state);

export const isUserLOA1 = state =>
  !isLoading(state) && isLoggedIn(state) && isLOA1(state);

export const isUserLOA3 = state =>
  isLoggedIn(state) &&
  isLOA3(state) &&
  !isProfileLoading(state) &&
  !noESRRecordFound(state) &&
  !hasServerError(state);

export const isLoggedOut = state =>
  !isLoggedIn(state) && !isProfileLoading(state);

export const shouldShowGetStartedContent = state =>
  !isLoading(state) &&
  (!isLoggedIn(state) || noESRRecordFound(state) || hasServerError(state));

export const shouldHideFormFooter = state =>
  !isLoading(state) &&
  (isUserLOA1(state) ||
    (isUserLOA3(state) && !shouldShowReapplyContent(state)));
