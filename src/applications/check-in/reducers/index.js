const initialState = {
  appointments: [],
  veteranData: {
    demographics: {},
  },
  context: {},
  form: {
    pages: [],
    data: {},
  },
  app: '',
};

import {
  RECORD_ANSWER,
  SET_VETERAN_DATA,
  UPDATE_PRE_CHECK_IN_FORM,
} from '../actions/pre-check-in';

import { recordAnswerHandler, setVeteranDataHandler } from './pre-check-in';

import {
  APPOINTMENT_WAS_CHECKED_INTO,
  RECEIVED_APPOINTMENT_DETAILS,
  RECEIVED_DEMOGRAPHICS_DATA,
  TRIGGER_REFRESH,
  SEE_STAFF_MESSAGE_UPDATED,
  UPDATE_DAY_OF_CHECK_IN_FORM,
} from '../actions/day-of';

import {
  appointmentWasCheckedIntoHandler,
  receivedAppointmentDetailsHandler,
  receivedDemographicsDataHandler,
  triggerRefreshHandler,
  seeStaffMessageUpdatedHandler,
} from './day-of';

import { setAppHandler } from './universal';

import { INIT_FORM } from '../actions/navigation';

import { initFormHandler, updateFormHandler } from './navigation';

import { SET_SESSION } from '../actions/authentication';

import { setSessionHandler } from './authentication';

import { SET_APP } from '../actions/universal/index.js';

const handler = Object.freeze({
  [INIT_FORM]: initFormHandler,
  [SET_SESSION]: setSessionHandler,
  [RECORD_ANSWER]: recordAnswerHandler,
  [SET_VETERAN_DATA]: setVeteranDataHandler,
  [APPOINTMENT_WAS_CHECKED_INTO]: appointmentWasCheckedIntoHandler,
  [RECEIVED_APPOINTMENT_DETAILS]: receivedAppointmentDetailsHandler,
  [RECEIVED_DEMOGRAPHICS_DATA]: receivedDemographicsDataHandler,
  [TRIGGER_REFRESH]: triggerRefreshHandler,
  [SEE_STAFF_MESSAGE_UPDATED]: seeStaffMessageUpdatedHandler,
  [UPDATE_PRE_CHECK_IN_FORM]: updateFormHandler,
  [UPDATE_DAY_OF_CHECK_IN_FORM]: updateFormHandler,
  [SET_APP]: setAppHandler,

  default: state => {
    return { ...state };
  },
});

const checkInReducer = (state = initialState, action) => {
  // console.log('handling action: ', action.type, { action });
  if (handler[action.type]) {
    return handler[action.type](state, action);
  }
  return handler.default(state, action);
};

export default {
  checkInData: checkInReducer,
};
