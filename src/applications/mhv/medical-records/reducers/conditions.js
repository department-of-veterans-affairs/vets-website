import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD } from '../util/constants';

const initialState = {
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
    clinicalTerm: condition.code?.coding?.code || EMPTY_FIELD,
    active: condition.clinicalStatus?.coding?.code || EMPTY_FIELD,
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
    default:
      return state;
  }
};
