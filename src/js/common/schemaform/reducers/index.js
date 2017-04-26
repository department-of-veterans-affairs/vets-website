import _ from 'lodash/fp';
import { getDefaultFormState } from 'react-jsonschema-form/lib/utils';

import {
  createFormPageList,
} from '../helpers';

import {
  updateSchemaData,
  replaceRefSchemas,
  updateItemsSchema
} from '../formState';

import { SET_DATA,
  SET_EDIT_MODE,
  SET_PRIVACY_AGREEMENT,
  SET_SUBMISSION,
  SET_SUBMITTED
} from '../actions';

function recalculateSchemaAndData(initialState) {
  return Object.keys(_.omit(['privacyAgreementAccepted', 'submission'], initialState))
    .reduce((state, pageKey) => {
      // on each data change, we need to do the following steps

      // Flatten the data from all the pages
      const formData = Object.keys(state).reduce((carry, pageName) => {
        if (state[pageName].data) {
          Object.keys(state[pageName].data).forEach((fieldKey) => {
            carry[fieldKey] = state[pageName].data[fieldKey]; // eslint-disable-line
          });
        }
        return carry;
      }, {});

      // Recalculate any required fields, based on the new data
      const page = state[pageKey];

      const { data, schema } = updateSchemaData(page.schema, page.uiSchema, formData, page.data, state);

      if (page.data !== data || page.schema !== schema) {
        const newPage = _.assign(page, {
          data,
          schema
        });

        return _.set(pageKey, newPage, state);
      }

      return state;
    }, initialState);
}

export default function createSchemaFormReducer(formConfig) {
  // Create the basic form state, which has all the pages of the form and the default data
  // and schemas
  const firstPassInitialState = createFormPageList(formConfig)
    .reduce((state, page) => {
      const definitions = _.assign(formConfig.defaultDefinitions || {}, page.schema.definitions);
      let schema = replaceRefSchemas(page.schema, definitions, page.pageKey);
      schema = updateItemsSchema(schema);
      const data = getDefaultFormState(schema, page.initialData, schema.definitions);

      return _.set(page.pageKey, {
        data,
        uiSchema: page.uiSchema,
        schema,
        editMode: false
      }, state);
    }, {
      privacyAgreementAccepted: false,
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false
      }
    });

  // Take another pass and recalculate the schema and data based on the default data
  // We do this to avoid passing undefined for the whole form state when the form first renders
  const initialState = recalculateSchemaAndData(firstPassInitialState);

  return (state = initialState, action) => {
    switch (action.type) {
      case SET_DATA: {
        const newState = _.set([action.page, 'data'], action.data, state);

        return recalculateSchemaAndData(newState);
      }
      case SET_EDIT_MODE: {
        return _.set([action.page, 'editMode'], action.edit, state);
      }
      case SET_PRIVACY_AGREEMENT: {
        return _.set('privacyAgreementAccepted', action.privacyAgreementAccepted, state);
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
      default:
        return state;
    }
  };
}
