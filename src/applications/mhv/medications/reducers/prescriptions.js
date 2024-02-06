import { Actions } from '../util/actionTypes';
import { defaultSelectedSortOption } from '../util/constants';

export const initialState = {
  /**
   * The list of paginated and sorted prescriptions returned from the api
   * @type {array}
   */
  prescriptionsList: undefined,
  /**
   * The list of sorted prescriptions returned from the api
   * @type {array}
   */
  prescriptionsFullList: [],
  /**
   * The prescription currently being displayed to the user
   */
  prescriptionDetails: undefined,
  /**
   * Pagination received form meta object in prescriptionsList payload
   */
  prescriptionsPagination: undefined,
  /**
   * Sort option used for sorting the prescriptions list
   */
  selectedSortOption: defaultSelectedSortOption,
};

export const prescriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Prescriptions.GET_DETAILS: {
      return {
        ...state,
        prescriptionDetails: action.response.data.attributes,
      };
    }
    case Actions.Prescriptions.CLEAR_DETAILS: {
      return {
        ...state,
        prescriptionDetails: undefined,
      };
    }
    case Actions.Prescriptions.GET_PAGINATED_SORTED_LIST: {
      return {
        ...state,
        prescriptionsList: action.response.data.map(rx => {
          return { ...rx.attributes };
        }),
        prescriptionsPagination: action.response.meta.pagination,
      };
    }
    case Actions.Prescriptions.GET_SORTED_LIST: {
      return {
        ...state,
        prescriptionsFullList: action.response.data.map(rx => {
          return { ...rx.attributes };
        }),
      };
    }
    case Actions.Prescriptions.UPDATE_SORT_OPTION: {
      return {
        ...state,
        selectedSortOption: action.payload,
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
