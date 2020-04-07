import moment from 'moment';

import recordEvent from 'platform/monitoring/record-event';

import {
  selectVet360EmailAddress,
  selectVet360HomePhoneString,
  selectVet360MobilePhoneString,
} from 'platform/user/selectors';
import newAppointmentFlow from '../newAppointmentFlow';
import {
  getTypeOfCare,
  vaosDirectScheduling,
  getNewAppointment,
  getFormData,
  getSystemFromParent,
  getSystemFromChosenFacility,
  vaosCommunityCare,
  selectSystemIds,
  getEligibilityStatus,
} from '../utils/selectors';
import {
  getParentFacilities,
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
  GA_PREFIX,
  GA_FLOWS,
} from '../utils/constants';
import {
  transformFormToVARequest,
  transformFormToCCRequest,
  transformFormToAppointment,
  createPreferenceBody,
} from '../utils/data';

import {
  getEligibilityData,
  getEligibleFacilities,
  recordEligibilityGAEvents,
} from '../utils/eligibility';

import { recordEligibilityFailure, resetDataLayer } from '../utils/events';

import { captureError } from '../utils/error';

import {
  STARTED_NEW_APPOINTMENT_FLOW,
  FORM_SUBMIT_SUCCEEDED,
} from './sitewide';

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
export const FORM_PAGE_FACILITY_OPEN_SUCCEEDED =
  'newAppointment/FACILITY_PAGE_OPEN_SUCCEEDED';
export const FORM_PAGE_FACILITY_OPEN_FAILED =
  'newAppointment/FACILITY_PAGE_OPEN_FAILED';
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
export const FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED =
  'newAppointment/FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED';
export const FORM_REASON_FOR_APPOINTMENT_CHANGED =
  'newAppointment/FORM_REASON_FOR_APPOINTMENT_CHANGED';
export const FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN =
  'newAppointment/FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN';
export const FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED =
  'newAppointment/FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED';
export const FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_FAILED =
  'newAppointment/FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_FAILED';
export const FORM_SUBMIT = 'newAppointment/FORM_SUBMIT';
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

export function startNewAppointmentFlow() {
  return {
    type: STARTED_NEW_APPOINTMENT_FLOW,
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
  recordEvent({ event: 'vaos-direct-path-started' });

  return {
    type: START_DIRECT_SCHEDULE_FLOW,
    appointments,
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
      facilityDetails = await getFacilityInfo(facilityId);
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
    const typeOfCareId = getTypeOfCare(newAppointment.data)?.id;
    const userSystemIds = selectSystemIds(initialState);
    let parentFacilities = newAppointment.parentFacilities;
    let facilities = null;
    let eligibilityData = null;
    let parentId = newAppointment.data.vaParent;
    let facilityId = newAppointment.data.vaFacility;

    try {
      // If we have the VA parent in our state, we don't need to
      // fetch them again
      if (!parentFacilities) {
        parentFacilities = await getParentFacilities(userSystemIds);
      }

      const canShowFacilities = !!parentId || parentFacilities?.length === 1;

      if (canShowFacilities && !parentId) {
        parentId = parentFacilities[0].institutionCode;
      }

      const systemId = parentFacilities?.find(
        parent => parent.institutionCode === parentId,
      )?.rootStationCode;
      facilities =
        newAppointment.facilities[`${typeOfCareId}_${parentId}`] || null;

      if (canShowFacilities && !facilities) {
        facilities = await getFacilitiesBySystemAndTypeOfCare(
          systemId,
          parentId,
          typeOfCareId,
        );
      }

      const eligibleFacilities = getEligibleFacilities(facilities);
      const eligibilityDataNeeded =
        !!facilityId || eligibleFacilities?.length === 1;

      if (eligibilityDataNeeded && !facilityId) {
        facilityId = eligibleFacilities[0].institutionCode;
      }

      if (parentId && !eligibleFacilities?.length) {
        recordEligibilityFailure('supported-facilities');
      }

      const eligibilityChecks =
        newAppointment.eligibility[`${facilityId}_${typeOfCareId}`] || null;

      if (eligibilityDataNeeded && !eligibilityChecks) {
        eligibilityData = await getEligibilityData(
          eligibleFacilities.find(
            facility => facility.institutionCode === facilityId,
          ),
          typeOfCareId,
          systemId,
          directSchedulingEnabled,
        );

        recordEligibilityGAEvents(eligibilityData, typeOfCareId, systemId);
      }

      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        page,
        uiSchema,
        schema,
        parentFacilities,
        facilities,
        typeOfCareId,
        eligibilityData,
      });

      if (facilityId) {
        try {
          const eligibility = getEligibilityStatus(getState());
          if (!eligibility.direct && !eligibility.request) {
            const thunk = fetchFacilityDetails(facilityId);
            await thunk(dispatch, getState);
          }
        } catch (e) {
          captureError(e);
        }
      }
    } catch (e) {
      captureError(e);
      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_FAILED,
      });
    }
  };
}

export function updateFacilityPageData(page, uiSchema, data) {
  return async (dispatch, getState) => {
    const directSchedulingEnabled = vaosDirectScheduling(getState());
    const previousNewAppointmentState = getState().newAppointment;
    const typeOfCareId = getTypeOfCare(data)?.id;
    const systemId = getSystemFromParent(getState(), data.vaParent);
    let facilities =
      previousNewAppointmentState.facilities[
        `${typeOfCareId}_${data.vaParent}`
      ];
    dispatch(updateFormData(page, uiSchema, data));

    if (!facilities) {
      dispatch({
        type: FORM_FETCH_CHILD_FACILITIES,
      });

      try {
        facilities = await getFacilitiesBySystemAndTypeOfCare(
          systemId,
          data.vaParent,
          typeOfCareId,
        );

        const availableFacilities = getEligibleFacilities(facilities);

        // If no available facilities, fetch system details to display contact info
        if (!availableFacilities?.length) {
          dispatch(fetchFacilityDetails(data.vaParent));
          recordEligibilityFailure('supported-facilities');
        }

        dispatch({
          type: FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
          uiSchema,
          facilities,
          typeOfCareId,
        });
      } catch (e) {
        captureError(e);
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
          facilities.find(
            facility => facility.institutionCode === data.vaFacility,
          ),
          typeOfCareId,
          systemId,
          directSchedulingEnabled,
        );

        recordEligibilityGAEvents(eligibilityData, typeOfCareId, systemId);

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
        captureError(e);
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
    await dispatch(fetchFacilityDetails(formData.vaFacility));

    dispatch({
      type: FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
      page,
      uiSchema,
      schema,
    });
  };
}

export function getAppointmentSlots(startDate, endDate) {
  return async (dispatch, getState) => {
    const state = getState();
    const systemId = getSystemFromChosenFacility(state);
    const newAppointment = getNewAppointment(state);
    const availableSlots = newAppointment.availableSlots || [];
    const { data } = newAppointment;

    const fetchedAppointmentSlotMonths = [
      ...newAppointment.fetchedAppointmentSlotMonths,
    ];

    const startDateMonth = moment(startDate).format('YYYY-MM');
    const endDateMonth = moment(endDate).format('YYYY-MM');

    const fetchedStartMonth = fetchedAppointmentSlotMonths.includes(
      startDateMonth,
    );
    const fetchedEndMonth = fetchedAppointmentSlotMonths.includes(endDateMonth);

    if (!fetchedStartMonth || !fetchedEndMonth) {
      let mappedSlots = [];
      let appointmentLength = null;
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

        const response = await getAvailableSlots(
          systemId,
          data.typeOfCareId,
          data.clinicId,
          startDateString,
          endDateString,
        );

        const fetchedSlots = response[0]?.appointmentTimeSlot || [];
        appointmentLength = response[0]?.appointmentLength;

        const now = moment();

        mappedSlots = fetchedSlots.reduce((acc, slot) => {
          /**
           * The datetime we get back for startDateTime and endDateTime includes
           * an offset of +00:00 that isn't actually accurate. The times returned are
           * already in the time zone of the facility. In order to prevent
           * moment from using this offset, we'll remove it in the next line
           */
          const dateObj = moment(slot.startDateTime?.split('+')?.[0]);
          if (dateObj.isValid() && dateObj.isAfter(now)) {
            acc.push({
              date: dateObj.format('YYYY-MM-DD'),
              datetime: dateObj.format('YYYY-MM-DD[T]HH:mm:ss'),
            });
          }
          return acc;
        }, []);

        // Keep track of which months we've fetched already so we don't
        // make duplicate calls
        if (!fetchedStartMonth) {
          fetchedAppointmentSlotMonths.push(startDateMonth);
        }

        if (!fetchedEndMonth) {
          fetchedAppointmentSlotMonths.push(endDateMonth);
        }

        const sortedSlots = [...availableSlots, ...mappedSlots].sort((a, b) =>
          a.date.localeCompare(b.date),
        );

        dispatch({
          type: FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
          availableSlots: sortedSlots,
          fetchedAppointmentSlotMonths: fetchedAppointmentSlotMonths.sort(),
          appointmentLength,
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
  return async (dispatch, getState) => {
    const newAppointment = getState().newAppointment;
    const systemIds = newAppointment.ccEnabledSystems;
    let parentFacilities = newAppointment.parentFacilities;

    dispatch({
      type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN,
    });

    try {
      if (!newAppointment.parentFacilities) {
        parentFacilities = await getParentFacilities(systemIds);
      }

      dispatch({
        type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED,
        page,
        uiSchema,
        schema,
        parentFacilities,
      });
    } catch (e) {
      captureError(e);
      dispatch({
        type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_FAILED,
      });
    }
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
  const preferenceBody = createPreferenceBody(
    preferenceData,
    newAppointment.data,
  );
  return updatePreferences(preferenceBody);
}

export function submitAppointmentOrRequest(router) {
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
          await buildPreferencesDataAndUpdate(newAppointment);
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
        router.push('/new-appointment/confirmation');
      } catch (error) {
        captureError(error, true);
        dispatch({
          type: FORM_SUBMIT_FAILED,
        });

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

      recordEvent({
        event: `${GA_PREFIX}-${eventType}-submission`,
        flow,
        ...additionalEventData,
      });

      try {
        let requestBody;
        let requestData;

        if (isCommunityCare) {
          requestBody = transformFormToCCRequest(getState());
          requestData = await submitRequest('cc', requestBody);
        } else {
          requestBody = transformFormToVARequest(getState());
          requestData = await submitRequest('va', requestBody);
        }

        try {
          await sendRequestMessage(
            requestData.id,
            newAppointment.data.reasonAdditionalInfo,
          );
          await buildPreferencesDataAndUpdate(newAppointment);
        } catch (error) {
          // These are ancillary updates, the request went through if the first submit
          // succeeded
          captureError(error);
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
        router.push('/new-appointment/confirmation');
      } catch (error) {
        captureError(error, true);
        dispatch({
          type: FORM_SUBMIT_FAILED,
        });

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

export function requestAppointmentDateChoice(router) {
  return dispatch => {
    dispatch(startRequestAppointmentFlow());
    router.replace('/new-appointment/request-date');
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
