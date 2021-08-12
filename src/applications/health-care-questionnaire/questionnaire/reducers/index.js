import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import {
  QUESTIONNAIRE_APPOINTMENT_LOADING,
  QUESTIONNAIRE_APPOINTMENT_LOADED,
} from '../actions';

const initialState = {
  context: {
    questionnaire: {},
    status: {},
    appointment: {},
    location: {},
    organization: {},
  },
};

const questionnaireReducer = (state = initialState, action) => {
  const { context } = state;
  switch (action.type) {
    case QUESTIONNAIRE_APPOINTMENT_LOADING:
      context.status = { ...context.status, isLoading: true };
      return { ...state, context };
    case QUESTIONNAIRE_APPOINTMENT_LOADED:
      context.status = { ...context.status, isLoading: false };
      context.appointment = { ...action.payload?.appointment };
      if (action.payload?.questionnaire) {
        context.questionnaire = [...action.payload?.questionnaire];
      }
      context.location = { ...action.payload?.location };
      context.organization = { ...action.payload?.organization };
      return { ...state, context };

    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  questionnaireData: questionnaireReducer,
};
