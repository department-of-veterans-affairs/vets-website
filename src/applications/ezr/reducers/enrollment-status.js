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
  } = ENROLLMENT_STATUS_ACTIONS;

  const actionMap = {
    [FETCH_ENROLLMENT_STATUS_STARTED]: () => ({
      ...state,
      loading: true,
    }),
    [FETCH_ENROLLMENT_STATUS_SUCCEEDED]: () => {
      const {
        canSubmitFinancialInfo,
        parsedStatus,
        preferredFacility,
      } = response;
      return {
        ...state,
        hasServerError: false,
        loading: false,
        canSubmitFinancialInfo,
        preferredFacility,
        parsedStatus,
      };
    },
    [FETCH_ENROLLMENT_STATUS_FAILED]: () => ({
      ...state,
      hasServerError: true,
      loading: false,
    }),
  };

  return actionMap[type] ? actionMap[type]() : state;
}

export default enrollmentStatus;
