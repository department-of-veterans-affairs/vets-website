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
  systems: null,
  pageChangeInProgress: false,
  loadingSystems: false,
};

function getFacilities(state, typeOfCareId, vaSystem) {
  return state.facilities[`${typeOfCareId}_${vaSystem}`] || [];
}

function getAvailableFacilities(facilities) {
  return facilities.filter(
    facility => facility.requestSupported || facility.directSchedulingSupported,
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

function updateFacilitiesSchemaAndData(systems, facilities, schema, data) {
  let newSchema = schema;
  let newData = data;

  const availableFacilities = getAvailableFacilities(facilities);

  if (
    availableFacilities.length > 1 ||
    (availableFacilities.length === 1 && systems.length > 1)
  ) {
    newSchema = unset('properties.vaFacilityMessage', newSchema);
    newSchema = set(
      'properties.vaFacility',
      {
        type: 'string',
        enum: availableFacilities.map(
          facility => facility.institution.institutionCode,
        ),
        enumNames: availableFacilities.map(
          facility =>
            `${facility.institution.authoritativeName} (${
              facility.institution.city
            }, ${facility.institution.stateAbbrev})`,
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
      vaFacility: availableFacilities[0]?.institution.institutionCode,
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
        action.facilities ||
        getFacilities(state, action.typeOfCareId, newData.vaSystem);

      const facilityUpdate = updateFacilitiesSchemaAndData(
        state.systems,
        facilities,
        newSchema,
        newData,
      );

      const { data, schema } = setupFormData(
        facilityUpdate.data,
        facilityUpdate.schema,
        action.uiSchema,
      );

      return {
        ...state,
        systems,
        data,
        loadingSystems: false,
        facilities: {
          ...state.facilities,
          [`${newData.typeOfCareId}_${newData.vaSystem}`]: facilities,
        },
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
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
      return newState;
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
          [`${newData.typeOfCareId}_${newData.vaSystem}`]: action.facilities,
        },
        pages: {
          ...state.pages,
          vaFacility: schema,
        },
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
    default:
      return state;
  }
}
