import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';

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
} from '../actions/newAppointment';

const initialState = {
  pages: {},
  data: {
    typeOfCareId: '323',
  },
  facilities: {},
  pageChangeInProgress: false,
  loadingSystems: false,
  loadingFacilities: false,
};

function getFacilities(state, typeOfCareId) {
  return state.facilities[typeOfCareId] || [];
}

function getAvailableFacilities(facilities, vaSystem) {
  return facilities.filter(
    facility =>
      facility.institution.parentStationCode === vaSystem &&
      (facility.requestSupported || facility.directSchedulingSupported),
  );
}

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
        action.facilities || getFacilities(state, action.typeOfCareId);

      const availableFacilities = getAvailableFacilities(
        facilities,
        newData.vaSystem,
      );

      if (availableFacilities.length > 1) {
        newSchema = set(
          'properties.vaFacility',
          {
            type: 'string',
            enum: availableFacilities.map(
              facility => facility.institution.institutionCode,
            ),
            enumNames: availableFacilities.map(
              facility => facility.institution.authoritativeName,
            ),
          },
          newSchema,
        );
      } else if (newData.vaSystem) {
        newSchema = unset('properties.vaFacility', newSchema);
        newData = {
          ...newData,
          vaFacility: availableFacilities[0]?.institution.institutionCode,
        };
      }

      const { data, schema } = setupFormData(
        newData,
        newSchema,
        action.uiSchema,
      );

      return {
        ...state,
        systems,
        data,
        loadingSystems: false,
        facilities: {
          ...state.facilities,
          [action.typeOfCareId]: facilities,
        },
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    default:
      return state;
  }
}
