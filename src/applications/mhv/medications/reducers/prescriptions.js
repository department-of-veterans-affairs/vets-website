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
        prescriptionDetails: action.response.data.attributes,
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
    case Actions.Prescriptions.SET_SORTED_LIST: {
      return {
        ...state,
        prescriptionsList: action.rxList,
      };
    }
    case Actions.Prescriptions.FILL: {
      return {
        ...state,
      };
    }
    case Actions.Prescriptions.FILL_ERROR: {
      return {
        ...state,
        prescriptionsList: state.prescriptionsList?.map(
          rx => (rx.id === action.err.id ? { ...rx, error: action.err } : rx),
        ),
        prescriptionDetails: {
          ...state.prescriptionDetails,
          error: action.err,
        },
      };
    }
    default:
      return state;
  }
};
