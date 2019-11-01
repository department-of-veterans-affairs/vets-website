import newAppointmentFlow from '../newAppointmentFlow';
import { getTypeOfCare } from '../utils/selectors';
import {
  getSystemIdentifiers,
  getSystemDetails,
  getFacilitiesBySystemAndTypeOfCare,
  getFacilityInfo,
} from '../api';

import { getEligibilityData } from '../utils/eligibility';

export const FORM_DATA_UPDATED = 'newAppointment/FORM_DATA_UPDATED';
export const FORM_PAGE_OPENED = 'newAppointment/FORM_PAGE_OPENED';
export const FORM_PAGE_CHANGE_STARTED =
  'newAppointment/FORM_PAGE_CHANGE_STARTED';
export const FORM_PAGE_CHANGE_COMPLETED =
  'newAppointment/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_FETCH_USER_SYSTEMS = 'newAppointment/FORM_FETCH_USER_SYSTEMS';
export const FORM_FETCH_USER_SYSTEMS_SUCCEEDED =
  'newAppointment/FORM_FETCH_USER_SYSTEMS_SUCCEEDED';
export const FORM_FETCH_USER_SYSTEMS_FAILED =
  'newAppointment/FORM_FETCH_USER_SYSTEMS_FAILED';
export const FORM_UPDATE_FACILITY_TYPE =
  'newAppointment/FORM_UPDATE_FACILITY_TYPE';
export const FORM_PAGE_FACILITY_OPEN = 'newAppointment/FACILITY_PAGE_OPEN';
export const FORM_PAGE_FACILITY_OPEN_SUCCEEDED =
  'newAppointment/FACILITY_PAGE_OPEN_SUCCEEDED';
export const FORM_FETCH_CHILD_FACILITIES =
  'newAppointment/FORM_FETCH_CHILD_FACILITIES';
export const FORM_FETCH_CHILD_FACILITIES_SUCCEEDED =
  'newAppointment/FORM_FETCH_CHILD_FACILITIES_SUCCEEDED';
export const FORM_VA_SYSTEM_CHANGED = 'newAppointment/FORM_VA_SYSTEM_CHANGED';
export const FORM_VA_SYSTEM_UPDATE_HAS_CC_ENABLED_SYSTEMS =
  'newAppointment/FORM_VA_SYSTEM_UPDATE_HAS_CC_ENABLED_SYSTEMS';
export const FORM_ELIGIBILITY_CHECKS = 'newAppointment/FORM_ELIGIBILITY_CHECKS';
export const FORM_ELIGIBILITY_CHECKS_SUCCEEDED =
  'newAppointment/FORM_ELIGIBILITY_CHECKS_SUCCEEDED';
export const FORM_CLINIC_PAGE_OPENED = 'newAppointment/FORM_CLINIC_PAGE_OPENED';
export const FORM_CLINIC_PAGE_OPENED_SUCCEEDED =
  'newAppointment/FORM_CLINIC_PAGE_OPENED_SUCCEEDED';
export const START_DIRECT_SCHEDULE_FLOW =
  'newAppointment/START_DIRECT_SCHEDULE_FLOW';

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

export function updateHasCCEnabledSystems(hasCCEnabledSystems) {
  return {
    type: FORM_VA_SYSTEM_UPDATE_HAS_CC_ENABLED_SYSTEMS,
    hasCCEnabledSystems,
  };
}

export function getUserSystems() {
  return async dispatch => {
    let systems;

    dispatch({
      type: FORM_FETCH_USER_SYSTEMS,
      systems,
    });

    try {
      const identifiers = await getSystemIdentifiers();
      const systemIds = identifiers
        .filter(id => id.assigningAuthority.startsWith('dfn'))
        .map(id => id.assigningCode);
      systems = await getSystemDetails(systemIds);

      return dispatch({
        type: FORM_FETCH_USER_SYSTEMS_SUCCEEDED,
        systems,
      });
    } catch (error) {
      return dispatch({
        type: FORM_FETCH_USER_SYSTEMS_FAILED,
        error,
      });
    }
  };
}

export function updateFacilityType(facilityType) {
  return {
    type: FORM_UPDATE_FACILITY_TYPE,
    facilityType,
  };
}

export function openFacilityPage(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    const newAppointment = getState().newAppointment;
    let systems = newAppointment.systems;
    let facilities = null;
    let eligibilityData = null;

    // If we have the VA systems in our state, we don't need to
    // fetch them again
    if (!systems) {
      await dispatch(getUserSystems());
      systems = getState().newAppointment.systems;
    }
    const canShowFacilities =
      newAppointment.data.vaSystem || systems?.length === 1;
    const typeOfCareId = getTypeOfCare(newAppointment.data)?.id;

    const hasExistingFacilities = !!newAppointment.facilities[
      `${typeOfCareId}_${newAppointment.data.vaSystem}`
    ];

    if (canShowFacilities && !hasExistingFacilities) {
      const systemId =
        newAppointment.data.vaSystem || systems[0].institutionCode;
      facilities = await getFacilitiesBySystemAndTypeOfCare(
        systemId,
        typeOfCareId,
      );
    }

    const facilityId =
      newAppointment.data.vaFacility || facilities?.[0].facilityId;
    if (
      facilityId &&
      !newAppointment.eligibility[`${facilityId}_${typeOfCareId}`]
    ) {
      eligibilityData = await getEligibilityData(facilityId, typeOfCareId);
    }

    dispatch({
      type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
      page,
      uiSchema,
      schema,
      systems,
      facilities,
      typeOfCareId,
      eligibilityData,
    });
  };
}

export function updateFacilityPageData(page, uiSchema, data) {
  return async (dispatch, getState) => {
    const previousNewAppointmentState = getState().newAppointment;
    const typeOfCareId = getTypeOfCare(data)?.id;
    let facilities =
      previousNewAppointmentState.facilities[
        `${typeOfCareId}_${data.vaSystem}`
      ];
    dispatch(updateFormData(page, uiSchema, data));

    if (!facilities) {
      dispatch({
        type: FORM_FETCH_CHILD_FACILITIES,
      });

      facilities = await getFacilitiesBySystemAndTypeOfCare(
        data.vaSystem,
        typeOfCareId,
      );

      dispatch({
        type: FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
        uiSchema,
        facilities,
        typeOfCareId,
      });
    } else if (
      data.vaSystem &&
      previousNewAppointmentState.data.vaSystem !== data.vaSystem
    ) {
      dispatch({
        type: FORM_VA_SYSTEM_CHANGED,
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

      const eligibilityData = await getEligibilityData(
        data.vaFacility,
        typeOfCareId,
      );

      dispatch({
        type: FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
        typeOfCareId,
        eligibilityData,
      });
    }
  };
}

export function openClinicPage(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    let facilityDetails;

    dispatch({
      type: FORM_CLINIC_PAGE_OPENED,
    });

    try {
      facilityDetails = await getFacilityInfo(
        getState().newAppointment.data.vaFacility,
      );
    } catch (e) {
      facilityDetails = null;
    }

    dispatch({
      type: FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
      page,
      uiSchema,
      schema,
      facilityDetails,
    });
  };
}

export function routeToPageInFlow(flow, router, current, action) {
  return async (dispatch, getState) => {
    dispatch({
      type: FORM_PAGE_CHANGE_STARTED,
    });

    const nextAction = flow[current][action];
    let nextPage;

    if (typeof nextAction === 'string') {
      nextPage = flow[nextAction];
    } else {
      const nextStateKey = await nextAction(getState(), dispatch);
      nextPage = flow[nextStateKey];
    }

    if (nextPage?.url) {
      router.push(nextPage.url);
      dispatch({
        type: FORM_PAGE_CHANGE_COMPLETED,
      });
    } else if (nextPage) {
      throw new Error(`Tried to route to a page without a url: ${nextPage}`);
    } else {
      throw new Error('Tried to route to page that does not exist');
    }
  };
}

export function routeToNextAppointmentPage(router, current) {
  return routeToPageInFlow(newAppointmentFlow, router, current, 'next');
}

export function routeToPreviousAppointmentPage(router, current) {
  return routeToPageInFlow(newAppointmentFlow, router, current, 'previous');
}
