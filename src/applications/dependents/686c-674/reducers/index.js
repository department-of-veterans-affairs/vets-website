import set from 'platform/utilities/data/set';

import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import {
  VERIFY_VA_FILE_NUMBER_SUCCEEDED,
  VERIFY_VA_FILE_NUMBER_STARTED,
  VERIFY_VA_FILE_NUMBER_FAILED,
} from '../actions';

import dependents from '../../shared/reducers/dependents';

const initialState = {
  hasVaFileNumber: null,
  isLoading: true,
};

/**
 * Redux reducer for VA file number verification
 * @param {object} state - Redux state
 * @param {object} action - Redux action
 * @returns {object} New state
 */
const vaFileNumber = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_VA_FILE_NUMBER_STARTED:
      return set('isLoading', action.response, state);
    case VERIFY_VA_FILE_NUMBER_SUCCEEDED:
    case VERIFY_VA_FILE_NUMBER_FAILED:
      return {
        ...set('hasVaFileNumber', action.response, state),
        isLoading: false,
      };
    default:
      return state;
  }
};

export default {
  vaFileNumber,
  dependents,
  form: createSaveInProgressFormReducer(formConfig),
};
