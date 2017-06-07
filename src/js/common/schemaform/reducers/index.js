import _ from 'lodash/fp';
import { getDefaultFormState } from 'react-jsonschema-form/lib/utils';

import {
  createFormPageList,
  checkValidSchema
} from '../helpers';

import {
  updateSchemaAndData,
  replaceRefSchemas,
  updateItemsSchema
} from '../formState';

import { SET_DATA,
  SET_EDIT_MODE,
  SET_PRIVACY_AGREEMENT,
  SET_SUBMISSION,
  SET_SUBMITTED,
} from '../actions';

import {
  SET_SAVE_FORM_STATUS,
  SET_FETCH_FORM_STATUS,
  SET_IN_PROGRESS_FORM,
  LOAD_DATA_INTO_FORM,
  SAVE_STATUSES,
  LOAD_STATUSES
} from '../save-load-actions';

function recalculateSchemaAndData(initialState) {
  return Object.keys(initialState.pages)
    .reduce((state, pageKey) => {
      // on each data change, we need to do the following steps
      // Recalculate any required fields, based on the new data
      const page = state.pages[pageKey];
      const formData = initialState.data;

      const { data, schema } = updateSchemaAndData(page.schema, page.uiSchema, formData);

      let newState = state;

      if (formData !== data) {
        newState = _.set('data', data, state);
      }

      if (page.schema !== schema) {
        newState = _.set(['pages', pageKey, 'schema'], schema, newState);
      }

      if (page.showPagePerItem) {
        const arrayData = _.get(page.arrayPath, newState.data) || [];
        // If an item was added or removed for the data used by a showPagePerItem page,
        // we have to reset everything because we can't match the edit states to rows directly
        // This will rarely ever be noticeable
        if (page.editMode.length !== arrayData.length) {
          newState = _.set(['pages', pageKey, 'editMode'], arrayData.map(() => false), newState);
        }
      }

      return newState;
    }, initialState);
}

export default function createSchemaFormReducer(formConfig) {
  // Create the basic form state, which has all the pages of the form and the default data
  // and schemas
  const firstPassInitialState = createFormPageList(formConfig)
    .reduce((state, page) => {
      const definitions = _.assign(formConfig.defaultDefinitions || {}, page.schema.definitions);
      let schema = replaceRefSchemas(page.schema, definitions, page.pageKey);
      // Throw an error if the new schema is invalid
      checkValidSchema(schema);
      schema = updateItemsSchema(schema);
      const isArrayPage = page.showPagePerItem;
      const data = getDefaultFormState(schema, page.initialData, schema.definitions);

      /* eslint-disable no-param-reassign */
      state.pages[page.pageKey] = {
        uiSchema: page.uiSchema,
        schema,
        editMode: isArrayPage ? [] : false,
        showPagePerItem: page.showPagePerItem,
        arrayPath: page.arrayPath
      };

      state.data = _.merge(state.data, data);
      /* eslint-enable no-param-reassign */

      return state;
    }, {
      data: {
        privacyAgreementAccepted: false,
      },
      pages: {},
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false
      },
      savedStatus: SAVE_STATUSES.notAttempted,
      loadedStatus: LOAD_STATUSES.notAttempted,
      version: formConfig.version,
      formId: formConfig.formId,
      disableSave: formConfig.disableSave,
      // loadedData: undefined
      migrations: formConfig.migrations
    });

  // Take another pass and recalculate the schema and data based on the default data
  // We do this to avoid passing undefined for the whole form state when the form first renders
  const initialState = recalculateSchemaAndData(firstPassInitialState);

  return (state = initialState, action) => {
    switch (action.type) {
      case SET_DATA: {
        const newState = _.set('data', action.data, state);

        return recalculateSchemaAndData(newState);
      }
      case SET_EDIT_MODE: {
        if (state.pages[action.page].showPagePerItem) {
          return _.set(['pages', action.page, 'editMode', action.index], action.edit, state);
        }
        return _.set(['pages', action.page, 'editMode'], action.edit, state);
      }
      case SET_PRIVACY_AGREEMENT: {
        return _.set('data.privacyAgreementAccepted', action.privacyAgreementAccepted, state);
      }
      case SET_SUBMISSION: {
        return _.set(['submission', action.field], action.value, state);
      }
      case SET_SUBMITTED: {
        const submission = _.assign(state.submission, {
          response: action.response,
          status: 'applicationSubmitted'
        });

        return _.set('submission', submission, state);
      }
      case SET_SAVE_FORM_STATUS: {
        return _.set('savedStatus', action.status, state);
      }
      case SET_FETCH_FORM_STATUS: {
        const newState = _.set('loadedStatus', action.status, state);
        newState.loadedStatus = LOAD_STATUSES.success;

        return newState;
      }
      case SET_IN_PROGRESS_FORM: {
        return _.set('loadedData', action.data, state);
      }
      case LOAD_DATA_INTO_FORM: {
        // Mirrors SET_DATA, but uses state.loadedData
        const newState = _.set('data', state.loadedData.formData, state);

        return recalculateSchemaAndData(newState);
      }
      default:
        return state;
    }
  };
}
