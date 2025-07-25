import { ACTION_TYPES } from '../actions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import { createFormStore, updateFormValue } from './utilities';

const { CLAIM_DECISION_1_1 } = SHORT_NAME_MAP;
const {
  ONRAMP_UPDATE_CLAIM_DECISION_1_1,
  ONRAMP_VIEWED_INTRO_PAGE,
} = ACTION_TYPES;

const initialState = {
  form: createFormStore(SHORT_NAME_MAP),
  viewedIntroPage: false,
};

const OnrampReducer = (state = initialState, action) => {
  switch (action.type) {
    case ONRAMP_VIEWED_INTRO_PAGE:
      return {
        ...state,
        viewedIntroPage: action.payload,
      };
    case ONRAMP_UPDATE_CLAIM_DECISION_1_1:
      return updateFormValue(CLAIM_DECISION_1_1, state, action);
    default:
      return state;
  }
};

export default OnrampReducer;
