import _ from 'lodash/fp';
import { UPDATE_LOGGEDIN_STATUS, FETCH_LOGIN_URLS_FAILED } from '../../../login/actions';
import {
  UPDATE_PROFILE_FIELDS,
  PROFILE_LOADING_FINISHED,

  FETCHING_LATEST_MHV_TERMS,
  FETCHING_LATEST_MHV_TERMS_SUCCESS,
  FETCHING_LATEST_MHV_TERMS_FAILURE,

  ACCEPTING_LATEST_MHV_TERMS,
  ACCEPTING_LATEST_MHV_TERMS_SUCCESS,
  ACCEPTING_LATEST_MHV_TERMS_FAILURE,

  SAVE_MAILING_ADDRESS,
  SAVE_MAILING_ADDRESS_FAIL,
  SAVE_MAILING_ADDRESS_SUCCESS,

  SAVE_PRIMARY_PHONE,
  SAVE_PRIMARY_PHONE_FAIL,
  SAVE_PRIMARY_PHONE_SUCCESS,

  SAVE_ALTERNATE_PHONE,
  SAVE_ALTERNATE_PHONE_FAIL,
  SAVE_ALTERNATE_PHONE_SUCCESS,

  SAVE_EMAIL_ADDRESS,
  SAVE_EMAIL_ADDRESS_FAIL,
  SAVE_EMAIL_ADDRESS_SUCCESS,

  FETCH_EXTENDED_PROFILE,
  FETCH_EXTENDED_PROFILE_SUCCESS,
  FETCH_EXTENDED_PROFILE_FAIL,

  OPEN_MODAL

} from '../actions';

// TODO(crew): Romove before this goes to production.
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
  ssn: null,
  accountType: null,
  terms: {
    loading: false,
    terms: {},
  },
  savedForms: [],
  prefillsAvailable: [],
  loading: true,
  extended: false,
  pendingSaves: [],
  errors: [],
  modal: null,
  primaryTelephone: null,
  alternateTelephone: null,
  mailingAddress: null
};

function extendedProfile(state = initialState, action) {
  switch (action.type) {

    case FETCH_EXTENDED_PROFILE: {
      return state;
    }

    case FETCH_EXTENDED_PROFILE_FAIL: {
      const errors = state.errors.concat(FETCH_EXTENDED_PROFILE_FAIL);
      return { ...state, errors, extended: true };
    }

    case FETCH_EXTENDED_PROFILE_SUCCESS: {
      return { ...state, ...action.newState, extended: true };
    }

    case OPEN_MODAL: {
      const modal = action.modal;
      return { ...state, modal };
    }

    case SAVE_EMAIL_ADDRESS:
    case SAVE_PRIMARY_PHONE:
    case SAVE_ALTERNATE_PHONE:
    case SAVE_MAILING_ADDRESS: {
      const pendingSaves = state.pendingSaves.concat(action.type);
      return { ...state, pendingSaves };
    }

    case SAVE_EMAIL_ADDRESS_SUCCESS: {
      const email = action.newValue;
      const pendingSaves = state.pendingSaves.filter(p => p !== SAVE_EMAIL_ADDRESS);
      return { ...state, email, pendingSaves, modal: null };
    }

    case SAVE_PRIMARY_PHONE_SUCCESS: {
      const primaryTelephone = action.newValue;
      const pendingSaves = state.pendingSaves.filter(p => p !== SAVE_PRIMARY_PHONE);
      return { ...state, primaryTelephone, pendingSaves, modal: null };
    }

    case SAVE_ALTERNATE_PHONE_SUCCESS: {
      const alternateTelephone = action.newValue;
      const pendingSaves = state.pendingSaves.filter(p => p !== SAVE_ALTERNATE_PHONE);
      return { ...state, alternateTelephone, pendingSaves, modal: null };
    }

    case SAVE_MAILING_ADDRESS_SUCCESS: {
      const mailingAddress = action.newValue;
      const pendingSaves = state.pendingSaves.filter(p => p !== SAVE_MAILING_ADDRESS);
      return { ...state, mailingAddress, pendingSaves, modal: null };
    }

    case SAVE_EMAIL_ADDRESS_FAIL:
    case SAVE_PRIMARY_PHONE_FAIL:
    case SAVE_ALTERNATE_PHONE_FAIL:
    case SAVE_MAILING_ADDRESS_FAIL: {
      const errors = state.errors.concat(action.type);
      return { ...state, errors };
    }

    case UPDATE_PROFILE_FIELDS: {
      return _.assign(state, action.newState);
    }
    case PROFILE_LOADING_FINISHED: {
      return _.set('loading', false, state);
    }
    case FETCH_LOGIN_URLS_FAILED: {
      return _.set('loading', false, state);
    }
    case UPDATE_LOGGEDIN_STATUS: {
      return _.set('loading', false, state);
    }
    case FETCHING_LATEST_MHV_TERMS: {
      return {
        ...state,
        terms: {
          ...state.terms,
          content: {},
          loading: true,
        }
      };
    }
    case FETCHING_LATEST_MHV_TERMS_SUCCESS: {
      return {
        ...state,
        terms: {
          ...state.terms,
          ...action.terms,
          loading: false,
        }
      };
    }
    case FETCHING_LATEST_MHV_TERMS_FAILURE: {
      return {
        ...state,
        terms: {
          loading: false,
        }
      };
    }
    case ACCEPTING_LATEST_MHV_TERMS: {
      return state;
    }
    case ACCEPTING_LATEST_MHV_TERMS_SUCCESS: {
      return {
        ...state,
        terms: {
          loading: false,
        }
      };
    }
    case ACCEPTING_LATEST_MHV_TERMS_FAILURE: {
      return {
        ...state,
        terms: {
          ...state.terms,
          loading: false,
        }
      };
    }
    default:
      return state;
  }
}

export default { extendedProfile };
