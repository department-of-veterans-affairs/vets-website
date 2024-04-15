import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  updateSchemasAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import {
  FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
  FORM_DATA_UPDATED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_OPENED,
  FORM_PAGE_FACILITY_OPEN,
  FORM_PAGE_FACILITY_OPEN_FAILED,
  FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
  FORM_PAGE_CONTACT_FACILITIES_OPEN,
  FORM_PAGE_CONTACT_FACILITIES_OPEN_SUCCEEDED,
  FORM_PAGE_CONTACT_FACILITIES_OPEN_FAILED,
  FORM_FETCH_CLINICS,
  FORM_FETCH_CLINICS_FAILED,
  FORM_FETCH_CLINICS_SUCCEEDED,
  FORM_HIDE_ELIGIBILITY_MODAL,
  FORM_SHOW_ELIGIBILITY_MODAL,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT,
  FORM_REQUEST_CURRENT_LOCATION_FAILED,
  FORM_PAGE_FACILITY_SORT_METHOD_UPDATED,
  FORM_REQUEST_CURRENT_LOCATION,
  FORM_CALENDAR_DATA_CHANGED,
  FORM_CALENDAR_FETCH_SLOTS,
  FORM_CALENDAR_FETCH_SLOTS_FAILED,
  FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
  FORM_PREFILL_CONTACT_INFO,
} from './actions';

import {
  STARTED_NEW_VACCINE_FLOW,
  VACCINE_FORM_SUBMIT_SUCCEEDED,
} from '../../redux/sitewide';

import { FACILITY_SORT_METHODS, FETCH_STATUS } from '../../utils/constants';
import { distanceBetween } from '../../utils/address';
import { TYPE_OF_CARE_ID } from '../utils';

const initialState = {
  newBooking: {
    data: {},
    pages: {},
    pageChangeInProgress: false,
    previousPages: {},
    facilities: null,
    facilitiesStatus: FETCH_STATUS.notStarted,
    facilityPageSortMethod: null,
    clinics: {},
    clinicsStatus: FETCH_STATUS.notStarted,
    appointmentSlotsStatus: FETCH_STATUS.notStarted,
    availableSlots: null,
    fetchedAppointmentSlotMonths: [],
    requestLocationStatus: FETCH_STATUS.notStarted,
  },
  submitStatus: FETCH_STATUS.notStarted,
  submitErrorReason: null,
  successfulRequest: null,
};

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemasAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

export default function covid19VaccineReducer(state = initialState, action) {
  switch (action.type) {
    case FORM_PAGE_OPENED: {
      const { newBooking } = state;
      const { data, schema } = setupFormData(
        newBooking.data,
        action.schema,
        action.uiSchema,
      );

      return {
        ...state,
        newBooking: {
          ...newBooking,
          data,
          pages: {
            ...newBooking.pages,
            [action.page]: schema,
          },
        },
      };
    }
    case FORM_DATA_UPDATED: {
      const { newBooking } = state;
      const { data, schema } = updateSchemasAndData(
        newBooking.pages[action.page],
        action.uiSchema,
        action.data,
      );

      return {
        ...state,
        newBooking: {
          ...newBooking,
          data,
          pages: {
            ...newBooking.pages,
            [action.page]: schema,
          },
        },
      };
    }
    case FORM_PAGE_CHANGE_STARTED: {
      let updatedPreviousPages = state.newBooking.previousPages;
      if (!Object.keys(updatedPreviousPages).length) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKey]: 'home',
        };
      }
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          data: action.data || state.newBooking.data,
          pageChangeInProgress: true,
          previousPages: updatedPreviousPages,
        },
      };
    }
    case FORM_PAGE_CHANGE_COMPLETED: {
      let updatedPreviousPages = state.newBooking.previousPages;
      if (!Object.keys(updatedPreviousPages).length) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKey]: 'home',
        };
      }
      if (
        action.direction === 'next' &&
        action.pageKey !== action.pageKeyNext
      ) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKeyNext]: action.pageKey,
        };
      }
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          pageChangeInProgress: false,
          previousPages: updatedPreviousPages,
        },
      };
    }
    case FORM_PAGE_CONTACT_FACILITIES_OPEN:
    case FORM_PAGE_FACILITY_OPEN: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          facilitiesStatus: FETCH_STATUS.loading,
        },
      };
    }
    case FORM_PAGE_FACILITY_OPEN_SUCCEEDED: {
      let { facilities } = action;
      const { address } = action;
      const hasResidentialCoordinates =
        !!action.address?.latitude && !!action.address?.longitude;
      let sortMethod = state.newBooking.facilityPageSortMethod;
      if (!sortMethod) {
        sortMethod = hasResidentialCoordinates
          ? FACILITY_SORT_METHODS.distanceFromResidential
          : FACILITY_SORT_METHODS.alphabetical;
      }

      if (hasResidentialCoordinates && facilities.length) {
        facilities = facilities
          .map(facility => {
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
          })
          .sort((a, b) => a.legacyVAR[sortMethod] - b.legacyVAR[sortMethod]);
      }

      const typeOfCareFacilities = facilities.filter(
        facility =>
          facility.legacyVAR.settings[TYPE_OF_CARE_ID]?.direct.enabled,
      );

      let { data } = state.newBooking;
      if (typeOfCareFacilities.length === 1) {
        data = {
          ...data,
          vaFacility: typeOfCareFacilities[0]?.id,
        };
      }

      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          data,
          facilities,
          facilitiesStatus: FETCH_STATUS.succeeded,
          facilityPageSortMethod: sortMethod,
          showEligibilityModal: false,
        },
      };
    }
    case FORM_PAGE_CONTACT_FACILITIES_OPEN_FAILED:
    case FORM_PAGE_FACILITY_OPEN_FAILED: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          facilitiesStatus: FETCH_STATUS.failed,
        },
      };
    }
    case FORM_FETCH_CLINICS: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          clinicsStatus: FETCH_STATUS.loading,
        },
      };
    }
    case FORM_FETCH_CLINICS_SUCCEEDED: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          data: {
            ...state.newBooking.data,
            clinicId: action.clinics.length === 1 ? action.clinics[0].id : null,
          },
          clinics: {
            ...state.newBooking.clinics,
            showEligibilityModal: action.showModal,
            [action.facilityId]: action.clinics,
          },
          clinicsStatus: FETCH_STATUS.succeeded,
        },
      };
    }
    case FORM_FETCH_CLINICS_FAILED: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          clinicsStatus: FETCH_STATUS.failed,
        },
      };
    }
    case FORM_SHOW_ELIGIBILITY_MODAL: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          showEligibilityModal: true,
        },
      };
    }
    case FORM_HIDE_ELIGIBILITY_MODAL: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          showEligibilityModal: false,
        },
      };
    }
    case FORM_REQUEST_CURRENT_LOCATION: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          requestLocationStatus: FETCH_STATUS.loading,
        },
      };
    }
    case FORM_PAGE_FACILITY_SORT_METHOD_UPDATED: {
      const { sortMethod } = action;
      const { location } = action;
      let { facilities } = state.newBooking;
      let { requestLocationStatus } = state.newBooking;

      if (location && facilities?.length) {
        const { coords } = location;
        const { latitude, longitude } = coords;

        if (latitude && longitude) {
          facilities = facilities.map(facility => {
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

      if (sortMethod === FACILITY_SORT_METHODS.alphabetical) {
        facilities = facilities.sort((a, b) => a.name - b.name);
      } else {
        facilities = facilities.sort(
          (a, b) => a.legacyVAR[sortMethod] - b.legacyVAR[sortMethod],
        );
      }

      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          facilities,
          facilitiesStatus: FETCH_STATUS.succeeded,
          facilityPageSortMethod: sortMethod,
          requestLocationStatus,
        },
      };
    }
    case FORM_REQUEST_CURRENT_LOCATION_FAILED: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          requestLocationStatus: FETCH_STATUS.failed,
        },
      };
    }
    case FORM_CLINIC_PAGE_OPENED_SUCCEEDED: {
      let newSchema = action.schema;
      const clinics =
        state.newBooking.clinics[state.newBooking.data.vaFacility];

      newSchema = {
        ...newSchema,
        properties: {
          clinicId: {
            type: 'string',
            title: 'Choose where you’d like to get your vaccine.',
            enum: clinics.map(clinic => clinic.id),
            enumNames: clinics.map(clinic => clinic.serviceName),
          },
        },
      };

      const { data, schema } = setupFormData(
        state.newBooking.data,
        newSchema,
        action.uiSchema,
      );

      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          data: {
            ...data,
            selectedDates: [],
          },
          pages: {
            ...state.newBooking.pages,
            [action.page]: schema,
          },
        },
      };
    }
    case FORM_PREFILL_CONTACT_INFO: {
      const { data } = state.newBooking;
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          data: {
            ...data,
            phoneNumber: data.phoneNumber || action.phoneNumber,
            email: data.email || action.email,
          },
        },
      };
    }
    case FORM_SUBMIT:
      return {
        ...state,
        submitStatus: FETCH_STATUS.loading,
      };
    case VACCINE_FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.succeeded,
        submitStatusVaos400: false,
      };
    case STARTED_NEW_VACCINE_FLOW: {
      return {
        ...initialState,
      };
    }
    case FORM_SUBMIT_FAILED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.failed,
        submitStatusVaos400: action.isVaos400Error,
      };
    case FORM_CALENDAR_FETCH_SLOTS: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          appointmentSlotsStatus: FETCH_STATUS.loading,
        },
      };
    }
    case FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          appointmentSlotsStatus: FETCH_STATUS.succeeded,
          availableSlots: action.availableSlots,
          fetchedAppointmentSlotMonths: action.fetchedAppointmentSlotMonths,
        },
      };
    }
    case FORM_CALENDAR_FETCH_SLOTS_FAILED: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          appointmentSlotsStatus: FETCH_STATUS.failed,
        },
      };
    }
    case FORM_CALENDAR_DATA_CHANGED: {
      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          data: {
            ...state.newBooking.data,
            date1: action.selectedDates,
          },
        },
      };
    }
    case FORM_PAGE_CONTACT_FACILITIES_OPEN_SUCCEEDED: {
      let { facilities } = action;
      const { address } = action;
      const hasResidentialCoordinates =
        !!action.address?.latitude && !!action.address?.longitude;
      const sortMethod = hasResidentialCoordinates
        ? FACILITY_SORT_METHODS.distanceFromResidential
        : FACILITY_SORT_METHODS.alphabetical;

      if (hasResidentialCoordinates && facilities.length) {
        facilities = facilities
          .map(facility => {
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
          })
          .sort((a, b) => a.legacyVAR[sortMethod] - b.legacyVAR[sortMethod]);
      }

      return {
        ...state,
        newBooking: {
          ...state.newBooking,
          facilities,
          facilitiesStatus: FETCH_STATUS.succeeded,
          facilityPageSortMethod: sortMethod,
        },
      };
    }

    default:
      return state;
  }
}
