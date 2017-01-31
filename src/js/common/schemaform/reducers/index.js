import _ from 'lodash/fp';
import { getDefaultFormState } from 'react-jsonschema-form/lib/utils';

import { updateRequiredFields, createFormPageList } from '../helpers';

import { SET_DATA,
  SET_EDIT_MODE,
  SET_PRIVACY_AGREEMENT,
  SET_SUBMISSION,
  SET_SUBMITTED
} from '../actions';

export default function createSchemaFormReducer(formConfig) {
  const initialState = createFormPageList(formConfig)
    .reduce((state, page) => {
      const schemaWithDefinitions = _.assign({ definitions: formConfig.defaultDefinitions }, page.schema);
      return _.set(page.pageKey, {
        data: getDefaultFormState(schemaWithDefinitions, page.initialData, schemaWithDefinitions.definitions),
        uiSchema: page.uiSchema,
        schema: updateRequiredFields(schemaWithDefinitions, page.uiSchema, page.initialData),
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

  return (state = initialState, action) => {
    switch (action.type) {
      case SET_DATA: {
        const newPage = _.assign(state[action.page], {
          data: action.data,
          schema: updateRequiredFields(state[action.page].schema, state[action.page].uiSchema, action.data)
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
