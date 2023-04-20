import { Actions } from '../util/actionTypes';

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

export const conditionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Conditions.GET: {
      return {
        ...state,
        conditionDetails: action.response,
      };
    }
    case Actions.Conditions.GET_LIST: {
      return {
        ...state,
        conditionsList: action.response.map(condition => {
          return { ...condition };
        }),
      };
    }
    default:
      return state;
  }
};
