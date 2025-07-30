import {
  SET_FORM_CURRENT_PAGE,
  FETCH_REFERRAL_APPOINTMENT_INFO,
  FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
  FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED,
  SET_INIT_REFERRAL_FLOW,
  SET_SELECTED_SLOT_START_TIME,
} from './actions';
import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  facility: null,
  sortProviderBy: '',
  currentPage: null,
  referrals: [],
  referralDetails: [],
  selectedSlotStartTime: '',
  referralsFetchStatus: FETCH_STATUS.notStarted,
  referralFetchStatus: FETCH_STATUS.notStarted,
  appointmentCreateStatus: FETCH_STATUS.notStarted,
  pollingRequestStart: null,
  referralAppointmentInfo: {},
  appointmentInfoLoading: false,
  appointmentInfoError: false,
  appointmentInfoTimeout: false,
};

function ccAppointmentReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FORM_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case FETCH_REFERRAL_APPOINTMENT_INFO:
      return {
        ...state,
        appointmentInfoError: false,
        appointmentInfoLoading: true,
        appointmentInfoTimeout: false,
        pollingRequestStart: action.payload.pollingRequestStart,
      };
    case FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED:
      return {
        ...state,
        appointmentInfoLoading: false,
        appointmentInfoError: false,
        appointmentInfoTimeout: false,
        referralAppointmentInfo: action.data,
      };
    case FETCH_REFERRAL_APPOINTMENT_INFO_FAILED:
      return {
        ...state,
        appointmentInfoLoading: false,
        appointmentInfoError: true,
        appointmentInfoTimeout: action.payload,
      };
    case SET_SELECTED_SLOT_START_TIME:
      return {
        ...state,
        selectedSlotStartTime: action.payload,
      };
    case SET_INIT_REFERRAL_FLOW:
      return {
        ...state,
        provider: {},
        appointmentCreateStatus: FETCH_STATUS.notStarted,
        appointmentInfoTimeout: false,
        appointmentInfoError: false,
        appointmentInfoLoading: false,
        pollingRequestStart: null,
        referralAppointmentInfo: {},
        referralsFetchStatus: FETCH_STATUS.notStarted,
        referralFetchStatus: FETCH_STATUS.notStarted,
        selectedSlotStartTime: '',
      };
    default:
      return state;
  }
}

export default ccAppointmentReducer;
