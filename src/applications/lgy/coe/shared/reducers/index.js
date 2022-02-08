import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';
import formConfig from '../../form/config/form';

import { CALLSTATUS } from '../constants';

import {
  GENERATE_AUTOMATIC_COE_STARTED,
  GENERATE_AUTOMATIC_COE_FAILED,
  GENERATE_AUTOMATIC_COE_SUCCEEDED,
  SKIP_AUTOMATIC_COE_CHECK,
  GET_COE_URL_FAILED,
  GET_COE_URL_SUCCEEDED,
} from '../actions/index';

const initialState = {
  generateAutoCoeStatus: CALLSTATUS.idle,
  coe: null,
  downloadUrl: null,
  errors: {
    coe: null,
    downloadUrl: null,
  },
  profileIsUpdating: true,
  isLoading: true,
};

const certificateOfEligibility = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOGGEDIN_STATUS:
      return { ...state, profileIsUpdating: false };
    case SKIP_AUTOMATIC_COE_CHECK:
      return {
        ...state,
        generateAutoCoeStatus: CALLSTATUS.skip,
        isLoading: false,
      };
    case GENERATE_AUTOMATIC_COE_STARTED:
      return { ...state, generateAutoCoeStatus: CALLSTATUS.pending };
    case GENERATE_AUTOMATIC_COE_FAILED:
      return {
        ...state,
        generateAutoCoeStatus: CALLSTATUS.failed,
        errors: { ...state.errors, coe: action.response.errors },
        isLoading: false,
      };
    case GENERATE_AUTOMATIC_COE_SUCCEEDED:
      return {
        ...state,
        generateAutoCoeStatus: CALLSTATUS.success,
        coe: action.response,
        isLoading: false,
      };
    case GET_COE_URL_FAILED:
      return {
        ...state,
        errors: { ...state.errors, downloadUrl: action.response.errors },
        isLoading: false,
      };
    case GET_COE_URL_SUCCEEDED:
      return { ...state, isLoading: false, downloadUrl: action.response.url };
    default:
      return state;
  }
};

export default {
  certificateOfEligibility,
  form: createSaveInProgressFormReducer(formConfig),
};
