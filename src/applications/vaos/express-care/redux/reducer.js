import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';
import set from 'platform/utilities/data/set';

import {
  FORM_ADDITIONAL_DETAILS_PAGE_OPENED,
  FORM_DATA_UPDATED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_OPENED,
  FORM_FETCH_REQUEST_LIMITS,
  FORM_FETCH_REQUEST_LIMITS_FAILED,
  FORM_FETCH_REQUEST_LIMITS_SUCCEEDED,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT_SUCCEEDED,
  FORM_SUBMIT,
} from './actions';

import { STARTED_NEW_EXPRESS_CARE_FLOW } from '../../redux/sitewide';

import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  newRequest: {
    data: {},
    pages: {},
    pageChangeInProgress: false,
    previousPages: {},
    facilityId: null,
    siteId: null,
    isUnderRequestLimit: null,
    fetchRequestLimitsStatus: FETCH_STATUS.notStarted,
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
    case STARTED_NEW_EXPRESS_CARE_FLOW: {
      return {
        ...initialState,
      };
    }
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
    case FORM_PAGE_CHANGE_STARTED: {
      let updatedPreviousPages = state.newRequest.previousPages;
      if (!Object.keys(updatedPreviousPages).length) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKey]: 'home',
        };
      }
      return {
        ...state,
        newRequest: {
          ...state.newRequest,
          pageChangeInProgress: true,
          previousPages: updatedPreviousPages,
        },
      };
    }
    case FORM_PAGE_CHANGE_COMPLETED: {
      let updatedPreviousPages = state.newRequest.previousPages;
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
        newRequest: {
          ...state.newRequest,
          pageChangeInProgress: false,
          previousPages: updatedPreviousPages,
        },
      };
    }
    case FORM_FETCH_REQUEST_LIMITS: {
      return {
        ...state,
        newRequest: {
          ...state.newRequest,
          fetchRequestLimitsStatus: FETCH_STATUS.loading,
        },
      };
    }
    case FORM_FETCH_REQUEST_LIMITS_SUCCEEDED: {
      const { facilityId, siteId, isUnderRequestLimit } = action;
      return {
        ...state,
        newRequest: {
          ...state.newRequest,
          facilityId,
          siteId,
          isUnderRequestLimit,
          fetchRequestLimitsStatus: FETCH_STATUS.succeeded,
        },
      };
    }
    case FORM_FETCH_REQUEST_LIMITS_FAILED: {
      return {
        ...state,
        newRequest: {
          ...state.newRequest,
          fetchRequestLimitsStatus: FETCH_STATUS.failed,
        },
      };
    }
    case FORM_ADDITIONAL_DETAILS_PAGE_OPENED: {
      const newRequest = { ...state.newRequest };
      const prefilledData = {
        ...newRequest.data,
        contactInfo: {
          phoneNumber: newRequest.data.phoneNumber || action.phoneNumber,
          email: newRequest.data.email || action.email,
        },
      };

      const newSchema = set(
        'properties.additionalInformation.title.props.children',
        `Tell us about your ${newRequest.data.reason.toLowerCase()}`,
        action.schema,
      );

      const { data, schema } = setupFormData(
        prefilledData,
        newSchema,
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
        newRequest: {
          ...state.newRequest,
          data: {},
        },
        submitStatus: FETCH_STATUS.succeeded,
        successfulRequest: action.responseData,
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
