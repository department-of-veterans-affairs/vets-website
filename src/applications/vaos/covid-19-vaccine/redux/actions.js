import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  selectVAPEmailAddress,
  selectVAPHomePhoneString,
  selectVAPMobilePhoneString,
  selectVAPResidentialAddress,
} from '@department-of-veterans-affairs/platform-user/exports';
import { format, isAfter, isDate, parseISO, startOfMinute } from 'date-fns';
import {
  selectFeatureUseBrowserTimezone,
  selectSystemIds,
  selectFeatureUseVpg,
} from '../../redux/selectors';
import {
  STARTED_NEW_APPOINTMENT_FLOW,
  VACCINE_FORM_SUBMIT_SUCCEEDED,
} from '../../redux/sitewide';
import { createAppointment } from '../../services/appointment';
import { getAvailableHealthcareServices } from '../../services/healthcare-service';
import {
  getLocationsByTypeOfCareAndSiteIds,
  getSiteIdFromFacilityId,
} from '../../services/location';
import { getSlots } from '../../services/slot';
import { getPreciseLocation } from '../../utils/address';
import {
  FACILITY_SORT_METHODS,
  GA_PREFIX,
  TYPES_OF_CARE,
  TYPE_OF_CARE_IDS,
} from '../../utils/constants';
import { captureError, has400LevelError } from '../../utils/error';
import {
  recordEligibilityFailure,
  recordItemsRetrieved,
  resetDataLayer,
} from '../../utils/events';
import { transformFormToVAOSAppointment } from './helpers/formSubmitTransformers';
import {
  selectCovid19VaccineFormData,
  selectCovid19VaccineNewBooking,
} from './selectors';

export const FORM_PAGE_OPENED = 'covid19Vaccine/FORM_PAGE_OPENED';
export const FORM_DATA_UPDATED = 'covid19Vaccine/FORM_DATA_UPDATED';
export const FORM_PAGE_CHANGE_STARTED =
  'covid19Vaccine/FORM_PAGE_CHANGE_STARTED';
export const START_APPOINTMENT_FLOW = 'covid19Vaccine/START_APPOINTMENT_FLOW';
export const FORM_PAGE_CHANGE_COMPLETED =
  'covid19Vaccine/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_CALENDAR_FETCH_SLOTS =
  'covid19Vaccine/FORM_CALENDAR_FETCH_SLOTS';
export const FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED =
  'covid19Vaccine/FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED';
export const FORM_CALENDAR_FETCH_SLOTS_FAILED =
  'covid19Vaccine/FORM_CALENDAR_FETCH_SLOTS_FAILED';
export const FORM_CALENDAR_DATA_CHANGED =
  'covid19Vaccine/FORM_CALENDAR_DATA_CHANGED';
export const FORM_RESET = 'covid19Vaccine/FORM_RESET';
export const FORM_SUBMIT = 'covid19Vaccine/FORM_SUBMIT';
export const FORM_PAGE_FACILITY_OPEN = 'covid19Vaccine/FORM_PAGE_FACILITY_OPEN';
export const FORM_PAGE_FACILITY_OPEN_SUCCEEDED =
  'covid19Vaccine/FORM_PAGE_FACILITY_OPEN_SUCCEEDED';
export const FORM_PAGE_FACILITY_OPEN_FAILED =
  'covid19Vaccine/FORM_PAGE_FACILITY_OPEN_FAILED';
export const FORM_FETCH_CLINICS = 'covid19Vaccine/FORM_PAGE_FETCH_CLINICS';
export const FORM_FETCH_CLINICS_SUCCEEDED =
  'covid19Vaccine/FORM_PAGE_FETCH_CLINICS_SUCCEEDED';
export const FORM_FETCH_CLINICS_FAILED =
  'covid19Vaccine/FORM_PAGE_FETCH_CLINICS_FAILED';
export const FORM_SHOW_ELIGIBILITY_MODAL =
  'covid19Vaccine/FORM_SHOW_ELIGIBILITY_MODAL';
export const FORM_HIDE_ELIGIBILITY_MODAL =
  'covid19Vaccine/FORM_HIDE_ELIGIBILITY_MODAL';
export const FORM_REQUEST_CURRENT_LOCATION =
  'covid19Vaccine/FORM_REQUEST_CURRENT_LOCATION';
export const FORM_REQUEST_CURRENT_LOCATION_FAILED =
  'covid19Vaccine/FORM_REQUEST_CURRENT_LOCATION_FAILED';
export const FORM_PAGE_FACILITY_SORT_METHOD_UPDATED =
  'covid19Vaccine/FORM_PAGE_FACILITY_SORT_METHOD_UPDATED';
export const FORM_SUBMIT_FAILED = 'covid19Vaccine/FORM_SUBMIT_FAILED';
export const FORM_CLINIC_PAGE_OPENED_SUCCEEDED =
  'covid19Vaccine/FORM_CLINIC_PAGE_OPENED_SUCCEEDED';
export const FORM_PREFILL_CONTACT_INFO =
  'covid19Vaccine/FORM_PREFILL_CONTACT_INFO';
export const FORM_PAGE_CONTACT_FACILITIES_OPEN =
  'covid19Vaccine/FORM_CONTACT_FACILITIES_OPEN';
export const FORM_PAGE_CONTACT_FACILITIES_OPEN_SUCCEEDED =
  'covid19Vaccine/FORM_CONTACT_FACILITIES_OPEN_SUCCEEDED';
export const FORM_PAGE_CONTACT_FACILITIES_OPEN_FAILED =
  'covid19Vaccine/FORM_CONTACT_FACILITIES_OPEN_FAILED';

export const GA_FLOWS = {
  DIRECT: 'direct',
};

export function startNewAppointmentFlow() {
  return {
    type: STARTED_NEW_APPOINTMENT_FLOW,
  };
}

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
        typeOfCare: TYPES_OF_CARE.find(
          typeOfCare => typeOfCare.id === TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
        ),
      });
      dispatch({
        type: FORM_FETCH_CLINICS_SUCCEEDED,
        clinics,
        facilityId,
        showModal,
      });
    } catch (e) {
      captureError(e);
      dispatch({
        type: FORM_FETCH_CLINICS_FAILED,
      });
    }

    return clinics;
  };
}

export function openFacilityPage() {
  return async (dispatch, getState) => {
    try {
      const initialState = getState();
      const newBooking = selectCovid19VaccineNewBooking(initialState);
      const siteIds = selectSystemIds(initialState);
      let { facilities } = newBooking;
      let facilityId = newBooking.data.vaFacility;
      const featureUseVpg = selectFeatureUseVpg(initialState);

      dispatch({
        type: FORM_PAGE_FACILITY_OPEN,
      });

      // Fetch facilities that support this type of care
      if (!facilities) {
        facilities = await getLocationsByTypeOfCareAndSiteIds({
          siteIds,
          useVpg: featureUseVpg,
        });
      }

      recordItemsRetrieved('covid19_available_facilities', facilities?.length);

      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        facilities: facilities || [],
        address: selectVAPResidentialAddress(initialState),
        useVpg: featureUseVpg,
      });

      // If we have an already selected location or only have a single location
      // fetch eligbility data immediately
      const supportedFacilities = facilities?.filter(
        facility =>
          featureUseVpg
            ? facility.legacyVAR.settings[TYPE_OF_CARE_IDS.COVID_VACCINE_ID]
                ?.bookedAppointments
            : facility.legacyVAR.settings[TYPE_OF_CARE_IDS.COVID_VACCINE_ID]
                ?.direct.enabled,
      );
      const clinicsNeeded = !!facilityId || supportedFacilities?.length === 1;

      if (!facilities.length) {
        recordEligibilityFailure(
          'covid19-supported-facilities',
          TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
        );
      }

      if (clinicsNeeded && !facilityId) {
        facilityId = supportedFacilities[0].id;
      }

      const clinics = newBooking.clinics[facilityId] || null;
      if (clinicsNeeded && !clinics) {
        dispatch(getClinics({ facilityId }));
      }
    } catch (e) {
      captureError(e, false, 'covid19 vaccine facility page');
      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_FAILED,
      });
    }
  };
}

export function updateFacilitySortMethod(sortMethod, uiSchema) {
  return async (dispatch, getState) => {
    let location = null;
    const { facilities } = selectCovid19VaccineNewBooking(getState());
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
        captureError(e, true);
        dispatch({
          type: FORM_REQUEST_CURRENT_LOCATION_FAILED,
        });
      }
    } else {
      dispatch(action);
    }
  };
}

export function getAppointmentSlots(start, end, initialFetch = false) {
  return async (dispatch, getState) => {
    const state = getState();
    const siteId = getSiteIdFromFacilityId(
      selectCovid19VaccineFormData(state).vaFacility,
    );
    const newBooking = selectCovid19VaccineNewBooking(state);
    const { data } = newBooking;

    let startDate = start;
    let endDate = end;

    if (!isDate(start)) {
      startDate = parseISO(start);
    }

    if (!isDate(end)) {
      endDate = parseISO(end);
    }

    let fetchedAppointmentSlotMonths = [];
    let fetchedStartMonth = false;
    let fetchedEndMonth = false;
    let availableSlots = [];

    if (!initialFetch) {
      fetchedAppointmentSlotMonths = [
        ...newBooking.fetchedAppointmentSlotMonths,
      ];

      fetchedStartMonth = fetchedAppointmentSlotMonths.includes(
        format(startDate, 'yyyy-MM'),
      );
      fetchedEndMonth = fetchedAppointmentSlotMonths.includes(
        format(endDate, 'yyyy-MM'),
      );
      availableSlots = newBooking.availableSlots || [];
    }

    if (!fetchedStartMonth || !fetchedEndMonth) {
      let mappedSlots = [];
      dispatch({ type: FORM_CALENDAR_FETCH_SLOTS });

      try {
        const fetchedSlots = await getSlots({
          siteId,
          clinicId: data.clinicId,
          startDate,
          endDate,
        });

        if (initialFetch) {
          recordItemsRetrieved('covid_slots', fetchedSlots?.length);
        }

        mappedSlots = fetchedSlots.filter(slot => {
          return isAfter(
            startOfMinute(new Date(slot.start)),
            startOfMinute(new Date(new Date().toISOString())),
          );
        });

        // Keep track of which months we've fetched already so we don't
        // make duplicate calls
        if (!fetchedStartMonth) {
          fetchedAppointmentSlotMonths.push(format(startDate, 'yyyy-MM'));
        }

        if (!fetchedEndMonth) {
          fetchedAppointmentSlotMonths.push(format(endDate, 'yyyy-MM'));
        }

        const sortedSlots = [...availableSlots, ...mappedSlots].sort((a, b) =>
          a.start.localeCompare(b.start),
        );

        dispatch({
          type: FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
          availableSlots: sortedSlots,
          fetchedAppointmentSlotMonths: fetchedAppointmentSlotMonths.sort(),
        });
      } catch (e) {
        captureError(e);
        dispatch({
          type: FORM_CALENDAR_FETCH_SLOTS_FAILED,
        });
      }
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

export function prefillContactInfo() {
  return (dispatch, getState) => {
    const state = getState();
    const email = selectVAPEmailAddress(state);
    const homePhone = selectVAPHomePhoneString(state);
    const mobilePhone = selectVAPMobilePhoneString(state);

    dispatch({
      type: FORM_PREFILL_CONTACT_INFO,
      email,
      phoneNumber: mobilePhone || homePhone,
    });
  };
}

export function confirmAppointment(history) {
  return async (dispatch, getState) => {
    const state = getState();
    const featureUseBrowserTimezone = selectFeatureUseBrowserTimezone(state);

    dispatch({
      type: FORM_SUBMIT,
    });

    const additionalEventData = {
      'health-TypeOfCare': 'COVID-19 Vaccine',
    };

    recordEvent({
      event: `${GA_PREFIX}-covid19-submission`,
      flow: GA_FLOWS.DIRECT,
      ...additionalEventData,
    });

    try {
      const appointment = await createAppointment({
        appointment: transformFormToVAOSAppointment(getState()),
        featureUseBrowserTimezone,
      });

      const data = selectCovid19VaccineFormData(getState());
      const facilityID = {
        'facility-id': data.vaFacility,
      };

      dispatch({
        type: VACCINE_FORM_SUBMIT_SUCCEEDED,
      });

      recordEvent({
        event: `${GA_PREFIX}-covid19-submission-successful`,
        flow: GA_FLOWS.DIRECT,
        ...additionalEventData,
        ...facilityID,
      });
      resetDataLayer();
      history.push(`/${appointment.id}?confirmMsg=true`);
    } catch (error) {
      captureError(error, true, 'COVID-19 vaccine submission failure');
      dispatch({
        type: FORM_SUBMIT_FAILED,
        isVaos400Error: has400LevelError(error),
      });

      recordEvent({
        event: `${GA_PREFIX}-covid19-submission-failed`,
        flow: GA_FLOWS.DIRECT,
        ...additionalEventData,
      });
      resetDataLayer();
    }
  };
}

export function onCalendarChange(selectedDates, pageKey) {
  return {
    type: FORM_CALENDAR_DATA_CHANGED,
    selectedDates,
    pageKey,
  };
}

export function openContactFacilitiesPage() {
  return async (dispatch, getState) => {
    try {
      const initialState = getState();
      const newBooking = selectCovid19VaccineNewBooking(initialState);
      const siteIds = selectSystemIds(initialState);
      let { facilities } = newBooking;
      const featureUseVpg = selectFeatureUseVpg(initialState);

      dispatch({
        type: FORM_PAGE_CONTACT_FACILITIES_OPEN,
      });

      // Fetch facilities that support this type of care
      if (!facilities) {
        facilities = await getLocationsByTypeOfCareAndSiteIds({
          siteIds,
          useVpg: featureUseVpg,
        });
      }

      recordItemsRetrieved('covid19_available_facilities', facilities?.length);

      dispatch({
        type: FORM_PAGE_CONTACT_FACILITIES_OPEN_SUCCEEDED,
        facilities: facilities || [],
        address: selectVAPResidentialAddress(initialState),
      });
    } catch (e) {
      captureError(e, false, 'vaccine facility page');
      dispatch({
        type: FORM_PAGE_CONTACT_FACILITIES_OPEN_FAILED,
      });
    }
  };
}

export function getVAFacilityNextPage() {
  return async (state, dispatch) => {
    const formData = selectCovid19VaccineFormData(state);
    let clinics = selectCovid19VaccineNewBooking(state).clinics?.[
      formData.vaFacility
    ];
    if (!clinics) {
      clinics = await dispatch(
        getClinics({
          facilityId: formData.vaFacility,
          showModal: true,
        }),
      );
    }

    if (!clinics?.length) {
      dispatch(showEligibilityModal());
      return 'vaFacility';
    }

    if (clinics.length === 1) {
      return 'selectDate1';
    }
    return 'clinicChoice';
  };
}

export function getReceivedDoseScreenerNextPage() {
  return async state => {
    const formData = selectCovid19VaccineFormData(state);
    if (formData.hasReceivedDose) {
      recordEvent({
        event: `${GA_PREFIX}-covid19-screener-yes`,
      });
      return 'contactFacilities';
    }
    recordEvent({
      event: `${GA_PREFIX}-covid19-screener-no`,
    });
    return 'vaFacility';
  };
}
