import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';

import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import { getEligibilityChecks } from '../utils/eligibility';

import {
  FORM_DATA_UPDATED,
  FORM_PAGE_OPENED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_UPDATE_FACILITY_TYPE,
  FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
  FORM_PAGE_FACILITY_OPEN_FAILED,
  FORM_CALENDAR_FETCH_SLOTS,
  FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
  FORM_CALENDAR_FETCH_SLOTS_FAILED,
  FORM_CALENDAR_DATA_CHANGED,
  FORM_FETCH_FACILITY_DETAILS,
  FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES,
  FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES_FAILED,
  FORM_VA_PARENT_CHANGED,
  FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS,
  FORM_ELIGIBILITY_CHECKS,
  FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
  FORM_ELIGIBILITY_CHECKS_FAILED,
  START_DIRECT_SCHEDULE_FLOW,
  START_REQUEST_APPOINTMENT_FLOW,
  FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
  FORM_SHOW_TYPE_OF_CARE_UNAVAILABLE_MODAL,
  FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL,
  FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED,
  FORM_REASON_FOR_APPOINTMENT_CHANGED,
  FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN,
  FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED,
  FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_FAILED,
  FORM_SUBMIT,
  FORM_SUBMIT_FAILED,
  FORM_TYPE_OF_CARE_PAGE_OPENED,
  FORM_UPDATE_CC_ELIGIBILITY,
} from '../actions/newAppointment';

import {
  STARTED_NEW_APPOINTMENT_FLOW,
  FORM_SUBMIT_SUCCEEDED,
} from '../actions/sitewide';

import {
  FLOW_TYPES,
  REASON_ADDITIONAL_INFO_TITLES,
  REASON_MAX_CHARS,
  FETCH_STATUS,
  PURPOSE_TEXT,
  TYPES_OF_CARE,
  PODIATRY_ID,
} from '../utils/constants';

import { getTypeOfCare } from '../utils/selectors';
import {
  getOrganizationBySiteId,
  getIdOfRootOrganization,
} from '../services/organization';

const initialState = {
  pages: {},
  data: {},
  facilities: {},
  facilityDetails: {},
  clinics: {},
  eligibility: {},
  parentFacilities: null,
  ccEnabledSystems: null,
  pageChangeInProgress: false,
  childFacilitiesStatus: FETCH_STATUS.notStarted,
  parentFacilitiesStatus: FETCH_STATUS.notStarted,
  eligibilityStatus: FETCH_STATUS.notStarted,
  facilityDetailsStatus: FETCH_STATUS.notStarted,
  pastAppointments: null,
  appointmentSlotsStatus: FETCH_STATUS.notStarted,
  availableSlots: null,
  fetchedAppointmentSlotMonths: [],
  submitStatus: FETCH_STATUS.notStarted,
  isCCEligible: false,
};

function getFacilities(state, typeOfCareId, vaParent) {
  return state.facilities[`${typeOfCareId}_${vaParent}`] || [];
}

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id.replace('var', '');
}

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemaAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

function updateFacilitiesSchemaAndData(parents, facilities, schema, data) {
  let newSchema = schema;
  let newData = data;

  if (
    facilities.length > 1 ||
    (facilities.length === 1 && parents.length > 1)
  ) {
    newSchema = unset('properties.vaFacilityMessage', newSchema);
    newSchema = set(
      'properties.vaFacility',
      {
        type: 'string',
        enum: facilities.map(facility => facility.id),
        enumNames: facilities.map(
          facility =>
            `${facility.name} (${facility.address[0].city}, ${
              facility.address[0].state
            })`,
        ),
      },
      newSchema,
    );
  } else if (newData.vaParent) {
    newSchema = unset('properties.vaFacility', newSchema);
    if (!facilities.length) {
      newSchema.properties.vaFacilityMessage = { type: 'string' };
    }
    newData = {
      ...newData,
      vaFacility: facilities[0]?.id,
    };
  }

  return { schema: newSchema, data: newData };
}

export default function formReducer(state = initialState, action) {
  switch (action.type) {
    case FORM_PAGE_OPENED: {
      const { data, schema } = setupFormData(
        state.data,
        action.schema,
        action.uiSchema,
      );

      return {
        ...state,
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_DATA_UPDATED: {
      let newPages = state.pages;
      let actionData = action.data;
      if (
        actionData.typeOfCareId !== state.data.typeOfCareId &&
        (state.pages.vaFacility || state.data.vaFacility)
      ) {
        newPages = unset('vaFacility', newPages);
        actionData = unset('vaFacility', actionData);
      }

      const { data, schema } = updateSchemaAndData(
        state.pages[action.page],
        action.uiSchema,
        actionData,
      );

      return {
        ...state,
        data,
        pages: {
          ...newPages,
          [action.page]: schema,
        },
      };
    }
    case STARTED_NEW_APPOINTMENT_FLOW: {
      return {
        ...initialState,
        parentFacilities: state.parentFacilities,
        facilities: state.facilities,
        clinics: state.clinics,
        eligibility: state.eligibility,
        pastAppointments: state.pastAppointments,
        submitStatus: FETCH_STATUS.notStarted,
      };
    }
    case FORM_PAGE_CHANGE_STARTED: {
      return {
        ...state,
        pageChangeInProgress: true,
      };
    }
    case FORM_PAGE_CHANGE_COMPLETED: {
      return {
        ...state,
        pageChangeInProgress: false,
      };
    }
    case FORM_TYPE_OF_CARE_PAGE_OPENED: {
      const prefilledData = {
        ...state.data,
        phoneNumber: state.data.phoneNumber || action.phoneNumber,
        email: state.data.email || action.email,
      };

      const sortedCare = TYPES_OF_CARE.filter(
        typeOfCare => typeOfCare.id !== PODIATRY_ID || action.showCommunityCare,
      ).sort(
        (careA, careB) =>
          careA.name.toLowerCase() > careB.name.toLowerCase() ? 1 : -1,
      );
      const initialSchema = {
        ...action.schema,
        properties: {
          typeOfCareId: {
            type: 'string',
            enum: sortedCare.map(care => care.id || care.ccId),
            enumNames: sortedCare.map(care => care.label || care.name),
          },
        },
      };

      const { data, schema } = setupFormData(
        prefilledData,
        initialSchema,
        action.uiSchema,
      );

      return {
        ...state,
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_SHOW_TYPE_OF_CARE_UNAVAILABLE_MODAL: {
      return {
        ...state,
        showTypeOfCareUnavailableModal: true,
        pageChangeInProgress: false,
      };
    }
    case FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL: {
      return {
        ...state,
        showTypeOfCareUnavailableModal: false,
      };
    }
    case FORM_UPDATE_FACILITY_TYPE: {
      return {
        ...state,
        data: { ...state.data, facilityType: action.facilityType },
      };
    }
    case FORM_PAGE_FACILITY_OPEN_SUCCEEDED: {
      let newSchema = action.schema;
      let newData = state.data;
      const parentFacilities =
        action.parentFacilities || state.parentFacilities;

      // For both parents and facilities, we want to put them in the form
      // schema as radio options if we have more than one to choose from.
      // If we only have one, then we want to just set the value in the
      // form data and remove the schema for that field, so we don't
      // show the question to the user
      if (parentFacilities.length > 1) {
        newSchema = set(
          'properties.vaParent.enum',
          parentFacilities.map(sys => sys.id),
          action.schema,
        );
        newSchema = set(
          'properties.vaParent.enumNames',
          parentFacilities.map(sys => sys.name),
          newSchema,
        );
      } else {
        newSchema = unset('properties.vaParent', newSchema);
        newData = {
          ...newData,
          vaParent: parentFacilities[0]?.id,
        };
      }

      const facilities =
        action.facilities ||
        getFacilities(state, action.typeOfCareId, newData.vaParent);

      const facilityUpdate = updateFacilitiesSchemaAndData(
        parentFacilities,
        facilities,
        newSchema,
        newData,
      );

      const { data, schema } = setupFormData(
        facilityUpdate.data,
        facilityUpdate.schema,
        action.uiSchema,
      );

      let eligibility = state.eligibility;
      let clinics = state.clinics;
      let pastAppointments;

      if (action.eligibilityData) {
        const facilityEligibility = getEligibilityChecks(
          action.eligibilityData,
        );

        eligibility = {
          ...state.eligibility,
          [`${data.vaFacility}_${action.typeOfCareId}`]: facilityEligibility,
        };

        if (!action.eligibilityData.clinics?.directFailed) {
          clinics = {
            ...state.clinics,
            [`${data.vaFacility}_${action.typeOfCareId}`]: action
              .eligibilityData.clinics,
          };

          pastAppointments = action.eligibilityData.pastAppointments;
        }
      }

      return {
        ...state,
        parentFacilities,
        data,
        parentFacilitiesStatus: FETCH_STATUS.succeeded,
        facilities: {
          ...state.facilities,
          [`${action.typeOfCareId}_${newData.vaParent}`]: facilities,
        },
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
        eligibility,
        clinics,
        pastAppointments,
      };
    }
    case FORM_PAGE_FACILITY_OPEN_FAILED:
    case FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_FAILED: {
      return {
        ...state,
        parentFacilitiesStatus: FETCH_STATUS.failed,
      };
    }
    case FORM_FETCH_CHILD_FACILITIES: {
      let newState = unset('pages.vaFacility.properties.vaFacility', state);
      newState = unset(
        'pages.vaFacility.properties.vaFacilityMessage',
        newState,
      );
      newState = set(
        'pages.vaFacility.properties.vaFacilityLoading',
        { type: 'string' },
        newState,
      );

      return { ...newState, childFacilitiesStatus: FETCH_STATUS.loading };
    }
    case FORM_FETCH_CHILD_FACILITIES_SUCCEEDED: {
      const facilityUpdate = updateFacilitiesSchemaAndData(
        state.parentFacilities,
        action.facilities,
        state.pages.vaFacility,
        state.data,
      );

      const newData = facilityUpdate.data;
      const newSchema = unset(
        'properties.vaFacilityLoading',
        facilityUpdate.schema,
      );

      const { data, schema } = updateSchemaAndData(
        newSchema,
        action.uiSchema,
        newData,
      );

      return {
        ...state,
        data,
        facilities: {
          ...state.facilities,
          [`${action.typeOfCareId}_${newData.vaParent}`]: action.facilities,
        },
        pages: {
          ...state.pages,
          vaFacility: schema,
        },
        childFacilitiesStatus: FETCH_STATUS.succeeded,
      };
    }
    case FORM_FETCH_CHILD_FACILITIES_FAILED: {
      const pages = unset(
        'vaFacility.properties.vaFacilityLoading',
        state.pages,
      );

      return {
        ...state,
        pages,
        childFacilitiesStatus: FETCH_STATUS.failed,
      };
    }
    case FORM_VA_PARENT_CHANGED: {
      const facilityUpdate = updateFacilitiesSchemaAndData(
        state.parentFacilities,
        getFacilities(state, action.typeOfCareId, state.data.vaParent),
        state.pages.vaFacility,
        state.data,
      );

      const { data, schema } = updateSchemaAndData(
        facilityUpdate.schema,
        action.uiSchema,
        facilityUpdate.data,
      );

      return {
        ...state,
        data,
        pages: {
          ...state.pages,
          vaFacility: schema,
        },
      };
    }
    case FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS: {
      return {
        ...state,
        ccEnabledSystems: action.ccEnabledSystems,
      };
    }
    case FORM_ELIGIBILITY_CHECKS: {
      return {
        ...state,
        eligibilityStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_ELIGIBILITY_CHECKS_SUCCEEDED: {
      const eligibility = getEligibilityChecks(action.eligibilityData);
      let clinics = state.clinics;

      if (!action.eligibilityData.clinics?.directFailed) {
        clinics = {
          ...state.clinics,
          [`${state.data.vaFacility}_${action.typeOfCareId}`]: action
            .eligibilityData.clinics,
        };
      }

      return {
        ...state,
        clinics,
        eligibility: {
          ...state.eligibility,
          [`${state.data.vaFacility}_${action.typeOfCareId}`]: eligibility,
        },
        eligibilityStatus: FETCH_STATUS.succeeded,
        pastAppointments: action.eligibilityData.pastAppointments,
      };
    }
    case FORM_ELIGIBILITY_CHECKS_FAILED: {
      return {
        ...state,
        eligibilityStatus: FETCH_STATUS.failed,
      };
    }
    case START_DIRECT_SCHEDULE_FLOW:
      return {
        ...state,
        data: {
          ...state.data,
          calendarData: {},
        },
        flowType: FLOW_TYPES.DIRECT,
      };
    case START_REQUEST_APPOINTMENT_FLOW:
      return {
        ...state,
        data: {
          ...state.data,
          calendarData: {},
        },
        flowType: FLOW_TYPES.REQUEST,
      };
    case FORM_FETCH_FACILITY_DETAILS:
      return {
        ...state,
        facilityDetailsStatus: FETCH_STATUS.loading,
      };
    case FORM_FETCH_FACILITY_DETAILS_SUCCEEDED:
      return {
        ...state,
        facilityDetailsStatus: FETCH_STATUS.succeeded,
        facilityDetails: {
          ...state.facilityDetails,
          [action.facilityId]: action.facilityDetails,
        },
      };
    case FORM_CALENDAR_FETCH_SLOTS: {
      return {
        ...state,
        appointmentSlotsStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED: {
      return {
        ...state,
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
        availableSlots: action.availableSlots,
        fetchedAppointmentSlotMonths: action.fetchedAppointmentSlotMonths,
      };
    }
    case FORM_CALENDAR_FETCH_SLOTS_FAILED: {
      return {
        ...state,
        appointmentSlotsStatus: FETCH_STATUS.failed,
      };
    }
    case FORM_CALENDAR_DATA_CHANGED: {
      return {
        ...state,
        data: {
          ...state.data,
          calendarData: action.calendarData,
        },
      };
    }
    case FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED: {
      let reasonMaxChars = REASON_MAX_CHARS.request;

      if (state.flowType === FLOW_TYPES.DIRECT) {
        const prependText = PURPOSE_TEXT.find(
          purpose => purpose.id === state.data.reasonForAppointment,
        )?.short;
        reasonMaxChars =
          REASON_MAX_CHARS.direct - (prependText?.length || 0) - 2;
      }

      let reasonSchema = set(
        'properties.reasonAdditionalInfo.maxLength',
        reasonMaxChars,
        action.schema,
      );

      reasonSchema = set(
        'properties.reasonAdditionalInfo.title',
        state.flowType === FLOW_TYPES.DIRECT
          ? REASON_ADDITIONAL_INFO_TITLES.direct
          : REASON_ADDITIONAL_INFO_TITLES.request,
        reasonSchema,
      );

      const { data, schema } = setupFormData(
        state.data,
        reasonSchema,
        action.uiSchema,
      );

      return {
        ...state,
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_REASON_FOR_APPOINTMENT_CHANGED: {
      let newSchema = state.pages.reasonForAppointment;

      if (state.flowType === FLOW_TYPES.DIRECT) {
        const prependText = PURPOSE_TEXT.find(
          purpose => purpose.id === action.data.reasonForAppointment,
        )?.short;
        newSchema = set(
          'properties.reasonAdditionalInfo.maxLength',
          REASON_MAX_CHARS.direct - (prependText?.length || 0) - 2,
          newSchema,
        );
      }

      const { data, schema } = updateSchemaAndData(
        newSchema,
        action.uiSchema,
        action.data,
      );

      return {
        ...state,
        data,
        pages: {
          ...state.pages,
          reasonForAppointment: schema,
        },
      };
    }
    case FORM_CLINIC_PAGE_OPENED_SUCCEEDED: {
      let newSchema = action.schema;
      let clinics =
        state.clinics[
          `${state.data.vaFacility}_${getTypeOfCare(state.data).id}`
        ];

      if (state.pastAppointments) {
        const pastAppointmentDateMap = new Map();
        const rootOrgId = getIdOfRootOrganization(
          state.parentFacilities,
          state.data.vaParent,
        );
        state.pastAppointments.forEach(appt => {
          const apptTime = appt.startDate;
          const latestApptTime = pastAppointmentDateMap.get(appt.clinicId);
          if (
            // Remove parse function when converting the past appointment call to FHIR service
            appt.facilityId === parseFakeFHIRId(rootOrgId) &&
            (!latestApptTime || latestApptTime > apptTime)
          ) {
            pastAppointmentDateMap.set(appt.clinicId, apptTime);
          }
        });

        clinics = clinics.filter(clinic =>
          pastAppointmentDateMap.has(clinic.clinicId),
        );
      }

      if (clinics.length === 1) {
        const clinic = clinics[0];
        newSchema = {
          ...newSchema,
          properties: {
            clinicId: {
              type: 'string',
              title: `Would you like to make an appointment at ${clinic.clinicFriendlyLocationName ||
                clinic.clinicName}?`,
              enum: [clinic.clinicId, 'NONE'],
              enumNames: [
                'Yes, make my appointment here',
                'No, I need a different clinic',
              ],
            },
          },
        };
      } else {
        newSchema = {
          ...newSchema,
          properties: {
            clinicId: {
              type: 'string',
              title:
                'You can choose a clinic where you’ve been seen or request an appointment at a different clinic.',
              enum: clinics.map(clinic => clinic.clinicId).concat('NONE'),
              enumNames: clinics
                .map(
                  clinic =>
                    clinic.clinicFriendlyLocationName || clinic.clinicName,
                )
                .concat('I need a different clinic'),
            },
          },
        };
      }

      const { data, schema } = setupFormData(
        state.data,
        newSchema,
        action.uiSchema,
      );

      return {
        ...state,
        data: {
          ...data,
          calendarData: {},
        },
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN: {
      return {
        ...state,
        parentFacilitiesStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED: {
      let formData = state.data;
      let initialSchema = action.schema;
      const parentFacilities =
        action.parentFacilities || state.parentFacilities;
      if (state.ccEnabledSystems?.length === 1) {
        formData = {
          ...formData,
          communityCareSystemId: getOrganizationBySiteId(
            parentFacilities,
            state.ccEnabledSystems[0],
          ).id,
        };
        initialSchema = unset(
          'properties.communityCareSystemId',
          initialSchema,
        );
      } else {
        const systems = action.parentFacilities.filter(
          parent => !parent.partOf,
        );
        initialSchema = set(
          'properties.communityCareSystemId.enum',
          systems.map(system => system.id),
          initialSchema,
        );
        initialSchema.properties.communityCareSystemId.enumNames = systems.map(
          system => `${system.address[0].city}, ${system.address[0].state}`,
        );
        initialSchema.required.push('communityCareSystemId');
      }
      const { data, schema } = setupFormData(
        formData,
        initialSchema,
        action.uiSchema,
      );

      return {
        ...state,
        parentFacilitiesStatus: FETCH_STATUS.succeeded,
        parentFacilities,
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_SUBMIT:
      return {
        ...state,
        submitStatus: FETCH_STATUS.loading,
      };
    case FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.succeeded,
      };
    case FORM_SUBMIT_FAILED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.failed,
      };
    case FORM_UPDATE_CC_ELIGIBILITY: {
      return {
        ...state,
        isCCEligible: action.isEligible,
      };
    }
    default:
      return state;
  }
}
