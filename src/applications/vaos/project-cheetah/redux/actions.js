import { selectVAPResidentialAddress } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { selectSystemIds } from '../../redux/selectors';
import { getAvailableHealthcareServices } from '../../services/healthcare-service';
import {
  getLocationsByTypeOfCareAndSiteIds,
  getSiteIdFromFakeFHIRId,
} from '../../services/location';
import { getPreciseLocation } from '../../utils/address';
import { FACILITY_SORT_METHODS, GA_PREFIX } from '../../utils/constants';
import { captureError } from '../../utils/error';
import {
  recordEligibilityFailure,
  recordItemsRetrieved,
} from '../../utils/events';
import newBookingFlow from '../flow';
import { TYPE_OF_CARE_ID } from '../utils';
import { selectProjectCheetahNewBooking } from './selectors';

export const FORM_PAGE_OPENED = 'projectCheetah/FORM_PAGE_OPENED';
export const FORM_DATA_UPDATED = 'projectCheetah/FORM_DATA_UPDATED';
export const FORM_PAGE_CHANGE_STARTED =
  'projectCheetah/FORM_PAGE_CHANGE_STARTED';
export const FORM_PAGE_CHANGE_COMPLETED =
  'projectCheetah/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_RESET = 'projectCheetah/FORM_RESET';
export const FORM_SUBMIT = 'projectCheetah/FORM_SUBMIT';
export const FORM_PAGE_FACILITY_OPEN = 'projectCheetah/FORM_PAGE_FACILITY_OPEN';
export const FORM_PAGE_FACILITY_OPEN_SUCCEEDED =
  'projectCheetah/FORM_PAGE_FACILITY_OPEN_SUCCEEDED';
export const FORM_PAGE_FACILITY_OPEN_FAILED =
  'projectCheetah/FORM_PAGE_FACILITY_OPEN_FAILED';
export const FORM_FETCH_CLINICS = 'projectCheetah/FORM_PAGE_FETCH_CLINICS';
export const FORM_FETCH_CLINICS_SUCCEEDED =
  'projectCheetah/FORM_PAGE_FETCH_CLINICS_SUCCEEDED';
export const FORM_FETCH_CLINICS_FAILED =
  'projectCheetah/FORM_PAGE_FETCH_CLINICS_FAILED';
export const FORM_SHOW_ELIGIBILITY_MODAL =
  'projectCheetah/FORM_SHOW_ELIGIBILITY_MODAL';
export const FORM_HIDE_ELIGIBILITY_MODAL =
  'projectCheetah/FORM_HIDE_ELIGIBILITY_MODAL';
export const FORM_REQUEST_CURRENT_LOCATION =
  'projectCheetah/FORM_REQUEST_CURRENT_LOCATION';
export const FORM_REQUEST_CURRENT_LOCATION_FAILED =
  'projectCheetah/FORM_REQUEST_CURRENT_LOCATION_FAILED';
export const FORM_PAGE_FACILITY_SORT_METHOD_UPDATED =
  'projectCheetah/FORM_PAGE_FACILITY_SORT_METHOD_UPDATED';
export const FORM_SUBMIT_SUCCEEDED = 'projectCheetah/FORM_SUBMIT_SUCCEEDED';
export const FORM_SUBMIT_FAILED = 'projectCheetah/FORM_SUBMIT_FAILED';
export const FORM_CLINIC_PAGE_OPENED_SUCCEEDED =
  'projectCheetah/FORM_CLINIC_PAGE_OPENED_SUCCEEDED';

export function openFormPage(page, uiSchema, schema) {
  return {
    type: FORM_PAGE_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function updateFormData(page, uiSchema, data) {
  return {
    type: FORM_DATA_UPDATED,
    page,
    uiSchema,
    data,
  };
}

export function getClinics({ facilityId, showModal = false }) {
  return async dispatch => {
    let clinics;
    try {
      dispatch({ type: FORM_FETCH_CLINICS });
      clinics = await getAvailableHealthcareServices({
        facilityId,
        typeOfCareId: TYPE_OF_CARE_ID,
        systemId: getSiteIdFromFakeFHIRId(facilityId),
      });
      dispatch({
        type: FORM_FETCH_CLINICS_SUCCEEDED,
        clinics,
        facilityId,
        showModal,
      });
    } catch (e) {
      captureError(e, false, 'cheetah facility page');
      dispatch({
        type: FORM_FETCH_CLINICS_FAILED,
      });
    }

    return clinics;
  };
}

export function openFacilityPage(uiSchema, schema) {
  return async (dispatch, getState) => {
    try {
      const initialState = getState();
      const newBooking = selectProjectCheetahNewBooking(initialState);
      const siteIds = selectSystemIds(initialState);
      let facilities = newBooking.facilities;
      let facilityId = newBooking.data.vaFacility;

      dispatch({
        type: FORM_PAGE_FACILITY_OPEN,
      });

      // Fetch facilities that support this type of care
      if (!facilities) {
        facilities = await getLocationsByTypeOfCareAndSiteIds({
          siteIds,
          directSchedulingEnabled: true,
        });
      }

      recordItemsRetrieved('cheetah_available_facilities', facilities?.length);

      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        facilities: facilities || [],
        schema,
        uiSchema,
        address: selectVAPResidentialAddress(initialState),
      });

      // If we have an already selected location or only have a single location
      // fetch eligbility data immediately
      const supportedFacilities = facilities?.filter(
        facility =>
          facility.legacyVAR.directSchedulingSupported[TYPE_OF_CARE_ID],
      );
      const clinicsNeeded = !!facilityId || supportedFacilities?.length === 1;

      if (!facilities.length) {
        recordEligibilityFailure('cheetah-supported-facilities', 'Cheetah');
      }

      if (clinicsNeeded && !facilityId) {
        facilityId = supportedFacilities[0].id;
      }

      const clinics = newBooking.clinics[facilityId] || null;
      if (clinicsNeeded && !clinics) {
        dispatch(getClinics({ facilityId }));
      }
    } catch (e) {
      captureError(e, false, 'cheetah facility page');
      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_FAILED,
      });
    }
  };
}

export function updateFacilitySortMethod(sortMethod, uiSchema) {
  return async (dispatch, getState) => {
    let location = null;
    const facilities = selectProjectCheetahNewBooking(getState()).facilities;
    const calculatedDistanceFromCurrentLocation = facilities.some(
      f => !!f.legacyVAR?.distanceFromCurrentLocation,
    );

    const action = {
      type: FORM_PAGE_FACILITY_SORT_METHOD_UPDATED,
      sortMethod,
      uiSchema,
    };

    if (
      sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation &&
      !calculatedDistanceFromCurrentLocation
    ) {
      dispatch({
        type: FORM_REQUEST_CURRENT_LOCATION,
      });
      recordEvent({
        event: `${GA_PREFIX}-request-current-location-clicked`,
      });
      try {
        location = await getPreciseLocation();
        recordEvent({
          event: `${GA_PREFIX}-request-current-location-allowed`,
        });
        dispatch({
          ...action,
          location,
        });
      } catch (e) {
        recordEvent({
          event: `${GA_PREFIX}-request-current-location-blocked`,
        });
        captureError(e, true, 'facility page');
        dispatch({
          type: FORM_REQUEST_CURRENT_LOCATION_FAILED,
        });
      }
    } else {
      dispatch(action);
    }
  };
}

export function showEligibilityModal() {
  return {
    type: FORM_SHOW_ELIGIBILITY_MODAL,
  };
}

export function hideEligibilityModal() {
  return {
    type: FORM_HIDE_ELIGIBILITY_MODAL,
  };
}

export function openClinicPage(page, uiSchema, schema) {
  return {
    type: FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
    page,
    uiSchema,
    schema,
  };
}

export function routeToPageInFlow(flow, history, current, action) {
  return async (dispatch, getState) => {
    dispatch({
      type: FORM_PAGE_CHANGE_STARTED,
      pageKey: current,
    });

    let nextPage;
    let nextStateKey;

    if (action === 'next') {
      const nextAction = flow[current][action];
      if (typeof nextAction === 'string') {
        nextPage = flow[nextAction];
        nextStateKey = nextAction;
      } else {
        nextStateKey = await nextAction(getState(), dispatch);
        nextPage = flow[nextStateKey];
      }
    } else {
      const state = getState();
      const previousPage =
        state.projectCheetah.newBooking.previousPages[current];
      nextPage = flow[previousPage];
    }

    if (nextPage?.url) {
      dispatch({
        type: FORM_PAGE_CHANGE_COMPLETED,
        pageKey: current,
        pageKeyNext: nextStateKey,
        direction: action,
      });
      history.push(nextPage.url);
    } else if (nextPage) {
      throw new Error(`Tried to route to a page without a url: ${nextPage}`);
    } else {
      throw new Error('Tried to route to page that does not exist');
    }
  };
}

export function routeToNextAppointmentPage(history, current) {
  return routeToPageInFlow(newBookingFlow, history, current, 'next');
}

export function routeToPreviousAppointmentPage(history, current) {
  return routeToPageInFlow(newBookingFlow, history, current, 'previous');
}
