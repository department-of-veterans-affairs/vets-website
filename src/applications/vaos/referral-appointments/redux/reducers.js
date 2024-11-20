import {
  SET_FACILITY,
  SET_APPOINTMENT_DETAILS,
  SET_SORT_PROVIDER_BY,
  SET_SELECTED_PROVIDER,
  SET_FORM_CURRENT_PAGE,
  FETCH_PROVIDER_DETAILS,
  FETCH_PROVIDER_DETAILS_FAILED,
  FETCH_PROVIDER_DETAILS_SUCCEEDED,
} from './actions';
import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  facility: null,
  sortProviderBy: '',
  selectedProvider: '',
  currentPage: null,
  providerFetchStatus: FETCH_STATUS.notStarted,
};

function ccAppointmentReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FACILITY:
      return {
        ...state,
        facility: action.payload,
      };
    case SET_APPOINTMENT_DETAILS:
      return {
        ...state,
        dateTime: action.payload.dateTime,
        facility: action.payload.facility,
      };
    case SET_SORT_PROVIDER_BY:
      return {
        ...state,
        sortProviderBy: action.payload,
      };
    case SET_SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: action.payload,
      };
    case SET_FORM_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case FETCH_PROVIDER_DETAILS:
      return {
        ...state,
        providerFetchStatus: FETCH_STATUS.loading,
      };
    case FETCH_PROVIDER_DETAILS_SUCCEEDED:
      return {
        ...state,
        providerFetchStatus: FETCH_STATUS.succeeded,
        selectedProvider: action.data,
      };
    case FETCH_PROVIDER_DETAILS_FAILED:
      return {
        ...state,
        providerFetchStatus: FETCH_STATUS.failed,
      };
    default:
      return state;
  }
}

export default ccAppointmentReducer;
