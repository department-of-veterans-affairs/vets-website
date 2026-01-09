import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from './config/form';

import {
  ACKNOWLEDGE_DUPLICATE,
  UPDATE_SPONSORS,
  FETCH_PERSONAL_INFORMATION,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  FETCH_DIRECT_DEPOSIT,
  FETCH_DIRECT_DEPOSIT_FAILED,
  FETCH_DIRECT_DEPOSIT_SUCCESS,
  FETCH_CLAIM_STATUS,
  FETCH_CLAIM_STATUS_SUCCESS,
  FETCH_CLAIM_STATUS_FAILURE,
  FETCH_DUPLICATE_CONTACT_INFO_SUCCESS,
  FETCH_DUPLICATE_CONTACT_INFO_FAILURE,
  UPDATE_GLOBAL_EMAIL,
  UPDATE_GLOBAL_PHONE_NUMBER,
  SEND_CONFIRMATION,
  SEND_CONFIRMATION_SUCCESS,
  SEND_CONFIRMATION_FAILURE,
  TOGGLE_MODAL,
} from './actions';
import { formFields } from './constants';

const initialState = {
  formData: {
    firstSponsor: undefined,
    selectedSponsors: [],
    someoneNotListed: undefined,
    sponsors: {},
  },
  form: {
    data: {},
  },
  confirmationLoading: false,
  confirmationSuccess: false,
  confirmationError: null,
  openModal: false,
};

const handleDirectDepositApi = action => {
  if (!action?.response?.data?.attributes) {
    return {};
  }

  const accountNumber = action?.response?.data?.attributes?.paymentAccount
    ? action?.response?.data?.attributes?.paymentAccount?.accountNumber
    : action?.response?.data?.attributes?.accountNumber;
  const originalRoutingNumber = action?.response?.data?.attributes
    ?.paymentAccount
    ? action?.response?.data?.attributes?.paymentAccount?.routingNumber
    : action?.response?.data?.attributes?.financialInstitutionRoutingNumber;
  const routingNumber = action?.response?.data?.attributes?.paymentAccount
    ? action?.response?.data?.attributes?.paymentAccount?.routingNumber
    : action?.response?.data?.attributes?.financialInstitutionRoutingNumber;

  const accountType = action?.response?.data?.attributes?.paymentAccount
    ? action?.response?.data?.attributes?.paymentAccount?.accountType
    : action?.response?.data?.attributes?.accountType;

  return {
    [formFields.originalAccountNumber]: accountNumber,
    [formFields.originalRoutingNumber]: originalRoutingNumber,
    [formFields.accountNumber]: accountNumber,
    [formFields.routingNumber]: routingNumber,
    [formFields.accountType]: accountType,
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
          isPersonalInfoFetchFailed: false, // Set to false since the fetch was successful
          personalInfoFetchComplete: true,
          personalInfoFetchInProgress: false,
          fetchedSponsorsComplete: true,
          formData: action?.response || {},
          sponsors: {
            sponsors: action?.response?.data?.attributes?.toeSponsors?.transferOfEntitlements?.map(
              sponsor => {
                return {
                  ...sponsor,
                  id: `${sponsor?.sponsorVaId}`,
                  name: [sponsor.firstName, sponsor.lastName].join(' '),
                  relationship: sponsor.sponsorRelationship,
                  selected: false,
                };
              },
            ),
            someoneNotListed: false,
          },
        };
      case FETCH_PERSONAL_INFORMATION_FAILED:
        return {
          ...state,
          isPersonalInfoFetchFailed: true,
          personalInfoFetchComplete: true,
          personalInfoFetchInProgress: false,
          formData: action?.response || {},
          fetchedSponsorsComplete: true,
          sponsors: {
            sponsors: action?.response?.data?.attributes?.toeSponsors?.transferOfEntitlements?.map(
              sponsor => {
                return {
                  ...sponsor,
                  id: `${sponsor?.sponsorVaId}`,
                  name: [sponsor.firstName, sponsor.lastName].join(' '),
                  relationship: sponsor.sponsorRelationship,
                  selected: false,
                };
              },
            ),
            someoneNotListed: false,
          },
        };
      case UPDATE_SPONSORS:
        return {
          ...state,
          sponsors: action.payload,
        };
      case FETCH_CLAIM_STATUS:
        return {
          ...state,
          claimStatusFetchInProgress: true,
        };
      case FETCH_CLAIM_STATUS_SUCCESS:
      case FETCH_CLAIM_STATUS_FAILURE:
        return {
          ...state,
          claimStatusFetchComplete: true,
          claimStatusFetchInProgress: false,
          claimStatus: {
            ...action?.response?.attributes,
          },
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
      case SEND_CONFIRMATION:
        return {
          ...state,
          confirmationLoading: true,
          confirmationSuccess: false,
          confirmationError: null,
        };
      case SEND_CONFIRMATION_SUCCESS:
        return {
          ...state,
          confirmationLoading: false,
          confirmationSuccess: true,
          confirmationError: null,
        };
      case SEND_CONFIRMATION_FAILURE:
        return {
          ...state,
          confirmationLoading: false,
          confirmationSuccess: false,
          confirmationError: action.errors,
        };
      default:
        return state;
    }
  },
};
