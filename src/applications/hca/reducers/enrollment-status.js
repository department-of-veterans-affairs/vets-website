import {
  HCA_ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_ACTIONS,
  ENROLLMENT_STATUS_INIT_STATE,
} from '../utils/constants';

/**
 * Map proper data values to enrollment status actions
 * @param {Object} state - initial data object to map
 * @param {Object} action - dispatched action to perform
 * @returns {Boolean} - mapped data object or initial state object if action type is
 * not relevant to this function
 */
const enrollmentStatus = (state = ENROLLMENT_STATUS_INIT_STATE, action) => {
  const { data = {}, type } = action;
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    RESET_ENROLLMENT_STATUS,
    SHOW_REAPPLY_CONTENT,
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
        enrollmentDate,
        preferredFacility,
      } = data;
      const { noneOfTheAbove } = HCA_ENROLLMENT_STATUSES;
      const isInESR = parsedStatus !== noneOfTheAbove;
      return {
        ...state,
        hasServerError: false,
        enrollmentStatus: parsedStatus,
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
    [SHOW_REAPPLY_CONTENT]: () => ({ ...state, showReapplyContent: true }),
  };

  return actionMap[type] ? actionMap[type]() : state;
};

export default enrollmentStatus;
