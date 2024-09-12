import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

import {
  FETCH_PERSONAL_INFORMATION,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  FETCH_DUPLICATE_CONTACT_INFO_SUCCESS,
  FETCH_DUPLICATE_CONTACT_INFO_FAILURE,
  UPDATE_GLOBAL_EMAIL,
  UPDATE_GLOBAL_PHONE_NUMBER,
  ACKNOWLEDGE_DUPLICATE,
  TOGGLE_MODAL,
} from '../actions';

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
          // fetchedSponsorsComplete: true,
          formData: action?.response || {},
        };
      case FETCH_PERSONAL_INFORMATION_FAILED:
        return {
          ...state,
          isPersonalInfoFetchFailed: true,
          personalInfoFetchComplete: true,
          personalInfoFetchInProgress: false,
          formData: action?.response || {},
          // fetchedSponsorsComplete: true,
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
      // case FETCH_DIRECT_DEPOSIT:
      //   return {
      //     ...state,
      //     fetchDirectDepositInProgress: true,
      //   };
      // case FETCH_DIRECT_DEPOSIT_SUCCESS:
      // case FETCH_DIRECT_DEPOSIT_FAILED:
      //   return {
      //     ...state,
      //     fetchDirectDepositInProgress: false,
      //     bankInformation: handleDirectDepositApi(action),
      //   };
      default:
        return state;
    }
  },
};
