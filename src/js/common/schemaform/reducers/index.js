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
  SET_SUBMITTED
} from '../actions';

import {
  SET_SAVE_FORM_STATUS,
  SET_AUTO_SAVE_FORM_STATUS,
  SET_FETCH_FORM_STATUS,
  SET_FETCH_FORM_PENDING,
  SET_IN_PROGRESS_FORM,
  SET_START_OVER,
  SET_PREFILL_UNFILLED,
  SAVE_STATUSES,
  LOAD_STATUSES,
  PREFILL_STATUSES,
  saveErrors
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
        // we have to reset everything because we can’t match the edit states to rows directly
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
        arrayPath: page.arrayPath,
        itemFilter: page.itemFilter
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
      autoSavedStatus: SAVE_STATUSES.notAttempted,
      loadedStatus: LOAD_STATUSES.notAttempted,
      version: formConfig.version,
      formId: formConfig.formId,
      lastSavedDate: null,
      expirationDate: null,
      disableSave: formConfig.disableSave,
      loadedData: {
        formData: {},
        metadata: {}
      },
      prefillStatus: PREFILL_STATUSES.notAttempted,
      isStartingOver: false,
      migrations: formConfig.migrations,
      trackingPrefix: formConfig.trackingPrefix
    });

  // Take another pass and recalculate the schema and data based on the default data
  // We do this to avoid passing undefined for the whole form state when the form first renders
  const initialState = recalculateSchemaAndData(firstPassInitialState);
  initialState.initialData = initialState.data;

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
        const newState = _.set('savedStatus', action.status, state);
        newState.startingOver = false;
        newState.prefillStatus = PREFILL_STATUSES.notAttempted;

        if (action.status === SAVE_STATUSES.success) {
          newState.lastSavedDate = action.lastSavedDate;
          newState.expirationDate = action.expirationDate;
        }

        // We don't want to show two errors at once, so reset the status
        // of the other save method when there's an error
        if (saveErrors.has(action.status)) {
          newState.autoSavedStatus = SAVE_STATUSES.notAttempted;
        }

        return newState;
      }
      case SET_AUTO_SAVE_FORM_STATUS: {
        const newState = _.set('autoSavedStatus', action.status, state);

        if (action.status === SAVE_STATUSES.success) {
          newState.lastSavedDate = action.lastSavedDate;
          newState.expirationDate = action.expirationDate;
        }

        if (saveErrors.has(action.status)) {
          newState.savedStatus = SAVE_STATUSES.notAttempted;
        }

        return newState;
      }
      case SET_FETCH_FORM_STATUS: {
        return _.set('loadedStatus', action.status, state);
      }
      case SET_FETCH_FORM_PENDING: {
        const newState = _.set('loadedStatus', LOAD_STATUSES.pending, state);

        if (action.prefill) {
          newState.prefillStatus = PREFILL_STATUSES.pending;
        }

        return newState;
      }
      case SET_IN_PROGRESS_FORM: {
        let newState;

        // if we’re prefilling, we want to use whatever initial data the form has
        if (state.prefillStatus === PREFILL_STATUSES.pending) {
          const formData = _.merge(state.data, action.data.formData);
          const loadedData = _.set('formData', formData, action.data);
          newState = _.set('loadedData', loadedData, state);

          // We get an empty object back when we attempt to prefill and there's
          // no information
          if (Object.keys(action.data.formData).length > 0) {
            newState.prefillStatus = PREFILL_STATUSES.success;
          } else {
            newState.prefillStatus = PREFILL_STATUSES.unfilled;
          }
        } else {
          newState = _.set('loadedData', action.data, state);
          newState.prefillStatus = PREFILL_STATUSES.notAttempted;
        }

        newState.loadedStatus = LOAD_STATUSES.success;
        newState.data = newState.loadedData.formData;

        return recalculateSchemaAndData(newState);
      }
      case SET_START_OVER: {
        return _.assign(state, {
          isStartingOver: true,
          data: state.initialData,
          loadedStatus: LOAD_STATUSES.pending
        });
      }
      case SET_PREFILL_UNFILLED: {
        return _.assign(state, {
          prefillStatus: PREFILL_STATUSES.unfilled,
          data: state.initialData,
          loadedStatus: LOAD_STATUSES.notAttempted
        });
      }
      default:
        return state;
    }
  };
}
