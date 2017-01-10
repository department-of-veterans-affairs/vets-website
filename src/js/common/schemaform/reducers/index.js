import { createFormPageList } from '../helpers';
import _ from 'lodash/fp';

import { SET_DATA,
  SET_VALID,
  SET_EDIT_MODE,
  SET_PRIVACY_AGREEMENT,
  SET_SUBMISSION,
  SET_SUBMITTED
} from '../actions';

export default function createSchemaFormReducer(formConfig) {
  const initialState = createFormPageList(formConfig)
    .reduce((state, page) => {
      return _.set(page.pageKey, {
        isValid: false,
        data: page.initialData,
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
        const newState = _.set([action.page, 'data'], action.data, state);
        return _.set([action.page, 'isValid'], false, newState);
      }
      case SET_VALID: {
        return _.set([action.page, 'isValid'], action.valid, state);
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
        return _.assign(state, {
          response: action.response,
          status: 'applicationSubmitted'
        });
      }
      default:
        return state;
    }
  };
}
