import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import {
  FORM_DATA_UPDATED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_OPENED,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT,
} from './actions';

import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  newBooking: {
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

export default function projectCheetahReducer(state = initialState, action) {
  switch (action.type) {
    case FORM_PAGE_OPENED: {
      const newBooking = state.newBooking;
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
      const newBooking = state.newBooking;
      const { data, schema } = updateSchemaAndData(
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
    case FORM_SUBMIT:
      return {
        ...state,
        submitStatus: FETCH_STATUS.loading,
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
