const initialState = {
  appointments: [],
  veteranData: {
    demographics: {},
  },
  context: {},
  form: {
    pages: [],
    currentPage: '',
    data: {},
  },
};

import {
  INIT_FORM,
  GO_TO_NEXT_PAGE,
  SET_SESSION,
  RECORD_ANSWER,
} from '../actions';

const preCheckInReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage,
        },
      };
    case SET_SESSION:
      return {
        ...state,
        context: {
          ...state.context,
          token: action.payload.token,
          permissions: action.payload.permissions,
        },
      };
    case GO_TO_NEXT_PAGE:
      return {
        ...state,
        form: { ...state.form, currentPage: action.payload.nextPage },
      };
    case RECORD_ANSWER: {
      const data = { ...state.form.data, ...action.payload };
      return {
        ...state,
        form: { ...state.form, data },
      };
    }
    default:
      return { ...state };
  }
};

export default {
  preCheckInData: preCheckInReducer,
};
