import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD, loadStates } from '../util/constants';

const initialState = {
  /**
   * The last time that the list was fetched and known to be up-to-date
   * @type {Date}
   */
  listCurrentAsOf: undefined,
  /**
   * PRE_FETCH, FETCHING, FETCHED
   */
  listState: loadStates.PRE_FETCH,

  /**
   * The list of conditions returned from the api
   * @type {array}
   */
  conditionsList: undefined,
  /**
   * The condition currently being displayed to the user
   */
  conditionDetails: undefined,
};

export const convertCondition = condition => {
  return {
    id: 'SCT161891005',
    date: condition.recordedDate
      ? formatDateLong(condition.recordedDate)
      : EMPTY_FIELD,
    name: condition.code?.text || EMPTY_FIELD,
    provider: condition.asserter || EMPTY_FIELD,
    facility: condition.facility,
    comments: condition.note || EMPTY_FIELD,
  };
};

export const conditionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Conditions.GET: {
      return {
        ...state,
        conditionDetails: convertCondition(action.response),
      };
    }
    case Actions.Conditions.GET_FROM_LIST: {
      return {
        ...state,
        conditionDetails: action.response,
      };
    }
    case Actions.Conditions.GET_LIST: {
      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        conditionsList: action.response.map(item => {
          return convertCondition(item);
        }),
      };
    }
    case Actions.Conditions.CLEAR_DETAIL: {
      return {
        ...state,
        conditionDetails: undefined,
      };
    }
    case Actions.Conditions.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    default:
      return state;
  }
};
