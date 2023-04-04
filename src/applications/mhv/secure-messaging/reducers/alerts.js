import { Actions } from '../util/actionTypes';

const initialState = {
  alertVisible: false,
  /**
   * The list of possible message categories
   * @type {array}
   */
  alertList: [],
};

export const alertsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Alerts.CLOSE_ALERT:
      // Set visibility to false and set ALL alerts to inactive.
      return {
        ...state,
        alertVisible: false,
        alertList: state.alertList.map(alert => {
          return {
            ...alert,
            isActive: false,
          };
        }),
      };
    case Actions.Alerts.ADD_ALERT: {
      const newAlert = {
        datestamp: new Date(),
        isActive: true,
        alertType: action.payload.alertType,
        header: action.payload.header
          ? action.payload.header
          : action.payload.alertType[0].toUpperCase() +
            action.payload.alertType.substring(1),
        content: action.payload.content,
        className: action.payload.className,
        link: action.payload.link,
        title: action.payload.title,
        response: action.payload.response,
      };
      return {
        ...state,
        alertVisible: true,
        alertList: [...state.alertList, newAlert],
      };
    }
    default:
      return state;
  }
};
