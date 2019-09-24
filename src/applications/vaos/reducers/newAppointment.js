import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import set from 'platform/utilities/data/set';
import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import {
  FORM_DATA_UPDATED,
  FORM_PAGE_OPENED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_FACILITY_OPEN,
  FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES,
  FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
} from '../actions/newAppointment';

const initialState = {
  pages: {},
  data: {},
  pageChangeInProgress: false,
  loadingSystems: false,
  loadingFacilities: false,
};

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemaAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

export default function formReducer(state = initialState, action) {
  switch (action.type) {
    case FORM_PAGE_OPENED: {
      const { data, schema } = setupFormData(
        action.data,
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
    case FORM_PAGE_FACILITY_OPEN: {
      return {
        ...state,
        loadingSystems: true,
      };
    }
    case FORM_PAGE_FACILITY_OPEN_SUCCEEDED: {
      let newSchema = set(
        'properties.vaSystem.enum',
        action.systems.map(sys => sys.institutionCode),
        action.schema,
      );
      newSchema = set(
        'properties.vaSystem.enumNames',
        action.systems.map(sys => sys.authoritativeName),
        newSchema,
      );

      const { data, schema } = setupFormData(
        action.data,
        newSchema,
        action.uiSchema,
      );

      return {
        ...state,
        data,
        loadingSystems: false,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_FETCH_CHILD_FACILITIES: {
      return {
        ...state,
        loadingFacilities: true,
      };
    }
    case FORM_FETCH_CHILD_FACILITIES_SUCCEEDED: {
      const validFacilities = action.facilities.filter(
        facility =>
          facility.requestSupported || facility.directSchedulingSupported,
      );

      let newSchema = set(
        'properties.vaFacility.enum',
        validFacilities.map(facility => facility.institution.institutionCode),
        state.pages.vaFacility,
      );
      newSchema = set(
        'properties.vaFacility.enumNames',
        validFacilities.map(facility => facility.institution.authoritativeName),
        newSchema,
      );

      const { data, schema } = updateSchemaAndData(
        newSchema,
        action.uiSchema,
        state.data,
      );

      return {
        ...state,
        data,
        loadingFacilities: false,
        pages: {
          ...state.pages,
          vaFacility: schema,
        },
      };
    }
    default:
      return state;
  }
}
