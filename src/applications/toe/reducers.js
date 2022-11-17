import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from './config/form';

import {
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
} from './actions';

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
    accountNumber: '*****9891',
    accountType: 'Checking',
    financialInstitutionName: 'Wells Fargo',
    originalAccountNumber: '*****9891',
    originalRoutingNumber: '*****0503',
    routingNumber: '*****0503',
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
          fetchedSponsorsComplete: true,
          sponsors: {
            sponsors: action?.response?.data?.attributes?.toeSponsors?.transferOfEntitlements?.map(
              sponsor => {
                return {
                  ...sponsor,
                  id: `${sponsor?.sponsorVaId}`,
                  name: [sponsor.firstName, sponsor.lastName].join(' '),
                  relationship: sponsor.sponsorRelationship,
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
      default:
        return state;
    }
  },
};
