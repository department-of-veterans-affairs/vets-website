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
} from '../pre-check-in/actions';

import { GO_TO_NEXT_PAGE, INIT_FORM } from '../actions';

import {
  gotToNextPageHandler,
  initFormHander,
  recordAnswerHandler,
  setSessionHandler,
  setVeteranDataHandler,
} from './pre-check-in';

const handler = {
  [INIT_FORM]: initFormHander,
  [SET_SESSION]: setSessionHandler,
  [GO_TO_NEXT_PAGE]: gotToNextPageHandler,
  [RECORD_ANSWER]: recordAnswerHandler,
  [SET_VETERAN_DATA]: setVeteranDataHandler,

  default: state => {
    return { ...state };
  },
};

const preCheckInReducer = (state = initialState, action) => {
  // console.log('handling action: ', action.type, { action });
  if (handler[action.type]) {
    return handler[action.type](state, action);
  }
  return handler.default(state, action);
};

export default {
  checkInData: preCheckInReducer,
};
