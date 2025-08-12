import { formatISO, differenceInMilliseconds } from 'date-fns';

import { captureError } from '../../utils/error';
import { getProviderById, getAppointmentInfo } from '../../services/referral';
// import { filterReferrals } from '../utils/referrals';
import { STARTED_NEW_APPOINTMENT_FLOW } from '../../redux/sitewide';

export const SET_FORM_CURRENT_PAGE = 'SET_FORM_CURRENT_PAGE';
export const CACHE_DRAFT_REFERRAL_APPOINTMENT =
  'CACHE_DRAFT_REFERRAL_APPOINTMENT';
export const FETCH_PROVIDER_DETAILS = 'FETCH_PROVIDER_DETAILS';
export const FETCH_PROVIDER_DETAILS_SUCCEEDED =
  'FETCH_PROVIDER_DETAILS_SUCCEEDED';
export const FETCH_PROVIDER_DETAILS_FAILED = 'FETCH_PROVIDER_DETAILS_FAILED';
export const FETCH_REFERRAL_APPOINTMENT_INFO =
  'FETCH_REFERRAL_APPOINTMENT_INFO';
export const FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED =
  'FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED';
export const FETCH_REFERRAL_APPOINTMENT_INFO_FAILED =
  'FETCH_REFERRAL_APPOINTMENT_INFO_FAILED';
export const FETCH_REFERRAL = 'FETCH_REFERRAL';
export const SET_SELECTED_SLOT_START_TIME = 'SET_SELECTED_SLOT_START_TIME';
export const SET_INIT_REFERRAL_FLOW = 'SET_INIT_REFERRAL_FLOW';

export function setFormCurrentPage(currentPage) {
  return {
    type: SET_FORM_CURRENT_PAGE,
    payload: currentPage,
  };
}

export function cacheDraftReferralAppointment(data) {
  return async dispatch => {
    dispatch({
      type: CACHE_DRAFT_REFERRAL_APPOINTMENT,
      data,
    });
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

export function pollFetchAppointmentInfo(
  appointmentId,
  { timeOut = 30000, retryCount = 0, retryDelay = 1000 },
) {
  return async (dispatch, getState) => {
    try {
      const { referral } = getState();
      // Get the time the request started
      const pollingRequestStart =
        referral.pollingRequestStart || formatISO(new Date());

      // Calculate the time the request has been running
      const requestTime = differenceInMilliseconds(
        new Date(),
        new Date(pollingRequestStart),
      );
      // If the request has been running for more than the timeout, stop it
      if (requestTime > timeOut) {
        dispatch({
          type: FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
          payload: true,
        });
        return captureError(new Error('Request timed out'));
      }
      // Poll the api for state change
      dispatch({
        type: FETCH_REFERRAL_APPOINTMENT_INFO,
        payload: {
          pollingRequestStart,
        },
      });
      const appointmentInfo = await getAppointmentInfo(appointmentId);
      // If the appointment is still in draft state, retry the request in 1 second to avoid spamming the api with requests
      if (appointmentInfo.attributes?.status !== 'booked') {
        setTimeout(() => {
          dispatch(
            pollFetchAppointmentInfo(appointmentId, {
              retryCount: retryCount + 1,
            }),
          );
        }, retryDelay);

        return null;
      }
      dispatch({
        type: FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED,
        data: appointmentInfo,
      });
      return appointmentInfo;
    } catch (error) {
      dispatch({ type: FETCH_REFERRAL_APPOINTMENT_INFO_FAILED });
      return captureError(error);
    }
  };
}

export function fetchAppointmentInfo(appointmentId) {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_REFERRAL_APPOINTMENT_INFO,
        payload: {
          pollingRequestStart: formatISO(new Date()),
        },
      });
      const appointmentInfo = await getAppointmentInfo(appointmentId);
      dispatch({
        type: FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED,
        data: appointmentInfo,
      });
      return appointmentInfo;
    } catch (error) {
      dispatch({
        type: FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
      });
      return captureError(error);
    }
  };
}

export function setSelectedSlotStartTime(slotStartTime) {
  return {
    type: SET_SELECTED_SLOT_START_TIME,
    payload: slotStartTime,
  };
}

export function setInitReferralFlow() {
  return {
    type: SET_INIT_REFERRAL_FLOW,
  };
}

export function startNewAppointmentFlow() {
  return {
    type: STARTED_NEW_APPOINTMENT_FLOW,
  };
}
