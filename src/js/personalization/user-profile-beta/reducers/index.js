import {
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

  FETCH_VA_PROFILE,
  FETCH_VA_PROFILE_SUCCESS,
  FETCH_VA_PROFILE_FAIL,

  OPEN_MODAL,

  UPDATE_PROFILE_FORM_FIELD
} from '../actions';

const initialState = {
  userFullName: null,
  email: null,
  dob: null,
  gender: null,
  ssn: null,
  primaryTelephone: null,
  alternateTelephone: null,
  mailingAddress: null,
  serviceHistory: null,
  modal: null,
  pendingSaves: [],
  errors: [],
  loading: true,
  formFields: {}
};

function vaProfile(state = initialState, action) {
  switch (action.type) {

    case FETCH_VA_PROFILE: {
      return state;
    }

    case FETCH_VA_PROFILE_FAIL: {
      const errors = state.errors.concat(FETCH_VA_PROFILE_FAIL);
      return { ...state, errors, loading: false };
    }

    case FETCH_VA_PROFILE_SUCCESS: {
      return { ...state, ...action.newState, loading: false };
    }

    case OPEN_MODAL: {
      const modal = action.modal;
      return { ...state, modal };
    }

    case UPDATE_PROFILE_FORM_FIELD: {
      const formFields = { ...state.formFields, [action.field]: action.newState };
      return { ...state, formFields };
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

    default:
      return state;
  }
}

export default { vaProfile };
