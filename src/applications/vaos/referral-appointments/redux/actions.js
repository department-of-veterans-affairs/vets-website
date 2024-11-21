import { captureError } from '../../utils/error';
import {
  getProviderById,
  getPatientReferrals,
  getPatientReferralById,
} from '../../services/referral';

export const SET_FACILITY = 'SET_FACILITY';
export const SET_APPOINTMENT_DETAILS = 'SET_APPOINTMENT_DETAILS';
export const SET_SORT_PROVIDER_BY = 'SET_SORT_PROVIDER_BY';
export const SET_SELECTED_PROVIDER = 'SET_SELECTED_PROVIDER';
export const SET_FORM_CURRENT_PAGE = 'SET_FORM_CURRENT_PAGE';
export const FETCH_PROVIDER_DETAILS = 'FETCH_PROVIDER_DETAILS';
export const FETCH_PROVIDER_DETAILS_SUCCEEDED =
  'FETCH_PROVIDER_DETAILS_SUCCEEDED';
export const FETCH_PROVIDER_DETAILS_FAILED = 'FETCH_PROVIDER_DETAILS_FAILED';
export const FETCH_REFERRALS = 'FETCH_REFERRALS';
export const FETCH_REFERRALS_SUCCEEDED = 'FETCH_REFERRALS_SUCCEEDED';
export const FETCH_REFERRALS_FAILED = 'FETCH_REFERRALS_FAILED';
export const FETCH_REFERRAL = 'FETCH_REFERRAL';
export const FETCH_REFERRAL_SUCCEEDED = 'FETCH_REFERRAL_SUCCEEDED';
export const FETCH_REFERRAL_FAILED = 'FETCH_REFERRAL_FAILED';

export function setFacility(facility) {
  return {
    type: SET_FACILITY,
    payload: facility,
  };
}

export function setAppointmentDetails(dateTime, facility) {
  return {
    type: SET_APPOINTMENT_DETAILS,
    payload: {
      dateTime,
      facility,
    },
  };
}

export function setSortProviderBy(sortProviderBy) {
  return {
    type: SET_SORT_PROVIDER_BY,
    payload: sortProviderBy,
  };
}

export function setSelectedProvider(selectedProvider) {
  return {
    type: SET_SELECTED_PROVIDER,
    payload: selectedProvider,
  };
}

export function setFormCurrentPage(currentPage) {
  return {
    type: SET_FORM_CURRENT_PAGE,
    payload: currentPage,
  };
}

export function fetchProviderDetails(id) {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_PROVIDER_DETAILS,
      });
      const providerDetails = await getProviderById(id);

      dispatch({
        type: FETCH_PROVIDER_DETAILS_SUCCEEDED,
        data: providerDetails,
      });
      return providerDetails;
    } catch (error) {
      dispatch({
        type: FETCH_PROVIDER_DETAILS_FAILED,
      });
      return captureError(error);
    }
  };
}

export function fetchReferrals() {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_REFERRALS,
      });
      const referrals = await getPatientReferrals();

      dispatch({
        type: FETCH_REFERRALS_SUCCEEDED,
        data: referrals,
      });
      return referrals;
    } catch (error) {
      dispatch({
        type: FETCH_REFERRALS_FAILED,
      });
      return captureError(error);
    }
  };
}

export function fetchReferralById(id) {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_REFERRAL,
      });
      const referrals = await getPatientReferralById(id);
      dispatch({
        type: FETCH_REFERRAL_SUCCEEDED,
        data: Object.keys(referrals).length ? [referrals] : [],
      });
      return referrals;
    } catch (error) {
      dispatch({
        type: FETCH_REFERRAL_FAILED,
      });
      return captureError(error);
    }
  };
}
