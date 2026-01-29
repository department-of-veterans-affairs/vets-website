import set from '../../../utilities/data/set';

import { UPDATE_LOGGEDIN_STATUS } from '../../authentication/actions';
import { mapRawUserDataToState } from '../utilities';

import {
  UPDATE_PROFILE_FIELDS,
  PROFILE_LOADING_FINISHED,
  FETCHING_MHV_ACCOUNT,
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  REMOVING_SAVED_FORM_SUCCESS,
  PROFILE_ERROR,
  FETCH_MESSAGING_SIGNATURE,
  UPDATE_MHV_STATE_VALUE,
} from '../actions';

const initialState = {
  userFullName: {
    first: null,
    middle: null,
    last: null,
    suffix: null,
  },
  preferredName: null,
  createdAt: null,
  email: null,
  dob: null,
  gender: null,
  accountType: null,
  accountUuid: null,
  isCernerPatient: false,
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
    messagingSignature: null,
  },
  vapContactInfo: {},
  savedForms: [],
  prefillsAvailable: [],
  loading: true,
  services: [],
  session: {},
  mhvTransitionEligible: false,
  userAtPretransitionedOhFacility: false,
  userFacilityReadyForInfoAlert: false,
  errors: false,
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
      return {
        ...state,
        ...newState,
      };
    }

    case PROFILE_LOADING_FINISHED:
    case UPDATE_LOGGEDIN_STATUS:
      return set('loading', false, state);

    case FETCHING_MHV_ACCOUNT:
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

    // We are no longer creating or upgrading MHV accounts
    case FETCH_MHV_ACCOUNT_SUCCESS:
      return updateMhvAccountState(state, action.data.attributes);

    case UPDATE_MHV_STATE_VALUE:
      return set('mhvAccountState', action.accountState, state);

    case REMOVING_SAVED_FORM_SUCCESS: {
      const forms = state.savedForms.filter(el => el.form !== action.formId);
      return set('savedForms', forms, state);
    }

    case PROFILE_ERROR:
      return set('errors', true, state);

    case FETCH_MESSAGING_SIGNATURE: {
      return updateMhvAccountState(state, {
        messagingSignature: action.payload,
      });
    }

    default:
      return state;
  }
}

export default profileInformation;
