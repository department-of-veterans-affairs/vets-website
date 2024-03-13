import {
  ENROLLMENT_STATUS_ACTIONS,
  HCA_ENROLLMENT_STATUSES,
} from '../utils/constants';

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

function hcaEnrollmentStatus(state = initialState, action) {
  const { data = {}, response = {}, type } = action;
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    RESET_ENROLLMENT_STATUS,
    FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
    FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
    FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
    SET_DISMISSED_HCA_NOTIFICATION,
    SHOW_HCA_REAPPLY_CONTENT,
  } = ENROLLMENT_STATUS_ACTIONS;

  const actionMap = {
    [FETCH_ENROLLMENT_STATUS_STARTED]: () => ({
      ...state,
      isLoadingApplicationStatus: true,
    }),
    [FETCH_ENROLLMENT_STATUS_SUCCEEDED]: () => {
      const {
        parsedStatus,
        applicationDate,
        effectiveDate: enrollmentStatusEffectiveDate,
        enrollmentDate,
        preferredFacility,
      } = data;
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
    },
    [FETCH_ENROLLMENT_STATUS_FAILED]: () => {
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
    },
    [RESET_ENROLLMENT_STATUS]: () => ({ ...initialState }),
    [FETCH_DISMISSED_HCA_NOTIFICATION_STARTED]: () => ({
      ...state,
      isLoadingDismissedNotification: true,
    }),
    [FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED]: () => {
      const {
        statusEffectiveAt: dismissedNotificationDate,
      } = response.data.attributes;
      return {
        ...state,
        dismissedNotificationDate,
        isLoadingDismissedNotification: false,
      };
    },
    [FETCH_DISMISSED_HCA_NOTIFICATION_FAILED]: () => ({
      ...state,
      isLoadingDismissedNotification: false,
    }),
    [SET_DISMISSED_HCA_NOTIFICATION]: () => ({
      ...state,
      dismissedNotificationDate: data,
    }),
    [SHOW_HCA_REAPPLY_CONTENT]: () => ({ ...state, showReapplyContent: true }),
  };

  return actionMap[type] ? actionMap[type]() : state;
}

export default hcaEnrollmentStatus;
