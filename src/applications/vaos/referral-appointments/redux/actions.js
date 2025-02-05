import { formatISO, differenceInMilliseconds } from 'date-fns';

import { captureError } from '../../utils/error';
import {
  postReferralAppointment,
  postDraftReferralAppointment,
  getProviderById,
  getPatientReferrals,
  getPatientReferralById,
} from '../../services/referral';
import { filterReferrals } from '../utils/referrals';

export const SET_FORM_CURRENT_PAGE = 'SET_FORM_CURRENT_PAGE';
export const CREATE_REFERRAL_APPOINTMENT = 'CREATE_REFERRAL_APPOINTMENT';
export const CREATE_REFERRAL_APPOINTMENT_SUCCEEDED =
  'CREATE_REFERRAL_APPOINTMENT_SUCCEEDED';
export const CREATE_REFERRAL_APPOINTMENT_FAILED =
  'CREATE_REFERRAL_APPOINTMENT_FAILED';
export const CREATE_DRAFT_REFERRAL_APPOINTMENT =
  'CREATE_DRAFT_REFERRAL_APPOINTMENT';
export const CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED =
  'CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED';
export const CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED =
  'CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED';
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
export const SET_SELECTED_SLOT = 'SET_SELECTED_SLOT';
export const SET_INIT_REFERRAL_FLOW = 'SET_INIT_REFERRAL_FLOW';

export function setFormCurrentPage(currentPage) {
  return {
    type: SET_FORM_CURRENT_PAGE,
    payload: currentPage,
  };
}

export function createReferralAppointment({
  referralId,
  slotId,
  draftApppointmentId,
  timeOut = 30000,
  retryCount = 0,
}) {
  const retryDelay = 1000; // 1 second
  return async (dispatch, getState) => {
    try {
      // Get the time the request started
      const postAppointmentStartTime =
        getState().referral.postAppointmentStartTime || formatISO(new Date());
      // If the request has been running for more than 30 seconds, stop it
      if (
        differenceInMilliseconds(
          new Date(),
          new Date(postAppointmentStartTime),
        ) > timeOut
      ) {
        dispatch({
          type: CREATE_REFERRAL_APPOINTMENT_FAILED,
        });
        return captureError(new Error('Request timed out'));
      }

      dispatch({
        type: CREATE_REFERRAL_APPOINTMENT,
        payload: { postAppointmentStartTime },
      });
      // Try to create the appointment
      const appointmentInfo = await postReferralAppointment({
        referralId,
        slotId,
        draftApppointmentId,
      });

      // If the appointment is still in draft status, retry the request in 1 second to avoid spamming the api with requests
      if (appointmentInfo.appointment.status === 'draft') {
        setTimeout(() => {
          dispatch(
            createReferralAppointment({
              referralId,
              slotId,
              draftApppointmentId,
              timeOut,
              retryCount: retryCount + 1,
            }),
          );
        }, retryDelay);

        return {};
      }
      dispatch({
        type: CREATE_REFERRAL_APPOINTMENT_SUCCEEDED,
      });

      return appointmentInfo;
    } catch (error) {
      // If the request fails, retry the request up to 3 times
      if (retryCount < 3) {
        setTimeout(() => {
          dispatch(
            createReferralAppointment({
              referralId,
              slotId,
              draftApppointmentId,
              timeOut,
              retryCount: retryCount + 1,
            }),
          );
        }, retryDelay);

        return {};
      }

      dispatch({
        type: CREATE_REFERRAL_APPOINTMENT_FAILED,
      });
      return captureError(error);
    }
  };
}

export function createDraftReferralAppointment(referralId) {
  return async dispatch => {
    try {
      dispatch({
        type: CREATE_DRAFT_REFERRAL_APPOINTMENT,
      });
      const providerDetails = await postDraftReferralAppointment(referralId);

      dispatch({
        type: CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED,
        data: providerDetails,
      });
      return providerDetails;
    } catch (error) {
      dispatch({
        type: CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED,
      });
      return captureError(error);
    }
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
      const filteredReferrals = filterReferrals(referrals);
      dispatch({
        type: FETCH_REFERRALS_SUCCEEDED,
        data: filteredReferrals,
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
    dispatch({
      type: FETCH_REFERRAL,
    });
    try {
      const referral = await getPatientReferralById(id);
      dispatch({
        type: FETCH_REFERRAL_SUCCEEDED,
        data: referral,
      });
      return referral;
    } catch (error) {
      dispatch({
        type: FETCH_REFERRAL_FAILED,
      });
      return captureError(error);
    }
  };
}

export function setSelectedSlot(slot) {
  return {
    type: SET_SELECTED_SLOT,
    payload: slot,
  };
}

export function setInitReferralFlow() {
  return {
    type: SET_INIT_REFERRAL_FLOW,
  };
}
