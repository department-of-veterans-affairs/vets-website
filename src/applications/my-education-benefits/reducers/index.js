import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

import {
  FETCH_PERSONAL_INFORMATION,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  FETCH_CLAIM_STATUS_SUCCESS,
  FETCH_CLAIM_STATUS_FAILURE,
  FETCH_ELIGIBILITY_SUCCESS,
  FETCH_ELIGIBILITY_FAILURE,
  ELIGIBILITY,
} from '../actions';

const initialState = {
  formData: {},
  form: {
    data: {},
  },
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  data: (state = initialState, action) => {
    switch (action.type) {
      case FETCH_PERSONAL_INFORMATION:
        return {
          ...state,
          personalInfoFetchInProgress: true,
        };
      case FETCH_PERSONAL_INFORMATION_SUCCESS:
      case FETCH_PERSONAL_INFORMATION_FAILED:
        return {
          ...state,
          personalInfoFetchInProgress: false,
          formData: action?.response || {},
        };
      case FETCH_CLAIM_STATUS_SUCCESS:
      case FETCH_CLAIM_STATUS_FAILURE:
        return {
          ...state,
          claimStatus: action?.response?.attributes || {},
        };
      case FETCH_ELIGIBILITY_SUCCESS:
      case FETCH_ELIGIBILITY_FAILURE:
        return {
          ...state,
          eligibility:
            action?.response?.data?.attributes?.eligibility
              ?.filter(
                benefit =>
                  (benefit.veteranIsEligible === true ||
                    benefit.veteranIsEligible === null) &&
                  benefit.chapter !== ELIGIBILITY.CHAPTER33,
              )
              .map(benefit => benefit.chapter) || [],
        };
      default:
        return state;
    }
  },
};
