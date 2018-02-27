import _ from 'lodash/fp';
import { UPDATE_LOGGEDIN_STATUS, FETCH_LOGIN_URLS_FAILED } from '../../login/actions';
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

  SAVE_RESIDENTIAL_ADDRESS,
  SAVE_RESIDENTIAL_ADDRESS_FAIL,
  SAVE_RESIDENTIAL_ADDRESS_SUCCESS,

  SAVE_PRIMARY_PHONE,
  SAVE_PRIMARY_PHONE_FAIL,
  SAVE_PRIMARY_PHONE_SUCCESS,

  SAVE_ALTERNATE_PHONE,
  SAVE_ALTERNATE_PHONE_FAIL,
  SAVE_ALTERNATE_PHONE_SUCCESS,

  SAVE_EMAIL_ADDRESS,
  SAVE_EMAIL_ADDRESS_FAIL,
  SAVE_EMAIL_ADDRESS_SUCCESS,

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
  accountType: null,
  terms: {
    loading: false,
    terms: {},
  },
  savedForms: [],
  prefillsAvailable: [],
  loading: true,
  pendingSaves: [],
  errors: [],
  modal: null
};

function profileInformation(state = initialState, action) {
  switch (action.type) {

    case SAVE_EMAIL_ADDRESS:
    case SAVE_PRIMARY_PHONE:
    case SAVE_ALTERNATE_PHONE:
    case SAVE_RESIDENTIAL_ADDRESS:
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
      const telephones = state.telephones.map(t => (t.type === 'primary' ? action.newValue : t));
      const pendingSaves = state.pendingSaves.filter(p => p !== SAVE_PRIMARY_PHONE);
      return { ...state, telephones, pendingSaves, modal: null };
    }

    case SAVE_ALTERNATE_PHONE_SUCCESS: {
      const telephones = state.telephones.map(t => (t.type === 'alternate' ? action.newValue : t));
      const pendingSaves = state.pendingSaves.filter(p => p !== SAVE_ALTERNATE_PHONE);
      return { ...state, telephones, pendingSaves, modal: null };
    }

    case SAVE_RESIDENTIAL_ADDRESS_SUCCESS: {
      const addresses = state.addresses.map(a => (a.type === 'residential' ? action.newValue : a));
      const pendingSaves = state.pendingSaves.filter(p => p !== SAVE_RESIDENTIAL_ADDRESS);
      return { ...state, addresses, pendingSaves, modal: null };
    }

    case SAVE_MAILING_ADDRESS_SUCCESS: {
      const addresses = state.addresses.map(a => (a.type === 'mailing' ? action.newValue : a));
      const pendingSaves = state.pendingSaves.filter(p => p !== SAVE_MAILING_ADDRESS);
      return { ...state, addresses, pendingSaves, modal: null };
    }

    case SAVE_EMAIL_ADDRESS_FAIL:
    case SAVE_PRIMARY_PHONE_FAIL:
    case SAVE_ALTERNATE_PHONE_FAIL:
    case SAVE_RESIDENTIAL_ADDRESS_FAIL:
    case SAVE_MAILING_ADDRESS_FAIL: {
      const errors = state.errors.concat(action.type);
      return { ...state, errors };
    }

    case OPEN_MODAL: {
      const modal = action.modal;
      return { ...state, modal };
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

export default profileInformation;
