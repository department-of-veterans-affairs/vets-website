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
      context.appointment = { ...action.appointment };
      context.questionnaire = { id: 'testing-id-123' };
      return { ...state, context };

    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  questionnaireData: questionnaireReducer,
};
