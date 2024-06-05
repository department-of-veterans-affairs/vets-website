import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of messages being displayed in the folder view/inbox
   * @type {array}
   */
  signature: undefined,
};

export const preferencesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Preferences.GET_USER_SIGNATURE:
      return {
        ...state,
        signature: action.payload,
      };
    case Actions.Preferences.GET_USER_SIGNATURE_ERROR:
      return {
        ...state,
        signature: undefined,
      };
    default:
      return state;
  }
};
