import {
  QUESTIONNAIRE_LIST_LOADED,
  QUESTIONNAIRE_LIST_LOADING,
} from '../actions';

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
      list.status = { ...list.status, isLoading: true };
      return { ...state, list };
    case QUESTIONNAIRE_LIST_LOADED:
      list.status = { ...list.status, isLoading: false };
      list.questionnaires = { ...action.data };
      return { ...state, list };
    default:
      return state;
  }
};

export default {
  questionnaireListData: questionnaireListReducer,
};
