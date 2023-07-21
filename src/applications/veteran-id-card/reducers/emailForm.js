import {
  VIC_EMAIL_CAPTURING,
  VIC_EMAIL_CAPTURE_SUCCESS,
  VIC_EMAIL_CAPTURE_FAILURE,
  VIC_SET_EMAIL,
  VIC_SET_DIRTY,
} from '../actions';

const initialState = {
  errors: null,
  submitting: false,
  success: false,
  email: '',
  dirty: false,
};

function validEmail(email, dirty) {
  if (dirty) {
    return email.match(/[^@\s]+@([^@\s]+\.)+[^@\s]+/);
  }
  return true;
}

function emailForm(state = initialState, action) {
  switch (action.type) {
    case VIC_SET_EMAIL:
      return {
        ...state,
        email: action.email,
        errors: validEmail(action.email, state.dirty)
          ? null
          : [{ title: 'Email is invalid' }],
      };
    case VIC_SET_DIRTY:
      return {
        ...state,
        dirty: true,
        errors: validEmail(state.email, true)
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
