import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';
import vapContactInfoReducer from 'platform/user/profile/vap-svc/reducers';
import formConfig from '../../form/config/form';

import { CALLSTATUS } from '../constants';

import {
  GENERATE_AUTOMATIC_COE_STARTED,
  GENERATE_AUTOMATIC_COE_FAILED,
  GENERATE_AUTOMATIC_COE_SUCCEEDED,
  SKIP_AUTOMATIC_COE_CHECK,
} from '../actions';

export const initialState = {
  generateAutoCoeStatus: CALLSTATUS.idle,
  coe: null,
  errors: {
    coe: null,
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
    default:
      return state;
  }
};

export default {
  certificateOfEligibility,
  form: createSaveInProgressFormReducer(formConfig),
  vapService: vapContactInfoReducer,
};
