import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of conditions returned from the api
   * @type {array}
   */
  allergiesList: undefined,
  /**
   * The condition currently being displayed to the user
   */
  allergyDetails: undefined,
};

export const allergyReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Allergies.GET: {
      return {
        ...state,
        allergyDetails: action.response,
      };
    }
    case Actions.Allergies.GET_LIST: {
      return {
        ...state,
        allergiesList: action.response.map(allergy => {
          return { ...allergy };
        }),
      };
    }
    default:
      return state;
  }
};
