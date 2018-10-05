import set from '../../../utilities/data/set';

import { UPDATE_LOGGEDIN_STATUS } from '../../authentication/actions';
import { mapRawUserDataToState } from '../utilities';

import {
  UPDATE_PROFILE_FIELDS,
  PROFILE_LOADING_FINISHED,
  FETCHING_MHV_ACCOUNT,
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  CREATING_MHV_ACCOUNT,
  CREATE_MHV_ACCOUNT_FAILURE,
  CREATE_MHV_ACCOUNT_SUCCESS,
  UPGRADING_MHV_ACCOUNT,
  UPGRADE_MHV_ACCOUNT_FAILURE,
  UPGRADE_MHV_ACCOUNT_SUCCESS,
  REMOVING_SAVED_FORM_SUCCESS,
} from '../actions';

const initialState = {
  userFullName: {
    first: null,
    middle: null,
    last: null,
    suffix: null,
  },
  email: null,
  dob: null,
  gender: null,
  accountType: null,
  loa: {
    current: null,
    highest: null,
  },
  verified: false,
  mhvAccount: {
    accountLevel: null,
    accountState: null,
    errors: null,
    loading: false,
    termsAndConditionsAccepted: false,
  },
  vet360: {},
  savedForms: [],
  prefillsAvailable: [],
  loading: true,
  services: [],
};

const updateMhvAccountState = (state, mhvAccount) =>
  set(
    'mhvAccount',
    {
      ...state.mhvAccount,
      ...mhvAccount,
      errors: null,
      loading: false,
    },
    state,
  );

function profileInformation(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE_FIELDS: {
      const newState = mapRawUserDataToState(action.payload);
      return Object.assign({}, state, newState);
    }

    case PROFILE_LOADING_FINISHED:
    case UPDATE_LOGGEDIN_STATUS:
      return set('loading', false, state);

    case FETCHING_MHV_ACCOUNT:
    case CREATING_MHV_ACCOUNT:
    case UPGRADING_MHV_ACCOUNT:
      return set('mhvAccount.loading', true, state);

    case FETCH_MHV_ACCOUNT_FAILURE:
      return set(
        'mhvAccount',
        {
          ...state.mhvAccount,
          errors: action.errors,
          loading: false,
        },
        state,
      );

    case CREATE_MHV_ACCOUNT_FAILURE:
      return set(
        'mhvAccount',
        {
          ...state.mhvAccount,
          accountState: 'register_failed',
          loading: false,
        },
        state,
      );

    case UPGRADE_MHV_ACCOUNT_FAILURE:
      return set(
        'mhvAccount',
        {
          ...state.mhvAccount,
          accountState: 'upgrade_failed',
          loading: false,
        },
        state,
      );

    case FETCH_MHV_ACCOUNT_SUCCESS:
    case CREATE_MHV_ACCOUNT_SUCCESS:
      return updateMhvAccountState(state, action.data.attributes);

    case UPGRADE_MHV_ACCOUNT_SUCCESS: {
      const newState = !action.userProfile
        ? state
        : Object.assign({}, state, mapRawUserDataToState(action.userProfile));
      return updateMhvAccountState(newState, action.mhvAccount.data.attributes);
    }

    case REMOVING_SAVED_FORM_SUCCESS: {
      const forms = state.savedForms.filter(el => el.form !== action.formId);
      return set('savedForms', forms, state);
    }

    default:
      return state;
  }
}

export default profileInformation;
