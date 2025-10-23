import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from './config/form';
import {
  FETCH_CLAIMANT_INFO,
  FETCH_CLAIMANT_INFO_FAILURE,
  FETCH_CLAIMANT_INFO_SUCCESS,
} from './constants';

const initialDataState = {
  claimantInfo: null,
  claimantInfoError: null,
  claimantInfoLoading: false,
};

const dataReducer = (state = initialDataState, action) => {
  switch (action.type) {
    case FETCH_CLAIMANT_INFO:
      return {
        ...state,
        claimantInfoLoading: true,
        claimantInfoError: null,
      };
    case FETCH_CLAIMANT_INFO_SUCCESS:
      return {
        ...state,
        claimantInfoLoading: false,
        claimantInfo: action.payload,
      };
    case FETCH_CLAIMANT_INFO_FAILURE:
      return {
        ...state,
        claimantInfoLoading: false,
        claimantInfoError: action.error,
      };
    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  data: dataReducer,
};
