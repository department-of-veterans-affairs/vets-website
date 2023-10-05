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
  /**
   * Pagination received form meta object in prescriptionsList payload
   */
  prescriptionsPagination: undefined,
  /**
   * Sort endpoint currently being used
   */
  sortEndpoint: undefined,
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
        prescriptionsPagination: action.response.meta.pagination,
      };
    }
    case Actions.Prescriptions.SET_SORT_ENDPOINT: {
      return {
        ...state,
        sortEndpoint: action.sortEndpoint,
      };
    }
    case Actions.Prescriptions.FILL: {
      return {
        ...state,
        prescriptionsList: state.prescriptionsList?.map(
          rx =>
            rx.prescriptionId === action.response.id
              ? { ...rx, error: undefined, success: true }
              : rx,
        ),
        prescriptionDetails: {
          ...state.prescriptionDetails,
          error: undefined,
          success: true,
        },
      };
    }
    case Actions.Prescriptions.FILL_ERROR: {
      return {
        ...state,
        prescriptionsList: state.prescriptionsList?.map(
          rx =>
            rx.prescriptionId === action.err.id
              ? { ...rx, error: action.err, success: undefined }
              : rx,
        ),
        prescriptionDetails: {
          ...state.prescriptionDetails,
          error: action.err,
          success: undefined,
        },
      };
    }
    case Actions.Prescriptions.CLEAR_ERROR: {
      return {
        ...state,
        prescriptionsList: state.prescriptionsList?.map(
          rx =>
            rx.prescriptionId === action.prescriptionId
              ? { ...rx, error: undefined }
              : rx,
        ),
        prescriptionDetails: {
          ...state.prescriptionDetails,
          error: undefined,
        },
      };
    }
    default:
      return state;
  }
};
