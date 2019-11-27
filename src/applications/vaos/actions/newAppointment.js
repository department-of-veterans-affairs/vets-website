import * as Sentry from '@sentry/browser';
import moment from 'moment';
import {
  selectVet360EmailAddress,
  selectVet360HomePhoneString,
  selectVet360MobilePhoneString,
} from 'platform/user/selectors';
import newAppointmentFlow from '../newAppointmentFlow';
import { getTypeOfCare } from '../utils/selectors';
import {
  getSystemIdentifiers,
  getSystemDetails,
  getFacilitiesBySystemAndTypeOfCare,
  getFacilityInfo,
  getAvailableSlots,
  getPreferences,
  updatePreferences,
  submitRequest,
  submitAppointment,
  sendRequestMessage,
} from '../api';
import {
  FACILITY_TYPES,
  FLOW_TYPES,
  REASON_MAX_CHARS,
} from '../utils/constants';
import {
  transformFormToVARequest,
  transformFormToCCRequest,
  transformFormToAppointment,
  createMessageBody,
  createPreferenceBody,
} from '../utils/data';

import { getEligibilityData } from '../utils/eligibility';

export const FORM_DATA_UPDATED = 'newAppointment/FORM_DATA_UPDATED';
export const FORM_PAGE_OPENED = 'newAppointment/FORM_PAGE_OPENED';
export const FORM_TYPE_OF_CARE_PAGE_OPENED =
  'newAppointment/TYPE_OF_CARE_PAGE_OPENED';
export const FORM_PAGE_CHANGE_STARTED =
  'newAppointment/FORM_PAGE_CHANGE_STARTED';
export const FORM_PAGE_CHANGE_COMPLETED =
  'newAppointment/FORM_PAGE_CHANGE_COMPLETED';
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
export const FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS =
  'newAppointment/FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS';
export const FORM_ELIGIBILITY_CHECKS = 'newAppointment/FORM_ELIGIBILITY_CHECKS';
export const FORM_ELIGIBILITY_CHECKS_SUCCEEDED =
  'newAppointment/FORM_ELIGIBILITY_CHECKS_SUCCEEDED';
export const FORM_CLINIC_PAGE_OPENED = 'newAppointment/FORM_CLINIC_PAGE_OPENED';
export const FORM_CLINIC_PAGE_OPENED_SUCCEEDED =
  'newAppointment/FORM_CLINIC_PAGE_OPENED_SUCCEEDED';
export const START_DIRECT_SCHEDULE_FLOW =
  'newAppointment/START_DIRECT_SCHEDULE_FLOW';
export const START_REQUEST_APPOINTMENT_FLOW =
  'newAppointment/START_REQUEST_APPOINTMENT_FLOW';
export const FORM_SCHEDULE_APPOINTMENT_PAGE_OPENED =
  'newAppointment/FORM_SCHEDULE_APPOINTMENT_PAGE_OPENED';
export const FORM_SCHEDULE_APPOINTMENT_PAGE_OPENED_SUCCEEDED =
  'newAppointment/FORM_SCHEDULE_APPOINTMENT_PAGE_OPENED_SUCCEEDED';
export const FORM_SHOW_TYPE_OF_CARE_UNAVAILABLE_MODAL =
  'newAppointment/FORM_SHOW_TYPE_OF_CARE_UNAVAILABLE_MODAL';
export const FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL =
  'newAppointment/FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL';
export const FORM_REASON_FOR_APPOINTMENT_CHANGED =
  'newAppointment/FORM_REASON_FOR_APPOINTMENT_CHANGED';
export const FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN =
  'newAppointment/FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN';
export const FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED =
  'newAppointment/FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED';
export const FORM_SUBMIT = 'newAppointment/FORM_SUBMIT';
export const FORM_SUBMIT_SUCCEEDED = 'newAppointment/FORM_SUBMIT_SUCCEEDED';
export const FORM_SUBMIT_FAILED = 'newAppointment/FORM_SUBMIT_FAILED';
export const FORM_UPDATE_CC_ELIGIBILITY =
  'newAppointment/FORM_UPDATE_CC_ELIGIBILITY';

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

export function updateCCEnabledSystems(ccEnabledSystems) {
  return {
    type: FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS,
    ccEnabledSystems,
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

export function startDirectScheduleFlow(appointments) {
  return {
    type: START_DIRECT_SCHEDULE_FLOW,
    appointments,
  };
}

export function startRequestAppointmentFlow() {
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

    const phoneNumber = mobilePhone || homePhone;
    dispatch({
      type: FORM_TYPE_OF_CARE_PAGE_OPENED,
      page,
      uiSchema,
      schema,
      email,
      phoneNumber,
    });
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
      const userSystemIds = await getSystemIdentifiers();
      systems = await getSystemDetails(userSystemIds);
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

export function updateReasonForAppointmentData(page, uiSchema, data) {
  return async (dispatch, getState) => {
    const newAppointment = getState().newAppointment;
    const reasonMaxChars =
      newAppointment.flowType === FLOW_TYPES.DIRECT
        ? REASON_MAX_CHARS.direct
        : REASON_MAX_CHARS.request;

    let reasonAdditionalInfo = data.reasonAdditionalInfo;
    let remainingCharacters =
      reasonMaxChars - data.reasonForAppointment.length - 1;

    if (reasonAdditionalInfo) {
      // Max length for reason
      const maxTextAreaLength =
        reasonMaxChars - data.reasonForAppointment.length - 1;
      reasonAdditionalInfo = reasonAdditionalInfo.substr(0, maxTextAreaLength);
      remainingCharacters = maxTextAreaLength - reasonAdditionalInfo.length;
    }

    dispatch({
      type: FORM_REASON_FOR_APPOINTMENT_CHANGED,
      page,
      uiSchema,
      data: { ...data, reasonAdditionalInfo },
      remainingCharacters,
    });
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

export function openSelectAppointmentPage(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    let slots;
    let mappedSlots = [];
    let appointmentLength = null;

    dispatch({
      type: FORM_SCHEDULE_APPOINTMENT_PAGE_OPENED,
    });

    try {
      const response = await getAvailableSlots(
        getState().newAppointment.data.clinicId,
      );

      slots = response[0]?.appointmentTimeSlot || [];
      appointmentLength = response[0]?.appointmentLength;

      const now = moment();

      mappedSlots = slots.reduce((acc, slot) => {
        const dateObj = moment(slot.startDateTime, 'MM/DD/YYYY LTS');
        if (dateObj.isAfter(now)) {
          acc.push({
            date: dateObj.format('YYYY-MM-DD'),
            datetime: dateObj.format('YYYY-MM-DD[T]HH:mm:ss'),
          });
        }
        return acc;
      }, []);

      mappedSlots = mappedSlots.sort((a, b) => a.date.localeCompare(b.date));
    } catch (e) {
      mappedSlots = null;
    }

    dispatch({
      type: FORM_SCHEDULE_APPOINTMENT_PAGE_OPENED_SUCCEEDED,
      page,
      uiSchema,
      schema,
      availableSlots: mappedSlots,
      appointmentLength,
    });
  };
}

export function openCommunityCarePreferencesPage(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    const newAppointment = getState().newAppointment;
    const systemIds = newAppointment.ccEnabledSystems;
    let systems = newAppointment.systems;

    dispatch({
      type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN,
    });

    if (!newAppointment.systems) {
      systems = await getSystemDetails(systemIds);
    }

    dispatch({
      type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED,
      page,
      uiSchema,
      schema,
      systems,
    });
  };
}

export function updateCCEligibility(isEligible) {
  return {
    type: FORM_UPDATE_CC_ELIGIBILITY,
    isEligible,
  };
}

async function buildPreferencesDataAndUpdate(newAppointment) {
  const preferenceData = await getPreferences();
  const preferenceBody = createPreferenceBody(newAppointment, preferenceData);
  return updatePreferences(preferenceBody);
}

export function submitAppointmentOrRequest(router) {
  return async (dispatch, getState) => {
    const newAppointment = getState().newAppointment;

    dispatch({
      type: FORM_SUBMIT,
    });

    if (newAppointment.flowType === FLOW_TYPES.DIRECT) {
      try {
        const appointmentBody = transformFormToAppointment(getState());
        await submitAppointment(appointmentBody);

        try {
          await buildPreferencesDataAndUpdate(newAppointment);
        } catch (error) {
          // These are ancillary updates, the request went through if the first submit
          // succeeded
          Sentry.captureException(error);
        }

        dispatch({
          type: FORM_SUBMIT_SUCCEEDED,
        });

        router.push('/new-appointment/confirmation');
      } catch (error) {
        Sentry.captureException(error);
        dispatch({
          type: FORM_SUBMIT_FAILED,
        });
      }
    } else {
      try {
        let requestBody;
        let requestData;

        if (
          newAppointment.data.facilityType === FACILITY_TYPES.COMMUNITY_CARE
        ) {
          requestBody = transformFormToCCRequest(getState());
          requestData = await submitRequest('cc', requestBody);
        } else {
          requestBody = transformFormToVARequest(newAppointment);
          requestData = await submitRequest('va', requestBody);
        }

        try {
          await buildPreferencesDataAndUpdate(newAppointment);
          const messageBody = createMessageBody(
            requestData.uniqueId,
            newAppointment,
          );
          await sendRequestMessage(requestData.uniqueId, messageBody);
        } catch (error) {
          // These are ancillary updates, the request went through if the first submit
          // succeeded
          Sentry.captureException(error);
        }

        dispatch({
          type: FORM_SUBMIT_SUCCEEDED,
        });

        router.push('/new-appointment/confirmation');
      } catch (error) {
        Sentry.captureException(error);
        dispatch({
          type: FORM_SUBMIT_FAILED,
        });
      }
    }
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
