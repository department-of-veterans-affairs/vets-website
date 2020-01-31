import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';

import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import {
  getEligibilityChecks,
  getEligibleFacilities,
} from '../utils/eligibility';

import {
  FORM_DATA_UPDATED,
  FORM_PAGE_OPENED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_UPDATE_FACILITY_TYPE,
  FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
  FORM_PAGE_FACILITY_OPEN_FAILED,
  FORM_FETCH_AVAILABLE_APPOINTMENTS,
  FORM_FETCH_AVAILABLE_APPOINTMENTS_SUCCEEDED,
  FORM_FETCH_AVAILABLE_APPOINTMENTS_FAILED,
  FORM_FETCH_FACILITY_DETAILS,
  FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES,
  FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES_FAILED,
  FORM_VA_SYSTEM_CHANGED,
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
  FORM_SUBMIT_SUCCEEDED,
  FORM_TYPE_OF_CARE_PAGE_OPENED,
  FORM_UPDATE_CC_ELIGIBILITY,
  FORM_CLOSED_CONFIRMATION_PAGE,
} from '../actions/newAppointment';

import {
  FLOW_TYPES,
  REASON_ADDITIONAL_INFO_TITLES,
  REASON_MAX_CHARS,
  FETCH_STATUS,
  PURPOSE_TEXT,
} from '../utils/constants';

import { getTypeOfCare } from '../utils/selectors';

const initialState = {
  pages: {},
  data: {},
  facilities: {},
  facilityDetails: {},
  clinics: {},
  eligibility: {},
  systems: null,
  ccEnabledSystems: null,
  pageChangeInProgress: false,
  childFacilitiesStatus: FETCH_STATUS.notStarted,
  systemsStatus: FETCH_STATUS.notStarted,
  eligibilityStatus: FETCH_STATUS.notStarted,
  facilityDetailsStatus: FETCH_STATUS.notStarted,
  pastAppointments: null,
  appointmentSlotsStatus: FETCH_STATUS.notStarted,
  availableSlots: null,
  fetchedAppointmentSlotMonths: [],
  submitStatus: FETCH_STATUS.notStarted,
  isCCEligible: false,
};

function getFacilities(state, typeOfCareId, vaSystem) {
  return state.facilities[`${typeOfCareId}_${vaSystem}`] || [];
}

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemaAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

function updateFacilitiesSchemaAndData(systems, facilities, schema, data) {
  let newSchema = schema;
  let newData = data;

  const availableFacilities = getEligibleFacilities(facilities);

  if (
    availableFacilities.length > 1 ||
    (availableFacilities.length === 1 && systems.length > 1)
  ) {
    newSchema = unset('properties.vaFacilityMessage', newSchema);
    newSchema = set(
      'properties.vaFacility',
      {
        type: 'string',
        enum: availableFacilities.map(facility => facility.institutionCode),
        enumNames: availableFacilities.map(
          facility =>
            `${facility.authoritativeName} (${facility.city}, ${
              facility.stateAbbrev
            })`,
        ),
      },
      newSchema,
    );
  } else if (newData.vaSystem) {
    newSchema = unset('properties.vaFacility', newSchema);
    if (!availableFacilities.length) {
      newSchema.properties.vaFacilityMessage = { type: 'string' };
    }
    newData = {
      ...newData,
      vaFacility: availableFacilities[0]?.institutionCode,
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
      if (
        action.data.typeOfCareId !== state.data.typeOfCareId &&
        state.pages.vaFacility
      ) {
        newPages = unset('vaFacility', newPages);
      }

      const { data, schema } = updateSchemaAndData(
        state.pages[action.page],
        action.uiSchema,
        action.data,
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
    case FORM_CLOSED_CONFIRMATION_PAGE: {
      return {
        ...initialState,
        systems: state.systems,
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

      const { data, schema } = setupFormData(
        prefilledData,
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
      const systems = action.systems || state.systems;

      // For both systems and facilities, we want to put them in the form
      // schema as radio options if we have more than one to choose from.
      // If we only have one, then we want to just set the value in the
      // form data and remove the schema for that field, so we don't
      // show the question to the user
      if (systems.length > 1) {
        newSchema = set(
          'properties.vaSystem.enum',
          systems.map(sys => sys.institutionCode),
          action.schema,
        );
        newSchema = set(
          'properties.vaSystem.enumNames',
          systems.map(sys => sys.authoritativeName),
          newSchema,
        );
      } else {
        newSchema = unset('properties.vaSystem', newSchema);
        newData = {
          ...newData,
          vaSystem: systems[0]?.institutionCode,
        };
      }

      const facilities =
        action.facilities ||
        getFacilities(state, action.typeOfCareId, newData.vaSystem);

      const facilityUpdate = updateFacilitiesSchemaAndData(
        systems,
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
      if (action.eligibilityData) {
        const facilityEligibility = getEligibilityChecks(
          newData.vaSystem,
          action.typeOfCareId,
          action.eligibilityData,
        );

        eligibility = {
          ...state.eligibility,
          [`${data.vaFacility}_${action.typeOfCareId}`]: facilityEligibility,
        };
        clinics = {
          ...state.clinics,
          [`${data.vaFacility}_${action.typeOfCareId}`]: action.eligibilityData
            .clinics,
        };
      }

      return {
        ...state,
        systems,
        data,
        systemsStatus: FETCH_STATUS.succeeded,
        facilities: {
          ...state.facilities,
          [`${action.typeOfCareId}_${newData.vaSystem}`]: facilities,
        },
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
        eligibility,
        clinics,
      };
    }
    case FORM_PAGE_FACILITY_OPEN_FAILED: {
      return {
        ...state,
        systemsStatus: FETCH_STATUS.failed,
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
        state.systems,
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
          [`${action.typeOfCareId}_${newData.vaSystem}`]: action.facilities,
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
    case FORM_VA_SYSTEM_CHANGED: {
      const facilityUpdate = updateFacilitiesSchemaAndData(
        state.systems,
        getFacilities(state, action.typeOfCareId, state.data.vaSystem),
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
      const eligibility = getEligibilityChecks(
        state.data.vaSystem,
        action.typeOfCareId,
        action.eligibilityData,
      );

      return {
        ...state,
        clinics: {
          ...state.clinics,
          [`${state.data.vaFacility}_${action.typeOfCareId}`]: action
            .eligibilityData.clinics,
        },
        eligibility: {
          ...state.eligibility,
          [`${state.data.vaFacility}_${action.typeOfCareId}`]: eligibility,
        },
        eligibilityStatus: FETCH_STATUS.succeeded,
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
        pastAppointments: action.appointments,
        flowType: FLOW_TYPES.DIRECT,
      };
    case START_REQUEST_APPOINTMENT_FLOW:
      return {
        ...state,
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
    case FORM_FETCH_AVAILABLE_APPOINTMENTS: {
      return {
        ...state,
        appointmentSlotsStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_FETCH_AVAILABLE_APPOINTMENTS_SUCCEEDED: {
      return {
        ...state,
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
        availableSlots: action.availableSlots,
        fetchedAppointmentSlotMonths: action.fetchedAppointmentSlotMonths,
        appointmentLength: action.appointmentLength,
      };
    }
    case FORM_FETCH_AVAILABLE_APPOINTMENTS_FAILED: {
      return {
        ...state,
        appointmentSlotsStatus: FETCH_STATUS.failed,
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
        state.pastAppointments.forEach(appt => {
          const apptTime = appt.startDate;
          const systemId = state.data.vaSystem;
          const latestApptTime = pastAppointmentDateMap.get(appt.clinicId);
          if (
            appt.facilityId === systemId &&
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
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN: {
      return {
        ...state,
        systemsStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED: {
      let formData = state.data;
      let initialSchema = action.schema;
      if (state.ccEnabledSystems?.length === 1) {
        formData = {
          ...formData,
          communityCareSystemId: state.ccEnabledSystems[0],
        };
        initialSchema = unset(
          'properties.communityCareSystemId',
          initialSchema,
        );
      } else {
        initialSchema = set(
          'properties.communityCareSystemId.enum',
          action.systems.map(system => system.institutionCode),
          initialSchema,
        );
        initialSchema.properties.communityCareSystemId.enumNames = action.systems.map(
          system => `${system.city}, ${system.stateAbbrev}`,
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
        systemsStatus: FETCH_STATUS.succeeded,
        systems: action.systems,
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_FAILED: {
      return {
        ...state,
        systemsStatus: FETCH_STATUS.failed,
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
