import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of prescriptions returned from the api
   * @type {array}
   */
  prescriptionsList: undefined,
  /**
   * The prescription currently being displayed to the user
   */
  prescriptionDetails: undefined,
};

export const prescriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Prescriptions.GET: {
      return {
        ...state,
        prescriptionDetails: action.response,
      };
    }
    case Actions.Prescriptions.GET_LIST: {
      return {
        ...state,
        prescriptionsList: action.response.data.map(rx => {
          return { ...rx.attributes };
        }),
      };
    }
    default:
      return state;
  }
};
