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
  RECORD_ANSWER,
  SET_SESSION,
  SET_VETERAN_DATA,
  UPDATE_FORM,
} from '../actions';

import { GO_TO_NEXT_PAGE, INIT_FORM } from '../../actions';

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
    case SET_VETERAN_DATA: {
      return {
        ...state,
        appointments: action.payload.appointments,
        veteranData: { demographics: action.payload.demographics },
      };
    }
    case UPDATE_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          pages: action.payload.pages,
        },
      };
    default:
      return { ...state };
  }
};

export default {
  checkInData: preCheckInReducer,
};
