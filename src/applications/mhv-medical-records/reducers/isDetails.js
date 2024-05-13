import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The lab or test result currently being displayed to the user
   */
  currentIsDetails: false,
};

export const isDetailsReducer = (state = initialState, action) => {
  if (action.type === Actions.IsDetails.SET_IS_DETAILS) {
    return {
      ...state,
      currentIsDetails: action.payload,
    };
  }
  return state;
};
