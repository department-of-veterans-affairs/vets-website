import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

import {
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  FETCH_CLAIM_STATUS_SUCCESS,
  FETCH_CLAIM_STATUS_FAILURE,
  FETCH_DIRECT_DEPOSIT,
  FETCH_DIRECT_DEPOSIT_FAILED,
  FETCH_DIRECT_DEPOSIT_SUCCESS,
  FETCH_ELIGIBILITY_SUCCESS,
  FETCH_ELIGIBILITY_FAILURE,
  ELIGIBILITY,
  FETCH_PERSONAL_INFORMATION,
} from '../actions';

const initialState = {
  formData: {},
  form: {
    data: {},
  },
};

const handleDirectDepositApi = action => {
  if (action?.response?.data?.attributes) {
    return {
      ...action?.response?.data?.attributes,
      routingNumber:
        action?.response?.data?.attributes?.financialInstitutionRoutingNumber,
      originalAccountNumber: action?.response?.data?.attributes?.accountNumber,
      originalRoutingNumer:
        action?.response?.data?.attributes?.financialInstitutionRoutingNumber,
    };
  }
  return {
    accountType: 'Checking',
    accountNumber: '******9891',
    routingNumber: '*****0503',
    originalAccountNumber: '******9891',
    originalRoutingNumber: '*****0503',
    financialInstitutionName: 'Wells Fargo',
  };
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
          personalInfoFetchComplete: true,
          personalInfoFetchInProgress: false,
          formData: action?.response || {},
        };
      case FETCH_CLAIM_STATUS_SUCCESS:
      case FETCH_CLAIM_STATUS_FAILURE:
        return {
          ...state,
          claimStatus: action?.response?.attributes || {},
        };
      case FETCH_DIRECT_DEPOSIT:
        return {
          ...state,
          fetchDirectDepositInProgress: true,
        };
      case FETCH_DIRECT_DEPOSIT_SUCCESS:
      case FETCH_DIRECT_DEPOSIT_FAILED:
        return {
          ...state,
          fetchDirectDepositInProgress: false,
          bankInformation: handleDirectDepositApi(action),
        };
      case FETCH_ELIGIBILITY_SUCCESS:
      case FETCH_ELIGIBILITY_FAILURE:
        return {
          ...state,
          eligibilityFetchComplete: true,
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
