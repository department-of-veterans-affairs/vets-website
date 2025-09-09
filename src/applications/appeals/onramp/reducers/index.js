import { FORM_ACTION_TYPES, QUESTION_ACTION_TYPES } from '../actions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import {
  createFormStore,
  setShortNameValue,
} from '../utilities/answer-storage';
import { ALL_QUESTIONS, ALL_RESULTS } from '../constants';

const {
  ONRAMP_UPDATE_FORM_STORE,
  ONRAMP_VIEWED_INTRO_PAGE,
} = FORM_ACTION_TYPES;

export const initialState = {
  allQuestionShortNames: ALL_QUESTIONS,
  allResultsShortNames: ALL_RESULTS,
  form: createFormStore(ALL_QUESTIONS),
  resultPage: null,
  viewedIntroPage: false,
};

const decisionReviewsGuide = (state = initialState, action) => {
  if (!action || !action.type || !action?.type?.startsWith('ONRAMP')) {
    return state;
  }

  if (action.type === ONRAMP_VIEWED_INTRO_PAGE) {
    return {
      ...state,
      viewedIntroPage: action.payload,
    };
  }

  if (action.type === ONRAMP_UPDATE_FORM_STORE) {
    return {
      ...state,
      form: {
        ...state.form,
        ...action.payload,
      },
    };
  }

  if (action.type === FORM_ACTION_TYPES.ONRAMP_UPDATE_RESULTS_PAGE) {
    return {
      ...state,
      resultPage: action.payload,
    };
  }

  let newState = state;

  for (const actionType of Object.values(QUESTION_ACTION_TYPES)) {
    if (action.type === actionType) {
      const SHORT_NAME = action.type.replace('ONRAMP_UPDATE_', '');

      newState = setShortNameValue(
        SHORT_NAME_MAP[SHORT_NAME],
        state,
        action.payload,
      );
    }
  }

  return newState;
};

export default {
  decisionReviewsGuide,
};
