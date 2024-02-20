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
  FETCH_EXCLUSION_PERIODS,
  FETCH_EXCLUSION_PERIODS_SUCCESS,
  FETCH_EXCLUSION_PERIODS_FAILURE,
  ELIGIBILITY,
  FETCH_PERSONAL_INFORMATION,
  FETCH_DUPLICATE_CONTACT_INFO_SUCCESS,
  FETCH_DUPLICATE_CONTACT_INFO_FAILURE,
  UPDATE_GLOBAL_EMAIL,
  UPDATE_GLOBAL_PHONE_NUMBER,
  ACKNOWLEDGE_DUPLICATE,
  TOGGLE_MODAL,
} from '../actions';
import { formFields } from '../constants';

const initialState = {
  openModal: false,
  formData: {},
  form: {
    data: {},
  },
  exclusionPeriods: null,
  exclusionPeriodsLoading: false,
  exclusionPeriodsError: null,
};
const handleDirectDepositApi = action => {
  if (!action?.response?.data?.attributes) {
    return {};
  }

  return {
    ...action?.response?.data?.attributes,
    [formFields.originalAccountNumber]:
      action?.response?.data?.attributes?.accountNumber,
    [formFields.originalRoutingNumber]:
      action?.response?.data?.attributes?.financialInstitutionRoutingNumber,
    [formFields.routingNumber]:
      action?.response?.data?.attributes?.financialInstitutionRoutingNumber,
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
      case FETCH_EXCLUSION_PERIODS:
        return {
          ...state,
          exclusionPeriodsLoading: true,
          exclusionPeriodsError: null,
        };
      case FETCH_EXCLUSION_PERIODS_SUCCESS:
        return {
          ...state,
          exclusionPeriodsLoading: false,
          exclusionPeriods:
            action?.response?.data?.attributes?.exclusionPeriods || [],
        };
      case FETCH_EXCLUSION_PERIODS_FAILURE:
        return {
          ...state,
          exclusionPeriodsLoading: false,
          exclusionPeriodsError: action.errors,
        };
      case FETCH_PERSONAL_INFORMATION:
        return {
          ...state,
          personalInfoFetchInProgress: true,
        };
      case FETCH_PERSONAL_INFORMATION_SUCCESS:
        return {
          ...state,
          isPersonalInfoFetchFailed: false, // Set to false since the fetch was successful
          personalInfoFetchComplete: true,
          personalInfoFetchInProgress: false,
          formData: action?.response || {},
        };
      case FETCH_PERSONAL_INFORMATION_FAILED:
        return {
          ...state,
          isPersonalInfoFetchFailed: true, // Only set to true when there's a failure
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
      case FETCH_DIRECT_DEPOSIT_SUCCESS: {
        const directDepositData = handleDirectDepositApi(action);
        return {
          ...state,
          fetchDirectDepositInProgress: false,
          bankInformation: directDepositData,
          formData: {
            ...state.formData,
            'view:directDeposit': {
              bankAccount: directDepositData,
            },
          },
        };
      }
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
