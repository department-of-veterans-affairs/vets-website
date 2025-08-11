import { FORM_ACTION_TYPES, QUESTION_ACTION_TYPES } from '../actions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import {
  createFormStore,
  setShortNameValue,
} from '../utilities/answer-storage';
import { ALL_QUESTIONS } from '../constants';

const { ONRAMP_VIEWED_INTRO_PAGE } = FORM_ACTION_TYPES;

export const initialState = {
  allQuestionShortNames: ALL_QUESTIONS,
  form: createFormStore(ALL_QUESTIONS),
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
