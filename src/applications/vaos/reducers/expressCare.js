import moment from '../utils/moment-tz';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import {
  FORM_PAGE_OPENED,
  FORM_DATA_UPDATED,
  FORM_SUBMIT,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
  FORM_REASON_FOR_REQUEST_PAGE_OPENED,
} from '../actions/expressCare';

import { FETCH_STATUS, EXPRESS_CARE } from '../utils/constants';

const initialState = {
  windowsStatus: FETCH_STATUS.notStarted,
  supportedFacilities: null,
  newRequest: {
    data: {},
  },
  submitStatus: FETCH_STATUS.notStarted,
  submitErrorReason: null,
  successfulRequest: null,
};

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemaAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

export default function expressCareReducer(state = initialState, action) {
  switch (action.type) {
    case FORM_PAGE_OPENED: {
      const newRequest = state.newRequest;
      const { data, schema } = setupFormData(
        newRequest.data,
        action.schema,
        action.uiSchema,
      );

      return {
        ...state,
        newRequest: {
          ...newRequest,
          data,
          pages: {
            ...newRequest.pages,
            [action.page]: schema,
          },
        },
      };
    }
    case FORM_DATA_UPDATED: {
      const newRequest = state.newRequest;
      const { data, schema } = updateSchemaAndData(
        newRequest.pages[action.page],
        action.uiSchema,
        action.data,
      );

      return {
        ...state,
        newRequest: {
          ...newRequest,
          data,
          pages: {
            ...newRequest.pages,
            [action.page]: schema,
          },
        },
      };
    }
    case FETCH_EXPRESS_CARE_WINDOWS:
      return {
        ...state,
        windowsStatus: FETCH_STATUS.loading,
      };
    case FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED: {
      const { settings } = action;
      // We're only parsing out facilities in here, since the rest
      // of the logic is very dependent on the current time and we may want
      // to re-check if EC is available without re-fecthing
      const supportedFacilities = settings
        // This grabs just the facilities where EC is supported
        .filter(
          facility =>
            facility.customRequestSettings?.find(
              setting => setting.id === EXPRESS_CARE,
            )?.supported,
        )
        // This makes sure we only pull the days where EC is open
        .map(facility => ({
          facilityId: facility.id,
          days: facility.customRequestSettings
            .find(setting => setting.id === EXPRESS_CARE)
            .schedulingDays.filter(day => day.canSchedule),
        }));

      return {
        ...state,
        windowsStatus: FETCH_STATUS.succeeded,
        supportedFacilities,
      };
    }
    case FETCH_EXPRESS_CARE_WINDOWS_FAILED:
      return {
        ...state,
        windowsStatus: FETCH_STATUS.failed,
      };
    case FORM_REASON_FOR_REQUEST_PAGE_OPENED: {
      const newRequest = { ...state.newRequest };
      const prefilledData = {
        ...newRequest.data,
        contactInfo: {
          phoneNumber: newRequest.data.phoneNumber || action.phoneNumber,
          email: newRequest.data.email || action.email,
        },
      };

      const { data, schema } = setupFormData(
        prefilledData,
        action.schema,
        action.uiSchema,
      );

      return {
        ...state,
        newRequest: {
          ...newRequest,
          data,
          pages: {
            ...newRequest.pages,
            [action.page]: schema,
          },
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
        successfulRequest: action.responseData,
        newRequest: {
          data: {},
        },
      };
    case FORM_SUBMIT_FAILED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.failed,
        submitErrorReason: action.errorReason,
      };
    default:
      return state;
  }
}
