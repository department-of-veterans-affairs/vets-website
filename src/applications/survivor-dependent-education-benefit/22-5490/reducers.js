import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from './config/form';

import {
  FETCH_PERSONAL_INFORMATION,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
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
                };
              },
            ),
            someoneNotListed: false,
          },
        };
      default:
        return state;
    }
  },
};
