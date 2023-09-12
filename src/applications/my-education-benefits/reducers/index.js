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
  FETCH_DUPLICATE_CONTACT_INFO_SUCCESS,
  FETCH_DUPLICATE_CONTACT_INFO_FAILURE,
  UPDATE_GLOBAL_EMAIL,
  UPDATE_GLOBAL_PHONE_NUMBER,
  ACKNOWLEDGE_DUPLICATE,
  TOGGLE_MODAL,
} from '../actions';

const initialState = {
  openModal: false,
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
    };
  }
  return {
    // accountType: 'Checking',
    // accountNumber: '1234569891',
    // routingNumber: '031000503',
    // financialInstitutionName: 'Wells Fargo',
  };
};

const filterEligibility = eligibility => {
  return eligibility?.filter(
    benefit =>
      (benefit.veteranIsEligible === true ||
        benefit.veteranIsEligible === null) &&
      benefit.chapter !== ELIGIBILITY.CHAPTER33,
  );
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
        if (action?.errors) {
          return {
            ...state,
            eligibilityFetchComplete: true,
            eligibility: ['Chapter30', 'Chapter1606', 'NotEligible'],
          };
        }
        return {
          ...state,
          eligibilityFetchComplete: true,
          eligibility:
            filterEligibility(
              action?.response?.data?.attributes?.eligibility,
            ).map(
              benefit =>
                benefit.veteranIsEligible === null
                  ? `${benefit.chapter}null`
                  : benefit.chapter,
            ) || [],
        };

      case FETCH_DUPLICATE_CONTACT_INFO_SUCCESS:
        return {
          ...state,
          duplicateEmail: action?.response?.data?.attributes?.email,
          duplicatePhone: action?.response?.data?.attributes?.phone,
        };
      case FETCH_DUPLICATE_CONTACT_INFO_FAILURE:
      case UPDATE_GLOBAL_EMAIL:
        return {
          ...state,
          email: action?.email,
        };
      case UPDATE_GLOBAL_PHONE_NUMBER:
        return {
          ...state,
          mobilePhone: action?.mobilePhone,
        };
      case ACKNOWLEDGE_DUPLICATE:
        return {
          ...state,
          duplicateEmail: action?.contactInfo?.email,
          duplicatePhone: action?.contactInfo?.phone,
        };
      case TOGGLE_MODAL:
        return {
          ...state,
          openModal: action.toggle,
        };
      default:
        return state;
    }
  },
};
