import _ from 'lodash/fp';
import { getDefaultFormState } from 'react-jsonschema-form/lib/utils';

import {
  setHiddenFields,
  removeHiddenData,
  updateRequiredFields,
  createFormPageList,
  updateSchemaFromUiSchema
} from '../helpers';

import { SET_DATA,
  SET_EDIT_MODE,
  SET_PRIVACY_AGREEMENT,
  SET_SUBMISSION,
  SET_SUBMITTED
} from '../actions';

export default function createSchemaFormReducer(formConfig) {
  // Create the basic form state, which has all the pages of the form and the default data
  // and schemas
  const firstPassInitialState = createFormPageList(formConfig)
    .reduce((state, page) => {
      const schema = _.assign({ definitions: formConfig.defaultDefinitions }, page.schema);
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
  const initialState = Object.keys(_.omit(['privacyAgreementAccepted', 'submission'], firstPassInitialState))
    .reduce((state, pageKey) => {
      const page = firstPassInitialState[pageKey];
      let schema = updateRequiredFields(page.schema, page.uiSchema, page.data, state);
      schema = setHiddenFields(schema, page.uiSchema, page.data, state);
      schema = updateSchemaFromUiSchema(schema, page.uiSchema, page.data, state);

      const data = removeHiddenData(schema, page.data);

      const newPage = _.assign(page, {
        data,
        schema,
      });

      return _.set(pageKey, newPage, state);
    }, firstPassInitialState);

  return (state = initialState, action) => {
    switch (action.type) {
      case SET_DATA: {
        debugger;
        let schema = updateRequiredFields(state[action.page].schema, state[action.page].uiSchema, action.data, state);
        schema = setHiddenFields(schema, state[action.page].uiSchema, action.data, state);
        schema = updateSchemaFromUiSchema(schema, state[action.page].uiSchema, action.data, state);

        const newPage = _.assign(state[action.page], {
          data: removeHiddenData(schema, action.data),
          schema
        });

        return _.set(action.page, newPage, state);
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
