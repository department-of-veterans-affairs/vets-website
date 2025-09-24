import { captureError } from '../../utils/error';
import { getProviderById } from '../../services/referral';
// import { filterReferrals } from '../utils/referrals';
import { STARTED_NEW_APPOINTMENT_FLOW } from '../../redux/sitewide';

export const SET_FORM_CURRENT_PAGE = 'SET_FORM_CURRENT_PAGE';
export const FETCH_PROVIDER_DETAILS = 'FETCH_PROVIDER_DETAILS';
export const FETCH_PROVIDER_DETAILS_SUCCEEDED =
  'FETCH_PROVIDER_DETAILS_SUCCEEDED';
export const FETCH_PROVIDER_DETAILS_FAILED = 'FETCH_PROVIDER_DETAILS_FAILED';
export const FETCH_REFERRAL = 'FETCH_REFERRAL';
export const SET_SELECTED_SLOT_START_TIME = 'SET_SELECTED_SLOT_START_TIME';
export const SET_INIT_REFERRAL_FLOW = 'SET_INIT_REFERRAL_FLOW';

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
