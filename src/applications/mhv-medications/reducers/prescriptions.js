import { Actions } from '../util/actionTypes';
import { defaultSelectedSortOption } from '../util/constants';
import { categorizePrescriptions } from '../util/helpers';

export const initialState = {
  /**
   * REMOVE ONCE FILTER FEATURE IS DEVELOPED AND LIVE
   * The list of paginated and sorted prescriptions returned from the api
   * @type {array}
   */
  prescriptionsList: undefined,
  /**
   * The list of paginated and filtered prescriptions returned from the api
   * @type {array}
   */
  prescriptionsFilteredList: undefined,
  /**
   * The list of sorted prescriptions returned from the api
   * @type {array}
   */
  prescriptionDetails: undefined,
  /**
   * Pagination received form meta object in prescriptionsList payload
   */
  prescriptionsPagination: undefined,
  /**
   * Pagination received form meta object in prescriptionsList payload
   */
  prescriptionsFilteredPagination: undefined,
  /**
   * Sort option used for sorting the prescriptions list
   */
  selectedSortOption: defaultSelectedSortOption,
  /**
   * Prescriptions API error
   */
  apiError: undefined,
  /**
   * The list of refillable prescriptions returned from the api
   * @type {array}
   */
  refillableList: undefined,
  /**
   * The list of renewable prescriptions returned from the api
   * @type {array}
   */
  renewableList: undefined,
  /**
   * Refill Page successful/failed notification
   */
  refillNotification: undefined,
  /**
   * The list of prescriptions with taking longer than expected refills
   * @type {array}
   */
  refillAlertList: undefined,
};

export const prescriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Prescriptions.SET_DETAILS:
    case Actions.Prescriptions.GET_DETAILS: {
      return {
        ...state,
        prescriptionDetails: action.prescription,
        apiError: false,
      };
    }
    case Actions.Prescriptions.CLEAR_DETAILS: {
      return {
        ...state,
        prescriptionDetails: undefined,
        apiError: false,
      };
    }
    // **Remove once filter feature is developed and live.**
    case Actions.Prescriptions.GET_PAGINATED_SORTED_LIST: {
      return {
        ...state,
        prescriptionsList: action.response.data.map(rx => {
          return { ...rx.attributes };
        }),
        prescriptionsPagination: action.response.meta.pagination,
        apiError: false,
      };
    }
    case Actions.Prescriptions.GET_PAGINATED_FILTERED_LIST: {
      return {
        ...state,
        prescriptionsFilteredList: action.response.data.map(rx => {
          return { ...rx.attributes };
        }),
        prescriptionsFilteredPagination: action.response.meta.pagination,
        filterCount: action.response.meta.filterCount,
        apiError: false,
      };
    }
    case Actions.Prescriptions.GET_REFILL_ALERT_LIST: {
      return {
        ...state,
        refillAlertList: action.response,
        apiError: false,
      };
    }
    case Actions.Prescriptions.GET_REFILLABLE_LIST: {
      const refillablePrescriptionsList = action.response.data
        .map(rx => {
          return { ...rx.attributes };
        })
        .sort((a, b) => a.prescriptionName.localeCompare(b.prescriptionName));

      const [
        refillableList,
        renewableList,
      ] = refillablePrescriptionsList.reduce(categorizePrescriptions, [[], []]);

      return {
        ...state,
        refillableList,
        renewableList,
        apiError: false,
      };
    }
    case Actions.Prescriptions.FILL_NOTIFICATION: {
      const { failedIds, successfulIds, prescriptions } = action.response;

      const successfulMeds = prescriptions?.filter(item =>
        successfulIds?.includes(String(item.prescriptionId)),
      );
      const failedMeds = prescriptions?.filter(item =>
        failedIds?.includes(String(item.prescriptionId)),
      );

      return {
        ...state,
        refillNotification: {
          successfulMeds,
          failedMeds,
        },
        apiError: false,
      };
    }
    case Actions.Prescriptions.CLEAR_FILL_NOTIFICATION: {
      return {
        ...state,
        refillNotification: initialState.refillNotification,
      };
    }
    case Actions.Prescriptions.GET_API_ERROR: {
      return {
        ...state,
        apiError: true,
      };
    }
    // **Remove once filter feature is developed and live.**
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
