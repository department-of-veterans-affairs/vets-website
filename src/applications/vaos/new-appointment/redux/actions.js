import moment from 'moment';
import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';

import {
  selectVet360EmailAddress,
  selectVet360HomePhoneString,
  selectVet360MobilePhoneString,
  selectIsCernerOnlyPatient,
} from 'platform/user/selectors';
import newAppointmentFlow from '../newAppointmentFlow';
import {
  getTypeOfCare,
  vaosDirectScheduling,
  getNewAppointment,
  getFormData,
  vaosCommunityCare,
  selectSystemIds,
  getEligibilityStatus,
  getRootIdForChosenFacility,
  getSiteIdForChosenFacility,
  vaosVSPAppointmentNew,
  getCCEType,
} from '../../utils/selectors';
import {
  getPreferences,
  updatePreferences,
  submitRequest,
  submitAppointment,
  sendRequestMessage,
  getSitesSupportingVAR,
  getCommunityCare,
} from '../../services/var';
import {
  getOrganizations,
  getIdOfRootOrganization,
  getSiteIdFromOrganization,
} from '../../services/organization';
import { getLocation, getParentOfLocation } from '../../services/location';
import { getSupportedHealthcareServicesAndLocations } from '../../services/healthcare-service';
import { getSlots } from '../../services/slot';
import {
  FACILITY_TYPES,
  FLOW_TYPES,
  GA_PREFIX,
  GA_FLOWS,
} from '../../utils/constants';
import {
  transformFormToVARequest,
  transformFormToCCRequest,
  transformFormToAppointment,
  createPreferenceBody,
} from '../../utils/data';

import {
  getEligibilityData,
  recordEligibilityGAEvents,
  logEligibilityExplanation,
} from '../../utils/eligibility';

import { recordEligibilityFailure, resetDataLayer } from '../../utils/events';

import {
  captureError,
  getErrorCodes,
  has400LevelError,
} from '../../utils/error';

import {
  STARTED_NEW_APPOINTMENT_FLOW,
  FORM_SUBMIT_SUCCEEDED,
} from '../../redux/sitewide';

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id.replace('var', '');
}

export const FORM_DATA_UPDATED = 'newAppointment/FORM_DATA_UPDATED';
export const FORM_PAGE_OPENED = 'newAppointment/FORM_PAGE_OPENED';
export const FORM_RESET = 'newAppointment/FORM_RESET';
export const FORM_TYPE_OF_CARE_PAGE_OPENED =
  'newAppointment/TYPE_OF_CARE_PAGE_OPENED';
export const FORM_PAGE_CHANGE_STARTED =
  'newAppointment/FORM_PAGE_CHANGE_STARTED';
export const FORM_PAGE_CHANGE_COMPLETED =
  'newAppointment/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_UPDATE_FACILITY_TYPE =
  'newAppointment/FORM_UPDATE_FACILITY_TYPE';
export const FORM_PAGE_FACILITY_OPEN = 'newAppointment/FACILITY_PAGE_OPEN';
export const FORM_PAGE_FACILITY_V2_OPEN =
  'newAppointment/FACILITY_PAGE_V2_OPEN';
export const FORM_PAGE_FACILITY_V2_OPEN_SUCCEEDED =
  'newAppointment/FACILITY_PAGE_V2_OPEN_SUCCEEDED';
export const FORM_PAGE_FACILITY_V2_OPEN_FAILED =
  'newAppointment/FACILITY_PAGE_V2_OPEN_FAILED';
export const FORM_PAGE_FACILITY_OPEN_SUCCEEDED =
  'newAppointment/FACILITY_PAGE_OPEN_SUCCEEDED';
export const FORM_PAGE_FACILITY_OPEN_FAILED =
  'newAppointment/FACILITY_PAGE_OPEN_FAILED';
export const FORM_FETCH_PARENT_FACILITIES =
  'newAppointment/FORM_FETCH_PARENT_FACILITIES';
export const FORM_FETCH_PARENT_FACILITIES_SUCCEEDED =
  'newAppointment/FORM_FETCH_PARENT_FACILITIES_SUCCEEDED';
export const FORM_FETCH_PARENT_FACILITIES_FAILED =
  'newAppointment/FORM_FETCH_PARENT_FACILITIES_FAILED';
export const FORM_FETCH_CHILD_FACILITIES =
  'newAppointment/FORM_FETCH_CHILD_FACILITIES';
export const FORM_FETCH_CHILD_FACILITIES_SUCCEEDED =
  'newAppointment/FORM_FETCH_CHILD_FACILITIES_SUCCEEDED';
export const FORM_FETCH_CHILD_FACILITIES_FAILED =
  'newAppointment/FORM_FETCH_CHILD_FACILITIES_FAILED';
export const FORM_FETCH_FACILITY_DETAILS =
  'newAppointment/FORM_FETCH_FACILITY_DETAILS';
export const FORM_FETCH_FACILITY_DETAILS_SUCCEEDED =
  'newAppointment/FORM_FETCH_FACILITY_DETAILS_SUCCEEDED';
export const FORM_VA_PARENT_CHANGED = 'newAppointment/FORM_VA_PARENT_CHANGED';
export const FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS =
  'newAppointment/FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS';
export const FORM_ELIGIBILITY_CHECKS = 'newAppointment/FORM_ELIGIBILITY_CHECKS';
export const FORM_ELIGIBILITY_CHECKS_SUCCEEDED =
  'newAppointment/FORM_ELIGIBILITY_CHECKS_SUCCEEDED';
export const FORM_ELIGIBILITY_CHECKS_FAILED =
  'newAppointment/FORM_ELIGIBILITY_CHECKS_FAILED';
export const FORM_CLINIC_PAGE_OPENED = 'newAppointment/FORM_CLINIC_PAGE_OPENED';
export const FORM_CLINIC_PAGE_OPENED_SUCCEEDED =
  'newAppointment/FORM_CLINIC_PAGE_OPENED_SUCCEEDED';
export const START_DIRECT_SCHEDULE_FLOW =
  'newAppointment/START_DIRECT_SCHEDULE_FLOW';
export const START_REQUEST_APPOINTMENT_FLOW =
  'newAppointment/START_REQUEST_APPOINTMENT_FLOW';
export const FORM_CALENDAR_FETCH_SLOTS =
  'newAppointment/FORM_CALENDAR_FETCH_SLOTS';
export const FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED =
  'newAppointment/FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED';
export const FORM_CALENDAR_FETCH_SLOTS_FAILED =
  'newAppointment/FORM_CALENDAR_FETCH_SLOTS_FAILED';
export const FORM_CALENDAR_DATA_CHANGED =
  'newAppointment/FORM_CALENDAR_DATA_CHANGED';
export const FORM_SHOW_TYPE_OF_CARE_UNAVAILABLE_MODAL =
  'newAppointment/FORM_SHOW_TYPE_OF_CARE_UNAVAILABLE_MODAL';
export const FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL =
  'newAppointment/FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL';
export const FORM_HIDE_ELIGIBILITY_MODAL =
  'newAppointment/FORM_HIDE_ELIGIBILITY_MODAL';
export const FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED =
  'newAppointment/FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED';
export const FORM_REASON_FOR_APPOINTMENT_CHANGED =
  'newAppointment/FORM_REASON_FOR_APPOINTMENT_CHANGED';
export const FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED =
  'newAppointment/FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED';
export const FORM_SUBMIT = 'newAppointment/FORM_SUBMIT';
export const FORM_SUBMIT_FAILED = 'newAppointment/FORM_SUBMIT_FAILED';
export const FORM_UPDATE_CC_ELIGIBILITY =
  'newAppointment/FORM_UPDATE_CC_ELIGIBILITY';
export const CLICKED_UPDATE_ADDRESS_BUTTON =
  'newAppointment/CLICKED_UPDATE_ADDRESS_BUTTON';

export function openFormPage(page, uiSchema, schema) {
  return {
    type: FORM_PAGE_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function startNewAppointmentFlow() {
  return {
    type: STARTED_NEW_APPOINTMENT_FLOW,
  };
}

export function clickUpdateAddressButton() {
  return {
    type: CLICKED_UPDATE_ADDRESS_BUTTON,
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

export function showTypeOfCareUnavailableModal() {
  return {
    type: FORM_SHOW_TYPE_OF_CARE_UNAVAILABLE_MODAL,
  };
}

export function hideTypeOfCareUnavailableModal() {
  return {
    type: FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL,
  };
}

export function updateFacilityType(facilityType) {
  return {
    type: FORM_UPDATE_FACILITY_TYPE,
    facilityType,
  };
}

export function startDirectScheduleFlow() {
  recordEvent({ event: 'vaos-direct-path-started' });

  return {
    type: START_DIRECT_SCHEDULE_FLOW,
  };
}

export function startRequestAppointmentFlow(isCommunityCare) {
  recordEvent({
    event: `vaos-${
      isCommunityCare ? 'community-care' : 'request'
    }-path-started`,
  });

  return {
    type: START_REQUEST_APPOINTMENT_FLOW,
  };
}

export function openTypeOfCarePage(page, uiSchema, schema) {
  return (dispatch, getState) => {
    const state = getState();
    const email = selectVet360EmailAddress(state);
    const homePhone = selectVet360HomePhoneString(state);
    const mobilePhone = selectVet360MobilePhoneString(state);
    const showCommunityCare = vaosCommunityCare(state);

    const phoneNumber = mobilePhone || homePhone;
    dispatch({
      type: FORM_TYPE_OF_CARE_PAGE_OPENED,
      page,
      uiSchema,
      schema,
      email,
      phoneNumber,
      showCommunityCare,
    });
  };
}

export function fetchFacilityDetails(facilityId) {
  let facilityDetails;

  return async dispatch => {
    dispatch({
      type: FORM_FETCH_FACILITY_DETAILS,
    });

    try {
      facilityDetails = await getLocation({ facilityId });
    } catch (error) {
      facilityDetails = null;
      captureError(error);
    }

    dispatch({
      type: FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
      facilityDetails,
      facilityId,
    });
  };
}

export function checkEligibility(location, siteId) {
  return async (dispatch, getState) => {
    const state = getState();
    const useVSP = vaosVSPAppointmentNew(state);
    const directSchedulingEnabled = vaosDirectScheduling(state);
    const typeOfCareId = getTypeOfCare(getState().newAppointment.data)?.id;

    dispatch({
      type: FORM_ELIGIBILITY_CHECKS,
    });

    try {
      const eligibilityData = await getEligibilityData(
        location,
        typeOfCareId,
        siteId,
        directSchedulingEnabled,
        useVSP,
      );

      recordEligibilityGAEvents(eligibilityData, typeOfCareId, siteId);
      logEligibilityExplanation(eligibilityData, typeOfCareId, location.id);

      dispatch({
        type: FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
        typeOfCareId,
        eligibilityData,
      });

      try {
        const eligibility = getEligibilityStatus(getState());
        if (!eligibility.direct && !eligibility.request) {
          const thunk = fetchFacilityDetails(location.id);
          await thunk(dispatch, getState);
        }

        return eligibility;
      } catch (e) {
        captureError(e);
      }
    } catch (e) {
      captureError(e, false, 'facility page');
      dispatch({
        type: FORM_ELIGIBILITY_CHECKS_FAILED,
      });
    }
    return null;
  };
}

export function openFacilityPageV2(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    try {
      const initialState = getState();
      const newAppointment = initialState.newAppointment;
      const data = newAppointment.data;
      const typeOfCare = getTypeOfCare(newAppointment.data);
      const typeOfCareId = typeOfCare.id;
      const userSiteIds = selectSystemIds(initialState);
      const useVSP = vaosVSPAppointmentNew(initialState);
      let parentFacilities = newAppointment.parentFacilities;
      let locations = null;
      let locationId = data.vaFacility;

      dispatch({
        type: FORM_PAGE_FACILITY_V2_OPEN,
      });

      try {
        if (!parentFacilities) {
          dispatch({ type: FORM_FETCH_PARENT_FACILITIES });
          parentFacilities = await getOrganizations({
            siteIds: userSiteIds,
            useVSP,
          });
          dispatch({
            type: FORM_FETCH_PARENT_FACILITIES_SUCCEEDED,
            parentFacilities,
          });
        }
      } catch (err) {
        dispatch({ type: FORM_FETCH_PARENT_FACILITIES_FAILED });
      }

      locations = newAppointment.facilities[typeOfCareId] || null;

      if (parentFacilities?.length && !locations) {
        dispatch({
          type: FORM_FETCH_CHILD_FACILITIES,
        });

        // Fetch locations for each parent facility
        const responses = await Promise.all(
          parentFacilities.map(parent => {
            const parentId = parent.id;
            const siteId = parseFakeFHIRId(
              getIdOfRootOrganization(parentFacilities, parentId),
            );
            return getSupportedHealthcareServicesAndLocations({
              siteId,
              parentId,
              typeOfCareId,
              useVSP,
            });
          }),
        );

        locations = [].concat(...responses.map(r => r?.locations || []));
      }

      // If we have an already selected location or only have a single location
      // fetch eligbility data immediately
      const eligibilityDataNeeded = !!locationId || locations?.length === 1;

      if (eligibilityDataNeeded && !locationId) {
        locationId = locations[0].id;
      }

      if (!locations?.length) {
        parentFacilities.forEach(p => {
          recordEligibilityFailure(
            'supported-facilities',
            typeOfCare.name,
            parseFakeFHIRId(p.id),
          );
        });
      }

      const eligibilityChecks =
        newAppointment.eligibility[`${locationId}_${typeOfCareId}`] || null;

      if (eligibilityDataNeeded && !eligibilityChecks) {
        const parentId = getParentOfLocation(parentFacilities, locations[0]).id;

        const siteId = parseFakeFHIRId(
          getIdOfRootOrganization(parentFacilities, parentId),
        );

        const location = locations.find(l => l.id === locationId);
        dispatch(checkEligibility(location, siteId));
      }

      dispatch({
        type: FORM_PAGE_FACILITY_V2_OPEN_SUCCEEDED,
        page,
        schema,
        uiSchema,
        parentFacilities,
        locations,
        typeOfCareId,
      });

      // Fetch parent details if we don't have any matching locations
      if (parentFacilities?.length && !locations.length) {
        try {
          const thunk = fetchFacilityDetails(parentFacilities[0].id);
          await thunk(dispatch, getState);
        } catch (e) {
          captureError(e);
        }
      }
    } catch (e) {
      captureError(e, false, 'facility page');
      dispatch({
        type: FORM_PAGE_FACILITY_V2_OPEN_FAILED,
      });
    }
  };
}

export function hideEligibilityModal() {
  return {
    type: FORM_HIDE_ELIGIBILITY_MODAL,
  };
}

/*
 * The facility page can be opened with data in a variety of states and conditions.
 * We always need the list of parents (VAMCs) they can access. After that:
 *
 * 1. A user has multiple parents to choose from, so we just need to display them
 * 2. A user has only one parent, so we also need to fetch facilities
 * 3. A user might only have one parent and facility available, so we need to also
 *    do eligibility checks
 * 4. A user might already have been on this page, in which case we may have some 
 *    of the above data already and don't want to make another api call
*/
export function openFacilityPage(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    const initialState = getState();
    const directSchedulingEnabled = vaosDirectScheduling(initialState);
    const newAppointment = initialState.newAppointment;
    const typeOfCare = getTypeOfCare(newAppointment.data)?.name;
    const typeOfCareId = getTypeOfCare(newAppointment.data)?.id;
    const userSiteIds = selectSystemIds(initialState);
    const useVSP = vaosVSPAppointmentNew(initialState);
    const isCernerOnly = selectIsCernerOnlyPatient(initialState);
    let parentFacilities = newAppointment.parentFacilities;
    let locations = null;
    let eligibilityData = null;
    let parentId = newAppointment.data.vaParent;
    let locationId = newAppointment.data.vaFacility;
    let siteId = null;

    try {
      // If we have the VA parent in our state, we don't need to
      // fetch them again
      if (!parentFacilities) {
        parentFacilities = await getOrganizations({
          siteIds: userSiteIds,
          useVSP,
        });
      }

      const canShowFacilities =
        !isCernerOnly && (!!parentId || parentFacilities?.length === 1);

      if (canShowFacilities && !parentId) {
        parentId = parentFacilities[0].id;
      }

      if (parentId) {
        siteId = parseFakeFHIRId(
          getIdOfRootOrganization(parentFacilities, parentId),
        );
      }

      locations =
        newAppointment.facilities[`${typeOfCareId}_${parentId}`] || null;

      if (canShowFacilities && !locations) {
        ({ locations } = await getSupportedHealthcareServicesAndLocations({
          siteId,
          parentId,
          typeOfCareId,
          useVSP,
        }));
      }

      const eligibilityDataNeeded = !!locationId || locations?.length === 1;

      if (eligibilityDataNeeded && !locationId) {
        locationId = locations[0].id;
      }

      if (parentId && !locations?.length) {
        recordEligibilityFailure(
          'supported-facilities',
          typeOfCare,
          parseFakeFHIRId(parentId),
        );
      }

      const eligibilityChecks =
        newAppointment.eligibility[`${locationId}_${typeOfCareId}`] || null;

      if (eligibilityDataNeeded && !eligibilityChecks) {
        eligibilityData = await getEligibilityData(
          locations.find(location => location.id === locationId),
          typeOfCareId,
          siteId,
          directSchedulingEnabled,
          useVSP,
        );

        recordEligibilityGAEvents(eligibilityData, typeOfCareId, siteId);
        logEligibilityExplanation(eligibilityData, typeOfCareId, locationId);
      }

      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        page,
        uiSchema,
        schema,
        parentFacilities,
        facilities: locations,
        typeOfCareId,
        eligibilityData,
        isCernerOnly,
      });

      if (parentId && !locations.length) {
        try {
          const thunk = fetchFacilityDetails(parentId);
          await thunk(dispatch, getState);
        } catch (e) {
          captureError(e);
        }
      }
    } catch (e) {
      captureError(e, false, 'facility page');
      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_FAILED,
      });
    }
  };
}

export function updateFacilityPageData(page, uiSchema, data) {
  return async (dispatch, getState) => {
    const state = getState();
    const useVSP = vaosVSPAppointmentNew(state);
    const directSchedulingEnabled = vaosDirectScheduling(state);
    const previousNewAppointmentState = state.newAppointment;
    const typeOfCare = getTypeOfCare(data)?.name;
    const typeOfCareId = getTypeOfCare(data)?.id;
    const siteId = getSiteIdForChosenFacility(state, data.vaParent);
    let locations =
      previousNewAppointmentState.facilities[
        `${typeOfCareId}_${data.vaParent}`
      ];
    dispatch(updateFormData(page, uiSchema, data));

    if (!locations) {
      dispatch({
        type: FORM_FETCH_CHILD_FACILITIES,
      });

      try {
        ({ locations } = await getSupportedHealthcareServicesAndLocations({
          siteId,
          parentId: data.vaParent,
          typeOfCareId,
          useVSP,
        }));

        // If no available facilities, fetch system details to display contact info
        if (!locations?.length) {
          dispatch(fetchFacilityDetails(data.vaParent));
          recordEligibilityFailure(
            'supported-facilities',
            typeOfCare,
            parseFakeFHIRId(data.vaParent),
          );
        }

        dispatch({
          type: FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
          uiSchema,
          facilities: locations,
          typeOfCareId,
        });
      } catch (e) {
        captureError(e, false, 'facility page');
        dispatch({
          type: FORM_FETCH_CHILD_FACILITIES_FAILED,
        });
      }
    } else if (
      data.vaParent &&
      previousNewAppointmentState.data.vaParent !== data.vaParent
    ) {
      dispatch({
        type: FORM_VA_PARENT_CHANGED,
        uiSchema,
        typeOfCareId,
      });
    } else if (
      previousNewAppointmentState.data.vaFacility !== data.vaFacility &&
      !previousNewAppointmentState.eligibility[
        `${data.vaFacility}_${typeOfCareId}`
      ]
    ) {
      dispatch({
        type: FORM_ELIGIBILITY_CHECKS,
      });

      try {
        const eligibilityData = await getEligibilityData(
          locations.find(location => location.id === data.vaFacility),
          typeOfCareId,
          siteId,
          directSchedulingEnabled,
          useVSP,
        );

        recordEligibilityGAEvents(eligibilityData, typeOfCareId, siteId);
        logEligibilityExplanation(
          eligibilityData,
          typeOfCareId,
          data.vaFacility,
        );

        dispatch({
          type: FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
          typeOfCareId,
          eligibilityData,
        });

        try {
          const eligibility = getEligibilityStatus(getState());
          if (!eligibility.direct && !eligibility.request) {
            const thunk = fetchFacilityDetails(data.vaFacility);
            await thunk(dispatch, getState);
          }
        } catch (e) {
          captureError(e);
        }
      } catch (e) {
        captureError(e, false, 'facility page');
        dispatch({
          type: FORM_ELIGIBILITY_CHECKS_FAILED,
        });
      }
    }
  };
}

export function openReasonForAppointment(page, uiSchema, schema) {
  return {
    type: FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function updateReasonForAppointmentData(page, uiSchema, data) {
  return {
    type: FORM_REASON_FOR_APPOINTMENT_CHANGED,
    page,
    uiSchema,
    data,
  };
}

export function openClinicPage(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    dispatch({
      type: FORM_CLINIC_PAGE_OPENED,
    });

    const formData = getFormData(getState());
    // Remove parse function when converting this call to FHIR service
    await dispatch(fetchFacilityDetails(formData.vaFacility));

    dispatch({
      type: FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
      page,
      uiSchema,
      schema,
    });
  };
}

export function getAppointmentSlots(startDate, endDate, forceFetch = false) {
  return async (dispatch, getState) => {
    const state = getState();
    const useVSP = vaosVSPAppointmentNew(state);
    const rootOrgId = getRootIdForChosenFacility(state);
    const newAppointment = getNewAppointment(state);
    const { data } = newAppointment;

    const startDateMonth = moment(startDate).format('YYYY-MM');
    const endDateMonth = moment(endDate).format('YYYY-MM');

    let fetchedAppointmentSlotMonths = [];
    let fetchedStartMonth = false;
    let fetchedEndMonth = false;
    let availableSlots = [];

    if (!forceFetch) {
      fetchedAppointmentSlotMonths = [
        ...newAppointment.fetchedAppointmentSlotMonths,
      ];

      fetchedStartMonth = fetchedAppointmentSlotMonths.includes(startDateMonth);
      fetchedEndMonth = fetchedAppointmentSlotMonths.includes(endDateMonth);
      availableSlots = newAppointment.availableSlots || [];
    }

    if (!fetchedStartMonth || !fetchedEndMonth) {
      let mappedSlots = [];
      dispatch({ type: FORM_CALENDAR_FETCH_SLOTS });

      try {
        const startDateString = !fetchedStartMonth
          ? startDate
          : moment(endDate)
              .startOf('month')
              .format('YYYY-MM-DD');
        const endDateString = !fetchedEndMonth
          ? endDate
          : moment(startDate)
              .endOf('month')
              .format('YYYY-MM-DD');

        const fetchedSlots = await getSlots({
          siteId: rootOrgId,
          typeOfCareId: data.typeOfCareId,
          clinicId: data.clinicId,
          startDate: startDateString,
          endDate: endDateString,
          useVSP,
        });

        const now = moment();

        mappedSlots = fetchedSlots.filter(slot =>
          moment(slot.start).isAfter(now),
        );

        // Keep track of which months we've fetched already so we don't
        // make duplicate calls
        if (!fetchedStartMonth) {
          fetchedAppointmentSlotMonths.push(startDateMonth);
        }

        if (!fetchedEndMonth) {
          fetchedAppointmentSlotMonths.push(endDateMonth);
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

export function onCalendarChange({ currentlySelectedDate, selectedDates }) {
  return {
    type: FORM_CALENDAR_DATA_CHANGED,
    calendarData: {
      currentlySelectedDate,
      selectedDates,
    },
  };
}

export function openCommunityCarePreferencesPage(page, uiSchema, schema) {
  return {
    type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function checkCommunityCareEligibility() {
  return async (dispatch, getState) => {
    const state = getState();
    const communityCareEnabled = vaosCommunityCare(state);
    const useVSP = vaosVSPAppointmentNew(state);

    if (!communityCareEnabled) {
      return false;
    }

    try {
      // Check if user registered systems support community care...
      const siteIds = selectSystemIds(state);
      const parentFacilities = await getOrganizations({ siteIds, useVSP });
      const ccSites = await getSitesSupportingVAR(
        parentFacilities.map(parent => getSiteIdFromOrganization(parent)),
      );
      const ccEnabledSystems = parentFacilities.filter(parent =>
        ccSites.some(site => site.id === getSiteIdFromOrganization(parent)),
      );
      dispatch({
        type: FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS,
        ccEnabledSystems,
        parentFacilities,
      });

      // Reroute to VA facility page if none of the user's registered systems support community care.
      if (ccEnabledSystems.length) {
        const response = await getCommunityCare(getCCEType(state));

        dispatch({
          type: FORM_UPDATE_CC_ELIGIBILITY,
          isEligible: response.eligible,
        });

        if (response.eligible) {
          recordEvent({
            event: `${GA_PREFIX}-cc-eligible-yes`,
          });
        }

        return response.eligible;
      }
    } catch (e) {
      captureError(e);
      Sentry.captureMessage(
        'Community Care eligibility check failed with errors',
      );
    }

    return false;
  };
}

async function buildPreferencesDataAndUpdate(email) {
  const preferenceData = await getPreferences();
  const preferenceBody = createPreferenceBody(preferenceData, email);
  return updatePreferences(preferenceBody);
}

export function submitAppointmentOrRequest(history) {
  return async (dispatch, getState) => {
    const state = getState();
    const newAppointment = getNewAppointment(state);
    const data = newAppointment?.data;
    const typeOfCare = getTypeOfCare(getFormData(state))?.name;

    dispatch({
      type: FORM_SUBMIT,
    });

    const additionalEventData = {
      'health-TypeOfCare': typeOfCare,
      'health-ReasonForAppointment': data?.reasonForAppointment,
    };

    if (newAppointment.flowType === FLOW_TYPES.DIRECT) {
      const flow = GA_FLOWS.DIRECT;
      recordEvent({
        event: `${GA_PREFIX}-direct-submission`,
        flow,
        ...additionalEventData,
      });

      try {
        const appointmentBody = transformFormToAppointment(getState());
        await submitAppointment(appointmentBody);

        try {
          await buildPreferencesDataAndUpdate(data.email);
        } catch (error) {
          // These are ancillary updates, the request went through if the first submit
          // succeeded
          captureError(error);
        }

        dispatch({
          type: FORM_SUBMIT_SUCCEEDED,
        });

        recordEvent({
          event: `${GA_PREFIX}-direct-submission-successful`,
          flow,
          ...additionalEventData,
        });
        resetDataLayer();
        history.push('/new-appointment/confirmation');
      } catch (error) {
        captureError(error, true);
        dispatch({
          type: FORM_SUBMIT_FAILED,
          isVaos400Error: has400LevelError(error),
        });

        // Remove parse function when converting this call to FHIR service
        dispatch(fetchFacilityDetails(newAppointment.data.vaFacility));

        recordEvent({
          event: `${GA_PREFIX}-direct-submission-failed`,
          flow,
          ...additionalEventData,
        });
        resetDataLayer();
      }
    } else {
      const isCommunityCare =
        newAppointment.data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
      const eventType = isCommunityCare ? 'community-care' : 'request';
      const flow = isCommunityCare ? GA_FLOWS.CC_REQUEST : GA_FLOWS.VA_REQUEST;
      let requestBody;

      recordEvent({
        event: `${GA_PREFIX}-${eventType}-submission`,
        flow,
        ...additionalEventData,
      });

      try {
        let requestData;
        if (isCommunityCare) {
          requestBody = transformFormToCCRequest(getState());
          requestData = await submitRequest('cc', requestBody);
        } else {
          requestBody = transformFormToVARequest(getState());
          requestData = await submitRequest('va', requestBody);
        }

        try {
          const requestMessage = data.reasonAdditionalInfo;
          if (requestMessage) {
            await sendRequestMessage(requestData.id, requestMessage);
          }
          await buildPreferencesDataAndUpdate(data.email);
        } catch (error) {
          // These are ancillary updates, the request went through if the first submit
          // succeeded
          captureError(error, false, 'Request message failure', {
            messageLength: newAppointment?.data?.reasonAdditionalInfo?.length,
            hasLineBreak: newAppointment?.data?.reasonAdditionalInfo?.includes(
              '\r\n',
            ),
            hasNewLine: newAppointment?.data?.reasonAdditionalInfo?.includes(
              '\n',
            ),
          });
        }

        dispatch({
          type: FORM_SUBMIT_SUCCEEDED,
        });

        recordEvent({
          event: `${GA_PREFIX}-${eventType}-submission-successful`,
          flow,
          ...additionalEventData,
        });
        resetDataLayer();
        history.push('/new-appointment/confirmation');
      } catch (error) {
        let extraData = null;
        if (requestBody) {
          extraData = {
            vaParent: data?.vaParent,
            vaFacility: data?.vaFacility,
            chosenTypeOfCare: data?.typeOfCareId,
            facility: requestBody.facility,
            typeOfCareId: requestBody.typeOfCareId,
            cityState: requestBody.cityState,
          };
        }
        captureError(error, true, 'Request submission failure', extraData);
        dispatch({
          type: FORM_SUBMIT_FAILED,
          isVaos400Error: getErrorCodes(error).includes('VAOS_400'),
        });

        // Remove parse function when converting this call to FHIR service
        dispatch(
          fetchFacilityDetails(
            isCommunityCare
              ? newAppointment.data.communityCareSystemId
              : newAppointment.data.vaFacility,
          ),
        );

        recordEvent({
          event: `${GA_PREFIX}-${eventType}-submission-failed`,
          flow,
          ...additionalEventData,
        });
        resetDataLayer();
      }
    }
  };
}

export function requestAppointmentDateChoice(history) {
  return dispatch => {
    dispatch(startRequestAppointmentFlow());
    history.replace('/new-appointment/request-date');
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
      const previousPage = state.newAppointment.previousPages[current];
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
  return routeToPageInFlow(newAppointmentFlow, history, current, 'next');
}

export function routeToPreviousAppointmentPage(history, current) {
  return routeToPageInFlow(newAppointmentFlow, history, current, 'previous');
}
