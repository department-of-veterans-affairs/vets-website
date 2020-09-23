import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import {
  QUESTIONNAIRE_APPOINTMENT_LOADING,
  QUESTIONNAIRE_APPOINTMENT_LOADED,
} from '../actions';

const initialState = {
  context: {
    status: {},
    appointment: {},
  },
};

const questionnaireReducer = (state = initialState, action) => {
  const { context } = state;
  // console.log('in my reducer', { state, context, action });
  switch (action.type) {
    case QUESTIONNAIRE_APPOINTMENT_LOADING:
      context.status = { ...context.status, isLoading: true };
      return { ...state, context };
    case QUESTIONNAIRE_APPOINTMENT_LOADED:
      context.status = { ...context.status, isLoading: false };
      context.appointment = { ...action.appointment };
      return { ...state, context };
    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  questionnaireData: questionnaireReducer,
};
