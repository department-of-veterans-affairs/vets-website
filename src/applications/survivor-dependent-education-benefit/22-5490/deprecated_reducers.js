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
        };
      case FETCH_PERSONAL_INFORMATION_FAILED:
        return {
          ...state,
          isPersonalInfoFetchFailed: true,
          personalInfoFetchComplete: true,
          personalInfoFetchInProgress: false,
          formData: action?.response || {},
          fetchedSponsorsComplete: true,
        };
      default:
        return state;
    }
  },
};
