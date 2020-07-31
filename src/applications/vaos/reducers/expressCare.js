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
      const { data, schema } = updateSchemaAndData(
        state.pages[action.page],
        action.uiSchema,
        action.data,
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
    case FETCH_EXPRESS_CARE_WINDOWS:
      return {
        ...state,
        windowsStatus: FETCH_STATUS.loading,
      };
    case FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED: {
      const { settings } = action;
      const supportedFacilities = settings
        .filter(
          facility =>
            facility.customRequestSettings?.find(
              setting => setting.id === EXPRESS_CARE,
            )?.supported,
        )
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
        newRequest: {},
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
