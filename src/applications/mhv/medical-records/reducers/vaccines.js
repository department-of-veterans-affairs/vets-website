import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of vaccines returned from the api
   * @type {array}
   */
  vaccinesList: undefined,
  /**
   * The vaccine currently being displayed to the user
   */
  vaccineDetails: undefined,
};

export const vaccineReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vaccines.GET: {
      return {
        ...state,
        vaccineDetails: action.response,
      };
    }
    case Actions.Vaccines.GET_LIST: {
      return {
        ...state,
        vaccinesList: action.response.map(vaccine => {
          return { ...vaccine };
        }),
      };
    }
    default:
      return state;
  }
};
