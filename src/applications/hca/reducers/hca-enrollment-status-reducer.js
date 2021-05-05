import {
  FETCH_ENROLLMENT_STATUS_STARTED,
  FETCH_ENROLLMENT_STATUS_SUCCEEDED,
  FETCH_ENROLLMENT_STATUS_FAILED,
  FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
  FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
  FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
  SET_DISMISSED_HCA_NOTIFICATION,
  SHOW_HCA_REAPPLY_CONTENT,
} from '../actions';
import { HCA_ENROLLMENT_STATUSES } from '../constants';

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
  showHCAReapplyContent: false,
};

function hcaEnrollmentStatus(state = initialState, action) {
  switch (action.type) {
    case FETCH_ENROLLMENT_STATUS_STARTED:
      return { ...state, isLoadingApplicationStatus: true };

    case FETCH_ENROLLMENT_STATUS_SUCCEEDED: {
      const {
        parsedStatus,
        applicationDate,
        effectiveDate: enrollmentStatusEffectiveDate,
        enrollmentDate,
        preferredFacility,
      } = action.data;

      const enrollmentStatus = parsedStatus;
      const isInESR =
        enrollmentStatus !== HCA_ENROLLMENT_STATUSES.noneOfTheAbove;
      return {
        ...state,
        hasServerError: false,
        enrollmentStatus,
        enrollmentStatusEffectiveDate,
        applicationDate,
        enrollmentDate,
        preferredFacility,
        loginRequired: isInESR,
        noESRRecordFound: !isInESR,
        isLoadingApplicationStatus: false,
        isUserInMVI: true,
      };
    }

    case FETCH_ENROLLMENT_STATUS_FAILED: {
      const { errors } = action;
      const noESRRecordFound =
        errors && errors.some(error => error.code === '404');
      const hasRateLimitError =
        errors && errors.some(error => error.code === '429');
      // if the error is not given special handling, treat it like a server error
      const hasServerError = !noESRRecordFound && !hasRateLimitError;
      return {
        ...state,
        hasServerError,
        isLoadingApplicationStatus: false,
        loginRequired: hasRateLimitError,
        noESRRecordFound,
      };
    }

    case SHOW_HCA_REAPPLY_CONTENT:
      return { ...state, showHCAReapplyContent: true };

    case FETCH_DISMISSED_HCA_NOTIFICATION_STARTED:
      return { ...state, isLoadingDismissedNotification: true };

    case FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED: {
      const {
        statusEffectiveAt: dismissedNotificationDate,
      } = action.response.data.attributes;
      return {
        ...state,
        dismissedNotificationDate,
        isLoadingDismissedNotification: false,
      };
    }

    case FETCH_DISMISSED_HCA_NOTIFICATION_FAILED: {
      return {
        ...state,
        isLoadingDismissedNotification: false,
      };
    }

    case SET_DISMISSED_HCA_NOTIFICATION: {
      return {
        ...state,
        dismissedNotificationDate: action.data,
      };
    }

    default:
      return state;
  }
}

export default hcaEnrollmentStatus;
