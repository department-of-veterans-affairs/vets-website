import {
  QUESTIONNAIRE_LIST_LOADED,
  QUESTIONNAIRE_LIST_LOADING,
  QUESTIONNAIRE_LIST_LOADED_WITH_ERROR,
} from '../actions';

import formConfig from '../answer-questions/config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

const initialState = {
  list: {
    status: {},
    questionnaires: {},
  },
};

const questionnaireListReducer = (state = initialState, action) => {
  const { list } = state;
  switch (action.type) {
    case QUESTIONNAIRE_LIST_LOADING:
      list.status = {
        ...list.status,
        isLoading: true,
        apiReturnedError: false,
      };
      return { ...state, list };
    case QUESTIONNAIRE_LIST_LOADED:
      list.status = {
        ...list.status,
        isLoading: false,
        apiReturnedError: false,
      };
      list.questionnaires = { ...action.data };
      return { ...state, list };
    case QUESTIONNAIRE_LIST_LOADED_WITH_ERROR:
      list.status = {
        ...list.status,
        isLoading: false,
        apiReturnedError: true,
      };
      return { ...state, list };
    default:
      return state;
  }
};

export default {
  questionnaireListData: questionnaireListReducer,
  form: createSaveInProgressFormReducer(formConfig),
};
