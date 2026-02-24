import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

import {
  FETCH_PERSONAL_INFORMATION,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  FETCH_DIRECT_DEPOSIT,
  FETCH_DIRECT_DEPOSIT_SUCCESS,
  FETCH_DIRECT_DEPOSIT_FAILED,
  FETCH_DUPLICATE_CONTACT_INFO_SUCCESS,
  FETCH_DUPLICATE_CONTACT_INFO_FAILURE,
  ACKNOWLEDGE_DUPLICATE,
  TOGGLE_MODAL,
} from '../actions';

const initialState = {
  formData: {},
  personalInfoFetchInProgress: false,
  personalInfoFetchComplete: false,
  isPersonalInfoFetchFailed: false,
};

const handleDirectDepositApi = action => {
  if (!action?.response?.data?.attributes) {
    return {};
  }

  return {
    ...action?.response?.data?.attributes?.paymentAccount,
    originalAccountNumber:
      action?.response?.data?.attributes?.paymentAccount?.accountNumber,
    originalRoutingNumber:
      action?.response?.data?.attributes?.paymentAccount?.routingNumber,
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
        return {
          ...state,
          isPersonalInfoFetchFailed: false,
          personalInfoFetchComplete: true,
          personalInfoFetchInProgress: false,
          formData: action?.response || {},
        };
      case FETCH_PERSONAL_INFORMATION_FAILED:
        return {
          ...state,
          isPersonalInfoFetchFailed: true,
          personalInfoFetchComplete: true,
          personalInfoFetchInProgress: false,
          formData: action?.response || {},
        };
      case FETCH_DIRECT_DEPOSIT:
        return {
          ...state,
          fetchDirectDepositInProgress: true,
        };
      case FETCH_DIRECT_DEPOSIT_SUCCESS: {
        const directDepositData = handleDirectDepositApi(action);
        return {
          ...state,
          fetchDirectDepositInProgress: false,
          bankInformation: directDepositData,
        };
      }
      case FETCH_DIRECT_DEPOSIT_FAILED:
        return {
          ...state,
          fetchDirectDepositInProgress: false,
          bankInformation: handleDirectDepositApi(action),
        };
      case FETCH_DUPLICATE_CONTACT_INFO_SUCCESS:
        return {
          ...state,
          duplicateEmail: action?.response?.data?.attributes?.email,
          duplicatePhone: action?.response?.data?.attributes?.phone,
        };
      case FETCH_DUPLICATE_CONTACT_INFO_FAILURE:
        return {
          ...state,
          email: action?.email,
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
