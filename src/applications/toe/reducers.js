import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from './config/form';

import {
  FETCH_SPONSORS,
  FETCH_SPONSORS_FAILED,
  FETCH_SPONSORS_SUCCESS,
  UPDATE_SPONSORS,
  FETCH_PERSONAL_INFORMATION,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  FETCH_DIRECT_DEPOSIT,
  FETCH_DIRECT_DEPOSIT_FAILED,
  FETCH_DIRECT_DEPOSIT_SUCCESS,
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

const ifApiIsDown = action => {
  if (action?.response) {
    return {
      ...action?.response?.data?.attributes,
    };
  }
  return {
    accountType: 'Checking',
    accountNumber: '*********9891',
    routingNumber: '*****9593',
    financialInstitutionName: 'BANK OF AMERICA N.A.',
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
                  id: `${sponsor.sponsorVaId.toString()}`,
                  name: [sponsor.firstName, sponsor.lastName].join(' '),
                  relationship: sponsor.sponsorRelationship,
                };
              },
            ),
            someoneNotListed: false,
          },
        };
      case FETCH_SPONSORS:
        return {
          ...state,
          fetchedSponsors: true,
        };
      case FETCH_SPONSORS_SUCCESS:
      case FETCH_SPONSORS_FAILED:
        return {
          ...state,
          fetchedSponsorsComplete: true,
          sponsors: {
            sponsors: state.sponsors || [],
            // [
            // {
            //   id: '1',
            //   name: 'Hector Stanley',
            //   dateOfBirth: '1978-07-18',
            //   relationship: SPONSOR_RELATIONSHIP.CHILD,
            // },
            // {
            //   id: '2',
            //   name: 'Nancy Stanley',
            //   dateOfBirth: '1979-10-11',
            //   relationship: SPONSOR_RELATIONSHIP.CHILD,
            // },
            // {
            //   id: '3',
            //   name: 'Jane Doe',
            //   dateOfBirth: '1996-07-18',
            //   relationship: SPONSOR_RELATIONSHIP.SPOUSE,
            // },
            // ],
            someoneNotListed: false,
          },
        };
      case UPDATE_SPONSORS:
        return {
          ...state,
          sponsors: action.payload,
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
          bankInformation: ifApiIsDown(action),
        };
      default:
        return state;
    }
  },
};
