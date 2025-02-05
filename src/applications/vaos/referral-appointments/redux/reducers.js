import {
  SET_FORM_CURRENT_PAGE,
  CREATE_REFERRAL_APPOINTMENT,
  CREATE_REFERRAL_APPOINTMENT_FAILED,
  CREATE_REFERRAL_APPOINTMENT_SUCCEEDED,
  CREATE_DRAFT_REFERRAL_APPOINTMENT,
  CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED,
  CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED,
  FETCH_REFERRALS,
  FETCH_REFERRALS_SUCCEEDED,
  FETCH_REFERRALS_FAILED,
  FETCH_REFERRAL,
  FETCH_REFERRAL_SUCCEEDED,
  FETCH_REFERRAL_FAILED,
  SET_INIT_REFERRAL_FLOW,
  SET_SELECTED_SLOT,
} from './actions';
import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  facility: null,
  sortProviderBy: '',
  draftAppointmentInfo: {},
  currentPage: null,
  referrals: [],
  referralDetails: [],
  selectedSlot: '',
  referralsFetchStatus: FETCH_STATUS.notStarted,
  referralFetchStatus: FETCH_STATUS.notStarted,
  draftAppointmentCreateStatus: FETCH_STATUS.notStarted,
  appointmentCreateStatus: FETCH_STATUS.notStarted,
  postAppointmentStartTime: null,
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
        postAppointmentStartTime: action.payload.postAppointmentStartTime,
      };
    case CREATE_REFERRAL_APPOINTMENT_SUCCEEDED:
      return {
        ...state,
        appointmentCreateStatus: FETCH_STATUS.succeeded,
        postAppointmentStartTime: null,
      };
    case CREATE_REFERRAL_APPOINTMENT_FAILED:
      return {
        ...state,
        appointmentCreateStatus: FETCH_STATUS.failed,
        postAppointmentStartTime: null,
      };
    case CREATE_DRAFT_REFERRAL_APPOINTMENT:
      return {
        ...state,
        draftAppointmentCreateStatus: FETCH_STATUS.loading,
      };
    case CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED:
      return {
        ...state,
        draftAppointmentCreateStatus: FETCH_STATUS.succeeded,
        draftAppointmentInfo: action.data,
      };
    case CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED:
      return {
        ...state,
        draftAppointmentCreateStatus: FETCH_STATUS.failed,
      };
    case FETCH_REFERRALS:
      return {
        ...state,
        referralsFetchStatus: FETCH_STATUS.loading,
      };
    case FETCH_REFERRALS_SUCCEEDED:
      return {
        ...state,
        referralsFetchStatus: FETCH_STATUS.succeeded,
        referrals: action.data,
      };
    case FETCH_REFERRALS_FAILED:
      return {
        ...state,
        referralsFetchStatus: FETCH_STATUS.failed,
      };
    case FETCH_REFERRAL:
      return {
        ...state,
        referralFetchStatus: FETCH_STATUS.loading,
      };
    case FETCH_REFERRAL_SUCCEEDED:
      return {
        ...state,
        referralFetchStatus: FETCH_STATUS.succeeded,
        referralDetails: [...state.referralDetails, action.data],
      };
    case FETCH_REFERRAL_FAILED:
      return {
        ...state,
        referralFetchStatus: FETCH_STATUS.failed,
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
        providerFetchStatus: FETCH_STATUS.notStarted,
        draftAppointmentInfo: {},
        draftAppointmentCreateStatus: FETCH_STATUS.notStarted,
        selectedSlot: '',
      };
    default:
      return state;
  }
}

export default ccAppointmentReducer;
