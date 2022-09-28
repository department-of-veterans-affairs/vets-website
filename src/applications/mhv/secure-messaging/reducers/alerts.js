import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of possible message categories
   * @type {array}
   */
  alertList: [],
};

export const alertsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Alert.ADD_ALERT:
      return {
        ...state,
        alertList: [...state.alertList, action.payload],
      };
    case 'b':
    default:
      return state;
  }
};
