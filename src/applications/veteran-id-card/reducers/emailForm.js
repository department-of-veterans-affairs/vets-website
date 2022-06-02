import {
  VIC_EMAIL_CAPTURING,
  VIC_EMAIL_CAPTURE_SUCCESS,
  VIC_EMAIL_CAPTURE_FAILURE,
  VIC_SET_EMAIL,
} from '../actions';

const initialState = {
  errors: null,
  submitting: false,
  success: false,
  email: '',
};

function validEmail(email) {
  return email.match(/[^@\s]+@([^@\s]+\.)+[^@\s]+/);
}

function emailForm(state = initialState, action) {
  switch (action.type) {
    case VIC_SET_EMAIL:
      return {
        ...state,
        email: action.email,
        errors: validEmail(action.email)
          ? null
          : [{ title: 'Email is invalid' }],
      };
    case VIC_EMAIL_CAPTURING:
      return {
        ...state,
        submitting: true,
        errors: null,
        success: false,
      };
    case VIC_EMAIL_CAPTURE_SUCCESS:
      return {
        ...state,
        ...initialState,
        success: true,
      };
    case VIC_EMAIL_CAPTURE_FAILURE:
      return {
        ...state,
        ...initialState,
        errors: action.errors,
      };
    default:
      return state;
  }
}

export default emailForm;
