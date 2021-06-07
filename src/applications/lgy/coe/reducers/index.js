import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import {
  GENERATE_AUTOMATIC_COE_STARTED,
  GENERATE_AUTOMATIC_COE_FAILED,
  GENERATE_AUTOMATIC_COE_SUCCEEDED,
} from '../actions/index';

const initialState = {
  generateAutoCoeStatus: 'idle',
  coe: null,
};

const certificateOfEligibility = (state = initialState, action) => {
  switch (action.type) {
    case GENERATE_AUTOMATIC_COE_STARTED:
      return { ...state, generateAutoCoeStatus: 'pending' };
    case GENERATE_AUTOMATIC_COE_FAILED:
      return {
        ...state,
        generateAutoCoeStatus: 'failed',
        errors: action.reponse.errors,
      };
    case GENERATE_AUTOMATIC_COE_SUCCEEDED:
      return {
        ...state,
        generateAutoCoeStatus: 'complete',
        coe: action.response,
      };
    default:
      return state;
  }
};

export default {
  certificateOfEligibility,
  form: createSaveInProgressFormReducer(formConfig),
};
