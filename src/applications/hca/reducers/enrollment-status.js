import {
  ENROLLMENT_STATUS_ACTIONS,
  HCA_ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_INIT_STATE,
} from '../utils/constants';

function hcaEnrollmentStatus(state = ENROLLMENT_STATUS_INIT_STATE, action) {
  const { data = {}, type } = action;
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    RESET_ENROLLMENT_STATUS,
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
    [RESET_ENROLLMENT_STATUS]: () => ({ ...ENROLLMENT_STATUS_INIT_STATE }),
  };

  return actionMap[type] ? actionMap[type]() : state;
}

export default hcaEnrollmentStatus;
