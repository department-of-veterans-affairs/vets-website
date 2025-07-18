import {
  SET_FORM_CURRENT_PAGE,
  CREATE_REFERRAL_APPOINTMENT,
  CREATE_REFERRAL_APPOINTMENT_FAILED,
  CREATE_REFERRAL_APPOINTMENT_SUCCEEDED,
  FETCH_REFERRAL_APPOINTMENT_INFO,
  FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
  FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED,
  SET_INIT_REFERRAL_FLOW,
  SET_SELECTED_SLOT,
} from './actions';
import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  facility: null,
  sortProviderBy: '',
  currentPage: null,
  referrals: [],
  referralDetails: [],
  selectedSlot: '',
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
    case CREATE_REFERRAL_APPOINTMENT:
      return {
        ...state,
        appointmentCreateStatus: FETCH_STATUS.loading,
      };
    case CREATE_REFERRAL_APPOINTMENT_SUCCEEDED:
      return {
        ...state,
        appointmentCreateStatus: FETCH_STATUS.succeeded,
      };
    case CREATE_REFERRAL_APPOINTMENT_FAILED:
      return {
        ...state,
        appointmentCreateStatus: FETCH_STATUS.failed,
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
    case SET_SELECTED_SLOT:
      return {
        ...state,
        selectedSlot: action.payload,
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
        selectedSlot: '',
      };
    default:
      return state;
  }
}

export default ccAppointmentReducer;
