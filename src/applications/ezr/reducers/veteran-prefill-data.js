import {
  VETERAN_PREFILL_DATA_ACTIONS,
  VETERAN_PREFILL_DATA_INIT_STATE,
} from '../utils/constants';

/**
 * Map proper data values to veteran prefill data actions
 * @param {Object} state - initial data object to map
 * @param {Object} action - dispatched action to perform
 * @returns {Boolean} - mapped data object or initial state object if action type is
 * not relevant to this function
 */
function veteranPrefillData(state = VETERAN_PREFILL_DATA_INIT_STATE, action) {
  const { response = {}, type } = action;
  const {
    FETCH_VETERAN_PREFILL_DATA_STARTED,
    FETCH_VETERAN_PREFILL_DATA_SUCCEEDED,
    FETCH_VETERAN_PREFILL_DATA_FAILED,
  } = VETERAN_PREFILL_DATA_ACTIONS;

  const actionMap = {
    [FETCH_VETERAN_PREFILL_DATA_STARTED]: () => ({
      ...state,
      loading: true,
    }),
    [FETCH_VETERAN_PREFILL_DATA_SUCCEEDED]: () => {
      const { parsedData } = response;
      return {
        ...state,
        hasServerError: false,
        loading: false,
        parsedData,
      };
    },
    [FETCH_VETERAN_PREFILL_DATA_FAILED]: () => ({
      ...state,
      hasServerError: true,
      loading: false,
    }),
  };

  return actionMap[type] ? actionMap[type]() : state;
}

export default veteranPrefillData;
