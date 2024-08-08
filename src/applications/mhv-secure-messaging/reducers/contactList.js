import { Actions } from '../util/actionTypes';

const initialState = {
  successMessage: null,
  timestamp: null,
};

export const contactListReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.ContactList.SHOW_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.payload.message,
        timestamp: action.payload.timestamp,
      };
    case Actions.ContactList.CLEAR_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: null,
        timestamp: null,
      };
    default:
      return state;
  }
};
