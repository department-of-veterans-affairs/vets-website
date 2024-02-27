import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of possible message categories
   * @type {array}
   */
  alertList: [],
};

export const alertsReducer = (state = initialState, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case Actions.Alerts.ADD_ALERT: {
      const newAlert = {
        datestamp: new Date(),
        isActive: true,
        type: action.payload.type,
        errorMessage: action.payload.error.message,
        errorStackTrace: action.payload.error.stack,
      };
      return {
        ...state,
        alertList: [...state.alertList, newAlert],
      };
    }
    case Actions.Alerts.CLEAR_ALERT: {
      return {
        ...state,
        alertList: state.alertList.map(item => ({ ...item, isActive: false })),
      };
    }
    default:
      return state;
  }
};
