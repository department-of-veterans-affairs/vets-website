const initialState = {
  appointments: [],
  veteranData: {
    demographics: {},
    address: '',
  },
  context: {},
  form: {
    pages: [],
    data: {},
  },
  app: '',
  error: '',
};

import {
  SET_VETERAN_DATA,
  UPDATE_PRE_CHECK_IN_FORM,
} from '../actions/pre-check-in';

import { recordAnswerHandler, setVeteranDataHandler } from './pre-check-in';

import {
  RECEIVED_APPOINTMENT_DETAILS,
  RECEIVED_DEMOGRAPHICS_DATA,
  TRIGGER_REFRESH,
  SEE_STAFF_MESSAGE_UPDATED,
  UPDATE_DAY_OF_CHECK_IN_FORM,
  ADDITIONAL_CONTEXT,
} from '../actions/day-of';

import {
  receivedAppointmentDetailsHandler,
  receivedDemographicsDataHandler,
  triggerRefreshHandler,
  seeStaffMessageUpdatedHandler,
  additionalContextHandler,
} from './day-of';

import {
  RECEIVED_TRAVEL_DATA,
  SET_FILTERED_APPOINTMENTS,
  SET_FACILITY_TO_FILE,
} from '../actions/travel-claim';

import {
  receivedTravelDataHandler,
  setFilteredAppointmentsHandler,
  setFacilityToFileHandler,
} from './travel-claim';

import { setAppHandler, setErrorHandler, setFormHandler } from './universal';

import { INIT_FORM } from '../actions/navigation';

import { initFormHandler, updateFormHandler } from './navigation';

import { SET_SESSION } from '../actions/authentication';

import { setSessionHandler } from './authentication';

import {
  SET_APP,
  RECORD_ANSWER,
  SET_ERROR,
  SET_FORM,
} from '../actions/universal';

const handler = Object.freeze({
  [INIT_FORM]: initFormHandler,
  [SET_SESSION]: setSessionHandler,
  [RECORD_ANSWER]: recordAnswerHandler,
  [SET_VETERAN_DATA]: setVeteranDataHandler,
  [RECEIVED_APPOINTMENT_DETAILS]: receivedAppointmentDetailsHandler,
  [RECEIVED_DEMOGRAPHICS_DATA]: receivedDemographicsDataHandler,
  [TRIGGER_REFRESH]: triggerRefreshHandler,
  [SEE_STAFF_MESSAGE_UPDATED]: seeStaffMessageUpdatedHandler,
  [UPDATE_PRE_CHECK_IN_FORM]: updateFormHandler,
  [UPDATE_DAY_OF_CHECK_IN_FORM]: updateFormHandler,
  [SET_APP]: setAppHandler,
  [SET_ERROR]: setErrorHandler,
  [SET_FORM]: setFormHandler,
  [ADDITIONAL_CONTEXT]: additionalContextHandler,
  [RECEIVED_TRAVEL_DATA]: receivedTravelDataHandler,
  [SET_FILTERED_APPOINTMENTS]: setFilteredAppointmentsHandler,
  [SET_FACILITY_TO_FILE]: setFacilityToFileHandler,

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
