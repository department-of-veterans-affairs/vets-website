/* eslint-disable sonarjs/max-switch-cases */
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';

import {
  updateSchemasAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import {
  FORM_DATA_UPDATED,
  FORM_PAGE_OPENED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_UPDATE_FACILITY_TYPE,
  FORM_UPDATE_SELECTED_PROVIDER,
  FORM_UPDATE_FACILITY_EHR,
  FORM_PAGE_FACILITY_V2_OPEN,
  FORM_PAGE_FACILITY_V2_OPEN_SUCCEEDED,
  FORM_PAGE_FACILITY_V2_OPEN_FAILED,
  FORM_PAGE_FACILITY_SORT_METHOD_UPDATED,
  FORM_PAGE_CC_FACILITY_SORT_METHOD_UPDATED,
  FORM_REQUEST_CURRENT_LOCATION,
  FORM_REQUEST_CURRENT_LOCATION_FAILED,
  FORM_CALENDAR_FETCH_SLOTS,
  FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
  FORM_CALENDAR_FETCH_SLOTS_FAILED,
  FORM_CALENDAR_DATA_CHANGED,
  FORM_FETCH_FACILITY_DETAILS,
  FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
  FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS,
  FORM_ELIGIBILITY_CHECKS,
  FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
  FORM_ELIGIBILITY_CHECKS_FAILED,
  FORM_SHOW_ELIGIBILITY_MODAL,
  FORM_HIDE_ELIGIBILITY_MODAL,
  START_DIRECT_SCHEDULE_FLOW,
  START_REQUEST_APPOINTMENT_FLOW,
  FORM_SHOW_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL,
  FORM_HIDE_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL,
  FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED,
  FORM_REASON_FOR_APPOINTMENT_CHANGED,
  FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED,
  FORM_PAGE_COMMUNITY_CARE_PROVIDER_SELECTION_OPENED,
  FORM_SUBMIT,
  FORM_SUBMIT_FAILED,
  FORM_UPDATE_CC_ELIGIBILITY,
  CLICKED_UPDATE_ADDRESS_BUTTON,
  FORM_REQUESTED_PROVIDERS,
  FORM_REQUESTED_PROVIDERS_SUCCEEDED,
  FORM_REQUESTED_PROVIDERS_FAILED,
  FORM_FETCH_PATIENT_PROVIDER_RELATIONSHIPS,
  FORM_FETCH_PATIENT_PROVIDER_RELATIONSHIPS_SUCCEEDED,
  FORM_FETCH_PATIENT_PROVIDER_RELATIONSHIPS_FAILED,
  FORM_FETCH_RECENT_LOCATIONS_FAILED,
  FORM_FETCH_RECENT_LOCATIONS,
  FORM_FETCH_RECENT_LOCATIONS_SUCCEEDED,
} from './actions';

import {
  STARTED_NEW_APPOINTMENT_FLOW,
  FORM_SUBMIT_SUCCEEDED,
} from '../../redux/sitewide';

import {
  FACILITY_SORT_METHODS,
  FACILITY_TYPES,
  FLOW_TYPES,
  FETCH_STATUS,
  REASON_MAX_CHARS,
  NEW_REASON_MAX_CHARS,
} from '../../utils/constants';

import { getTypeOfCare } from './selectors';
import { distanceBetween } from '../../utils/address';
import { isTypeOfCareSupported } from '../../services/location';

const REASON_ADDITIONAL_INFO_TITLES = {
  va:
    'Enter a brief reason for this appointment. Your provider will contact you if they need more details.',
  ccRequest:
    'Share any information that you think will help the provider prepare for your appointment. You don’t have to share anything if you don’t want to.',
};

const initialState = {
  pages: {},
  data: {},
  facilities: {},
  sortedFacilities: {},
  facilityDetails: {},
  clinics: {},
  eligibility: {},
  patientProviderRelationships: [],
  patientProviderRelationshipsStatus: FETCH_STATUS.notStarted,
  parentFacilities: null,
  ccEnabledSystems: null,
  pageChangeInProgress: false,
  previousPages: {},
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
  hideUpdateAddressAlert: false,
  requestLocationStatus: FETCH_STATUS.notStarted,
  communityCareProviders: {},
  requestStatus: FETCH_STATUS.notStarted,
  currentLocation: {},
  ccProviderPageSortMethod: FACILITY_SORT_METHODS.distanceFromResidential,
  facilityPageSortMethod: null,
  isNewAppointmentStarted: false,
  fetchRecentLocationStatus: FETCH_STATUS.notStarted,
  isAppointmentSelectionError: false,
  ehr: null,
  backendServiceFailures: null,
};

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemasAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

function resetFormDataOnChange(state, data) {
  const oldData = state.data;

  let newPages = state.pages;
  let newPatientProviderRelationshipsStatus =
    state.patientProviderRelationshipsStatus;
  let newPatientProviderRelationships = state.patientProviderRelationships;
  let newBackendServiceFailures = state.backendServiceFailures;
  let newData = data;

  // Reset form data if typeOfCare has changed
  if (getTypeOfCare(newData)?.id !== getTypeOfCare(oldData)?.id) {
    if (newPages.vaFacility) {
      newPages = unset('vaFacility', newPages);
    }

    if (newPages.vaFacility2) {
      newPages = unset('vaFacility2', newPages);
    }

    if (newData.vaFacility) {
      newData = unset('vaFacility', newData);
    }

    if (newData.isSingleVaFacility) {
      newData = unset('isSingleVaFacility', newData);
    }

    // reset community care provider if type of care changes
    if (newPages.ccPreferences || !!newData.communityCareProvider?.id) {
      newPages = unset('ccPreferences', newPages);
      newData = set('communityCareProvider', {}, newData);
    }
  }

  // Reset provider relationships and form data if chosen VA facility
  // has changed
  if (newData.vaFacility !== oldData.vaFacility) {
    newData = unset('selectedProvider', newData);
    newPatientProviderRelationships = [];
    newPatientProviderRelationshipsStatus = FETCH_STATUS.notStarted;
    newBackendServiceFailures = null;
  }

  return {
    newPages,
    newData,
    newPatientProviderRelationshipsStatus,
    newPatientProviderRelationships,
    newBackendServiceFailures,
  };
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
      const { data, schema } = updateSchemasAndData(
        state.pages[action.page],
        action.uiSchema,
        action.data,
      );

      const {
        newPages,
        newData,
        newPatientProviderRelationshipsStatus,
        newPatientProviderRelationships,
      } = resetFormDataOnChange(state, data);

      return {
        ...state,
        data: newData,
        patientProviderRelationshipsStatus: newPatientProviderRelationshipsStatus,
        patientProviderRelationships: newPatientProviderRelationships,
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
        pastAppointments: state.pastAppointments,
        submitStatus: FETCH_STATUS.notStarted,
        hideUpdateAddressAlert: state.hideUpdateAddressAlert,
        isNewAppointmentStarted: true,
      };
    }
    case FORM_PAGE_CHANGE_STARTED: {
      let updatedPreviousPages = state.previousPages;
      if (!Object.keys(updatedPreviousPages).length) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKey]: 'home',
        };
      }

      const { newPages, newData } = resetFormDataOnChange(
        state,
        action.data || state.data,
      );

      return {
        ...state,
        pageChangeInProgress: true,
        previousPages: updatedPreviousPages,
        data: newData,
        pages: newPages,
      };
    }
    case FORM_PAGE_CHANGE_COMPLETED: {
      let updatedPreviousPages = state.previousPages;
      if (!Object.keys(updatedPreviousPages).length) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKey]: 'home',
        };
      }
      if (
        (action.direction === 'next' ||
          action.direction === 'requestAppointment') &&
        action.pageKey !== action.pageKeyNext
      ) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKeyNext]: action.pageKey,
        };
      }
      return {
        ...state,
        pageChangeInProgress: false,
        previousPages: updatedPreviousPages,
        currentPageKey:
          action.direction === 'next' ||
          action.direction === 'requestAppointment'
            ? action.pageKeyNext
            : updatedPreviousPages[action.pageKey],
      };
    }
    case FORM_SHOW_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL: {
      return {
        ...state,
        showPodiatryAppointmentUnavailableModal: true,
        pageChangeInProgress: false,
      };
    }
    case FORM_HIDE_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL: {
      return {
        ...state,
        showPodiatryAppointmentUnavailableModal: false,
      };
    }
    case CLICKED_UPDATE_ADDRESS_BUTTON: {
      return {
        ...state,
        hideUpdateAddressAlert: true,
      };
    }
    case FORM_UPDATE_FACILITY_TYPE: {
      return {
        ...state,
        data: {
          ...state.data,
          facilityType: action.facilityType,
        },
      };
    }
    case FORM_UPDATE_SELECTED_PROVIDER: {
      return {
        ...state,
        data: {
          ...state.data,
          selectedProvider: action.provider.providerId,
        },
      };
    }
    case FORM_UPDATE_FACILITY_EHR: {
      return {
        ...state,
        ehr: action.ehr,
      };
    }
    case FORM_PAGE_FACILITY_V2_OPEN: {
      return {
        ...state,
        childFacilitiesStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_PAGE_FACILITY_V2_OPEN_SUCCEEDED: {
      let newSchema = action.schema;
      const { removeFacilityConfigCheck } = action;
      let newData = state.data;
      let { facilities } = action;
      const {
        typeOfCareId,
        featureRecentLocationsFilter,
        address,
        cernerSiteIds,
      } = action;
      const hasResidentialCoordinates =
        !!address?.latitude && !!address?.longitude;

      let sortMethod = FACILITY_SORT_METHODS.alphabetical;
      if (featureRecentLocationsFilter && facilities?.length) {
        sortMethod = FACILITY_SORT_METHODS.recentLocations;
      } else if (hasResidentialCoordinates) {
        sortMethod = FACILITY_SORT_METHODS.distanceFromResidential;
      }

      facilities = facilities.filter(
        facility => !!facility.address?.city && !!facility.address?.state,
      );

      if (hasResidentialCoordinates && facilities.length) {
        facilities = facilities.map(facility => {
          const distanceFromResidentialAddress = distanceBetween(
            address.latitude,
            address.longitude,
            facility.position.latitude,
            facility.position.longitude,
          );

          return {
            ...facility,
            legacyVAR: {
              ...facility.legacyVAR,
              distanceFromResidentialAddress,
            },
          };
        });
      }

      const supportedFacilities = facilities.filter(facility =>
        isTypeOfCareSupported(
          facility,
          typeOfCareId,
          cernerSiteIds,
          removeFacilityConfigCheck,
        ),
      );

      if (supportedFacilities.length === 1) {
        newData = {
          ...newData,
          vaFacility: supportedFacilities[0]?.id,
        };
      }

      let sortedFacilities = supportedFacilities;
      if (supportedFacilities.length > 0) {
        if (sortMethod === FACILITY_SORT_METHODS.alphabetical) {
          sortedFacilities = supportedFacilities.sort((a, b) =>
            a.name.localeCompare(b.name),
          );
        } else if (
          sortMethod === FACILITY_SORT_METHODS.distanceFromResidential
        ) {
          sortedFacilities = facilities.sort(
            (a, b) => a.legacyVAR[sortMethod] - b.legacyVAR[sortMethod],
          );
        }
      }

      newSchema = set(
        'properties.vaFacility',
        {
          type: 'string',
          enum: sortedFacilities?.map(facility => facility.id),
          enumNames: sortedFacilities,
        },
        newSchema,
      );

      const { data, schema } = setupFormData(
        (newData = {
          ...newData,
          isSingleVaFacility: supportedFacilities.length === 1,
        }),
        newSchema,
        action.uiSchema,
      );

      return {
        ...state,
        data,
        pages: {
          ...state.pages,
          vaFacilityV2: schema,
        },
        facilities: {
          ...state.facilities,
          [typeOfCareId]: facilities,
        },
        childFacilitiesStatus: FETCH_STATUS.succeeded,
        facilityPageSortMethod: sortMethod,
        showEligibilityModal: false,
        requestLocationStatus: FETCH_STATUS.notStarted,
      };
    }
    case FORM_REQUEST_CURRENT_LOCATION: {
      return {
        ...state,
        requestLocationStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_REQUEST_CURRENT_LOCATION_FAILED: {
      return {
        ...state,
        requestLocationStatus: FETCH_STATUS.failed,
      };
    }
    case FORM_PAGE_CC_FACILITY_SORT_METHOD_UPDATED: {
      const requestLocationStatus = FETCH_STATUS.notStarted;

      if (
        action.sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation
      ) {
        return {
          ...state,
          currentLocation: {
            latitude: action.location?.coords.latitude,
            longitude: action.location?.coords.longitude,
          },
          ccProviderPageSortMethod: action.sortMethod,
          requestLocationStatus,
        };
      }
      if (action.sortMethod === FACILITY_SORT_METHODS.distanceFromFacility) {
        return {
          ...state,
          selectedCCFacility: action.location,
          ccProviderPageSortMethod: action.sortMethod,
          requestLocationStatus,
        };
      }
      return {
        ...state,
        ccProviderPageSortMethod: action.sortMethod,
        requestLocationStatus,
      };
    }

    case FORM_PAGE_FACILITY_SORT_METHOD_UPDATED: {
      const formData = state.data;
      const typeOfCareId = getTypeOfCare(formData).id;
      const {
        location,
        cernerSiteIds,
        sortMethod,
        calculatedDistance,
        uiSchema,
      } = action;
      let facilities = state.facilities[typeOfCareId];
      let sortedFacilities;
      let newSchema = state.pages.vaFacilityV2;
      let { requestLocationStatus } = state;

      if (!calculatedDistance && location && facilities?.length) {
        const { coords } = location;
        const { latitude, longitude } = coords;

        if (latitude && longitude) {
          facilities = facilities.map(facility => {
            if (!facility.address?.city || !facility.address?.state) {
              return facility;
            }
            const distanceFromCurrentLocation = distanceBetween(
              latitude,
              longitude,
              facility.position.latitude,
              facility.position.longitude,
            );

            return {
              ...facility,
              legacyVAR: {
                ...facility.legacyVAR,
                distanceFromCurrentLocation,
              },
            };
          });
        }

        requestLocationStatus = FETCH_STATUS.succeeded;
      }

      const typeOfCareFacilities = facilities.filter(facility =>
        isTypeOfCareSupported(facility, typeOfCareId, cernerSiteIds),
      );

      if (sortMethod === FACILITY_SORT_METHODS.alphabetical) {
        sortedFacilities = typeOfCareFacilities.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      } else if (
        sortMethod === FACILITY_SORT_METHODS.distanceFromResidential ||
        (sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation &&
          location)
      ) {
        sortedFacilities = typeOfCareFacilities.sort(
          (a, b) => a.legacyVAR[sortMethod] - b.legacyVAR[sortMethod],
        );
      } else {
        sortedFacilities = typeOfCareFacilities;
      }

      newSchema = set(
        'properties.vaFacility',
        {
          type: 'string',
          enum: sortedFacilities?.map(facility => facility.id),
          enumNames: sortedFacilities,
        },
        newSchema,
      );

      const { schema } = updateSchemasAndData(newSchema, uiSchema, formData);

      return {
        ...state,
        pages: {
          ...state.pages,
          vaFacilityV2: schema,
        },
        childFacilitiesStatus: FETCH_STATUS.succeeded,
        facilityPageSortMethod: sortMethod,
        requestLocationStatus,
      };
    }
    case FORM_FETCH_RECENT_LOCATIONS: {
      return {
        ...state,
        fetchRecentLocationStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_FETCH_RECENT_LOCATIONS_SUCCEEDED: {
      const { recentLocations } = action;
      return {
        ...state,
        fetchRecentLocationStatus: FETCH_STATUS.succeeded,
        recentLocations,
      };
    }
    case FORM_FETCH_RECENT_LOCATIONS_FAILED: {
      return {
        ...state,
        fetchRecentLocationStatus: FETCH_STATUS.failed,
      };
    }
    case FORM_PAGE_FACILITY_V2_OPEN_FAILED: {
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
    case FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS: {
      return {
        ...state,
        ccEnabledSystems: action.ccEnabledSystems,
        parentFacilities: action.parentFacilities,
        parentFacilitiesStatus: FETCH_STATUS.succeeded,
      };
    }
    case FORM_ELIGIBILITY_CHECKS: {
      return {
        ...state,
        eligibilityStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_ELIGIBILITY_CHECKS_SUCCEEDED: {
      const facilityId = action.facilityId || state.data.vaFacility;

      let { clinics } = state;

      if (Array.isArray(action.clinics)) {
        clinics = {
          ...state.clinics,
          [`${facilityId}_${action.typeOfCare?.id}`]: action.clinics,
        };
      }

      // if past appointments exists in state continue to keep it in state
      let { pastAppointments } = state;
      const hasPastAppts = !!state.pastAppointments;
      if (hasPastAppts) {
        pastAppointments = [...state.pastAppointments];
      } else {
        pastAppointments = action.pastAppointments;
      }

      return {
        ...state,
        clinics,
        eligibility: {
          ...state.eligibility,
          [`${facilityId}_${action.typeOfCare?.id}`]: action.eligibility,
        },
        eligibilityStatus: FETCH_STATUS.succeeded,
        pastAppointments,
        showEligibilityModal:
          action.showModal &&
          !action.eligibility.direct &&
          !action.eligibility.request,
      };
    }
    case FORM_ELIGIBILITY_CHECKS_FAILED: {
      return {
        ...state,
        eligibilityStatus: FETCH_STATUS.failed,
      };
    }
    case FORM_SHOW_ELIGIBILITY_MODAL: {
      return {
        ...state,
        showEligibilityModal: true,
      };
    }
    case FORM_HIDE_ELIGIBILITY_MODAL: {
      return {
        ...state,
        showEligibilityModal: false,
      };
    }
    case START_DIRECT_SCHEDULE_FLOW:
      return {
        ...state,
        data: {
          ...state.data,
          selectedDates: [],
        },
        flowType: FLOW_TYPES.DIRECT,
      };
    case START_REQUEST_APPOINTMENT_FLOW:
      return {
        ...state,
        data: {
          ...state.data,
          selectedDates: [],
        },
        flowType: FLOW_TYPES.REQUEST,
      };
    case FORM_FETCH_PATIENT_PROVIDER_RELATIONSHIPS:
      return {
        ...state,
        patientProviderRelationshipsStatus: FETCH_STATUS.loading,
      };
    case FORM_FETCH_PATIENT_PROVIDER_RELATIONSHIPS_SUCCEEDED:
      return {
        ...state,
        patientProviderRelationshipsStatus: FETCH_STATUS.succeeded,
        patientProviderRelationships:
          action.relationships?.patientProviderRelationships,
        backendServiceFailures: action.relationships?.backendServiceFailures,
      };
    case FORM_FETCH_PATIENT_PROVIDER_RELATIONSHIPS_FAILED:
      return {
        ...state,
        patientProviderRelationshipsStatus: FETCH_STATUS.failed,
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
          selectedDates: action.selectedDates,
        },
        isAppointmentSelectionError: action.isAppointmentSelectionError,
      };
    }
    case FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED: {
      const formData = state.data;
      const isCommunityCare =
        formData.facilityType === FACILITY_TYPES.COMMUNITY_CARE.id;
      const maxChars = !isCommunityCare
        ? NEW_REASON_MAX_CHARS
        : REASON_MAX_CHARS;
      let additionalInfoTitle = REASON_ADDITIONAL_INFO_TITLES.ccRequest;

      if (formData.facilityType !== FACILITY_TYPES.COMMUNITY_CARE.id) {
        additionalInfoTitle = REASON_ADDITIONAL_INFO_TITLES.va;
      }

      let reasonSchema = set(
        'properties.reasonAdditionalInfo.maxLength',
        maxChars,
        action.schema,
      );

      reasonSchema = set(
        'properties.reasonAdditionalInfo.title',
        additionalInfoTitle,
        reasonSchema,
      );

      const { data, schema } = setupFormData(
        formData,
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
      const newSchema = state.pages.reasonForAppointment;

      const { data, schema } = updateSchemasAndData(
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
    case FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED: {
      let formData = state.data;
      const typeOfCare = getTypeOfCare(formData);
      let initialSchema = set(
        'properties.hasCommunityCareProvider.title',
        `Do you have a preferred VA-approved community care provider for this ${
          typeOfCare.name
        } appointment?`,
        action.schema,
      );

      if (state.ccEnabledSystems?.length === 1) {
        formData = {
          ...formData,
          communityCareSystemId: state.ccEnabledSystems[0].id,
        };
        initialSchema = unset(
          'properties.communityCareSystemId',
          initialSchema,
        );
      } else {
        initialSchema = set(
          'properties.communityCareSystemId.enum',
          state.ccEnabledSystems.map(system => system.id),
          initialSchema,
        );
        initialSchema.properties.communityCareSystemId.enumNames = state.ccEnabledSystems.map(
          system => `${system.address?.city}, ${system.address?.state}`,
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
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_PAGE_COMMUNITY_CARE_PROVIDER_SELECTION_OPENED: {
      let formData = state.data;
      const hasResidentialCoordinates =
        !!action.residentialAddress?.latitude &&
        !!action.residentialAddress?.longitude;
      const ccProviderPageSortMethod = hasResidentialCoordinates
        ? FACILITY_SORT_METHODS.distanceFromResidential
        : FACILITY_SORT_METHODS.distanceFromFacility;

      const selectedCCFacility =
        !hasResidentialCoordinates && state.ccEnabledSystems?.length > 1
          ? state.ccEnabledSystems.find(
              system => system.id === state.data?.communityCareSystemId,
            )
          : state.ccEnabledSystems[0];

      const typeOfCare = getTypeOfCare(formData);
      const initialSchema = set(
        'properties.communityCareProvider.title',
        `Request a ${typeOfCare.name} provider. (Optional)`,
        action.schema,
      );
      if (state.ccEnabledSystems?.length === 1) {
        formData = {
          ...formData,
          communityCareSystemId: state.ccEnabledSystems[0].id,
        };
      }
      const { data, schema } = setupFormData(
        formData,
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
        ccProviderPageSortMethod,
        selectedCCFacility,
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
        submitStatusVaos400: false,
      };
    case FORM_SUBMIT_FAILED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.failed,
        submitStatusVaos400: action.isVaos400Error,
        submitStatusVaos409: action.isVaos409Error,
      };
    case FORM_UPDATE_CC_ELIGIBILITY: {
      return {
        ...state,
        isCCEligible: action.isEligible,
      };
    }
    case FORM_REQUESTED_PROVIDERS: {
      return {
        ...state,
        requestStatus: FETCH_STATUS.loading,
      };
    }
    case FORM_REQUESTED_PROVIDERS_SUCCEEDED: {
      const { address, typeOfCareProviders, selectedCCFacility } = action;
      const { ccProviderPageSortMethod: sortMethod, data } = state;
      const sortByFacilityDistance =
        sortMethod === FACILITY_SORT_METHODS.distanceFromFacility;
      const updatedSortMethod = sortByFacilityDistance
        ? selectedCCFacility.id
        : sortMethod;
      const cacheKey = sortByFacilityDistance
        ? `${sortMethod}_${selectedCCFacility.id}_${getTypeOfCare(data)?.ccId}`
        : `${updatedSortMethod}_${getTypeOfCare(data)?.ccId}`;

      const providers =
        state.communityCareProviders[cacheKey] ||
        typeOfCareProviders
          .map(facility => {
            const distance = distanceBetween(
              address.latitude,
              address.longitude,
              facility.position.latitude,
              facility.position.longitude,
            );
            return { ...facility, [updatedSortMethod]: distance };
          })
          .sort((a, b) => a[updatedSortMethod] - b[updatedSortMethod]);

      return {
        ...state,
        requestStatus: FETCH_STATUS.succeeded,
        communityCareProviders: {
          ...state.communityCareProviders,
          [cacheKey]: providers,
        },
        selectedCCFacility,
      };
    }
    case FORM_REQUESTED_PROVIDERS_FAILED: {
      return {
        ...state,
        requestStatus: FETCH_STATUS.failed,
      };
    }
    default:
      return state;
  }
}
