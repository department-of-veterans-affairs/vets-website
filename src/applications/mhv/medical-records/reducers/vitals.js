import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of vaccines returned from the api
   * @type {array}
   */
  vitalsList: undefined,
  /**
   * The vaccine currently being displayed to the user
   */
  vitalDetails: undefined,
};

export const vitalReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vitals.GET: {
      return {
        ...state,
        vitalDetails: state.vitalsList.filter(
          vital =>
            vital.name.toLowerCase().replace(/\s+/g, '') === action.vitalType,
        ),
      };
    }
    case Actions.Vitals.GET_LIST: {
      return {
        ...state,
        vitalsList: action.response.map(vaccine => {
          return { ...vaccine };
        }),
      };
    }
    default:
      return state;
  }
};
