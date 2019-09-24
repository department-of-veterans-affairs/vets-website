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
  FORM_FETCH_CHILD_FACILITIES,
  FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
  FORM_VA_SYSTEM_CHANGED,
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

      if (facilities.length) {
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
            state.pages.vaFacility,
          );
        } else {
          newData = {
            ...newData,
            vaFacility: availableFacilities[0]?.institutionCode,
          };
        }
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
    case FORM_FETCH_CHILD_FACILITIES: {
      return {
        ...state,
        loadingFacilities: true,
      };
    }
    case FORM_FETCH_CHILD_FACILITIES_SUCCEEDED: {
      // Holding all the facilities, across systems, in state so that we
      // don't have to fetch more than once per system
      let facilities = getFacilities(state, action.typeOfCareId);
      if (action.facilities) {
        facilities = facilities.concat(action.facilities);
      }

      const availableFacilities = getAvailableFacilities(
        facilities,
        state.data.vaSystem,
      );

      const schemaWithUpdatedFacilities = set(
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
        state.pages.vaFacility,
      );

      const { data, schema } = updateSchemaAndData(
        schemaWithUpdatedFacilities,
        action.uiSchema,
        state.data,
      );

      return {
        ...state,
        data,
        loadingFacilities: false,
        facilities: {
          ...state.facilities,
          [action.typeOfCareId]: facilities,
        },
        pages: {
          ...state.pages,
          vaFacility: schema,
        },
      };
    }
    case FORM_VA_SYSTEM_CHANGED: {
      const availableFacilities = getAvailableFacilities(
        getFacilities(state, action.typeOfCareId),
        state.data.vaSystem,
      );
      const schemaWithUpdatedFacilities = set(
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
        state.pages.vaFacility,
      );

      const { data, schema } = updateSchemaAndData(
        schemaWithUpdatedFacilities,
        action.uiSchema,
        state.data,
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
    default:
      return state;
  }
}
