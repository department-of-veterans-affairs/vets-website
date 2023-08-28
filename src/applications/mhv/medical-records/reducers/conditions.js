import environment from 'platform/utilities/environment';
import { Actions } from '../util/actionTypes';
import { Testing } from '../util/constants';

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

const convertCondition = condition => {
  return {
    id: 'SCT161891005',
    date: condition.recordedDate,
    name: condition.code.text,
    clinicalTerm: condition.code.coding.code,
    active: condition.clinicalStatus.coding.code,
    provider: condition.asserter,
    facility: "chiropractor's office",
    comments: condition.note,
  };
};

const convertConditionsList = recordList => {
  recordList.entry.map(item => {
    const record = item.resource;
    return convertCondition(record);
  });
};

export const conditionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Conditions.GET: {
      let conditionDetails;
      if (environment.BUILDTYPE === 'localhost' && Testing) {
        convertCondition(action.response);
      } else {
        conditionDetails = action.response;
      }
      return {
        ...state,
        conditionDetails,
      };
    }
    case Actions.Conditions.GET_LIST: {
      const recordList = action.response;
      let conditionsList;
      if (environment.BUILDTYPE === 'localhost' && Testing) {
        convertConditionsList(recordList);
      } else {
        conditionsList = recordList.map(condition => {
          return { ...condition };
        });
      }
      return {
        ...state,
        conditionsList,
      };
    }
    default:
      return state;
  }
};
