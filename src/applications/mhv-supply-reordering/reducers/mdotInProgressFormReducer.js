import {
  GET_MDOT_IN_PROGRESS_FORM_STARTED,
  GET_MDOT_IN_PROGRESS_FORM_SUCCEEDED,
  GET_MDOT_IN_PROGRESS_FORM_FAILED,
} from '../actions';

export const initialState = {
  formData: {},
  error: false,
  loading: false,
};

export const mdotInProgressFormReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case GET_MDOT_IN_PROGRESS_FORM_STARTED:
      return { ...state, loading: true };
    case GET_MDOT_IN_PROGRESS_FORM_SUCCEEDED:
      return { ...state, formData: payload.formData, loading: false };
    case GET_MDOT_IN_PROGRESS_FORM_FAILED:
      return {
        ...state,
        formData: {},
        loading: false,
        error: payload?.errors?.at(0),
      };
    default:
      return state;
  }
};
