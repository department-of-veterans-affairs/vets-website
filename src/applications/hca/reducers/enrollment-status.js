import {
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
function enrollmentStatus(state = ENROLLMENT_STATUS_INIT_STATE, action) {
  const { response = {}, type } = action;
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    RESET_ENROLLMENT_STATUS,
  } = ENROLLMENT_STATUS_ACTIONS;

  const actionMap = {
    [FETCH_ENROLLMENT_STATUS_STARTED]: () => ({ ...state, loading: true }),
    [FETCH_ENROLLMENT_STATUS_SUCCEEDED]: () => {
      const {
        parsedStatus,
        applicationDate,
        enrollmentDate,
        preferredFacility,
      } = response;
      return {
        ...state,
        statusCode: parsedStatus,
        hasServerError: false,
        fetchAttempted: true,
        isUserInMPI: true,
        loading: false,
        applicationDate,
        enrollmentDate,
        preferredFacility,
      };
    },
    [FETCH_ENROLLMENT_STATUS_FAILED]: () => {
      const { errors } = action;
      const has404Error = errors?.some(({ code }) => code === '404');
      const hasRateLimitError = errors?.some(({ code }) => code === '429');
      // if the error is not given special handling, treat it like a server error
      const hasServerError = !has404Error && !hasRateLimitError;
      return {
        ...state,
        fetchAttempted: true,
        loading: false,
        hasRateLimitError,
        hasServerError,
      };
    },
    [RESET_ENROLLMENT_STATUS]: () => ({ ...ENROLLMENT_STATUS_INIT_STATE }),
  };

  return actionMap[type] ? actionMap[type]() : state;
}

export default enrollmentStatus;
