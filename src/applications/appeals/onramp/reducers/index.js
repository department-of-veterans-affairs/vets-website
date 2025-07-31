import { ACTION_TYPES } from '../actions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import { createFormStore, updateFormValue } from './utilities';

const { Q_1_1_CLAIM_DECISION } = SHORT_NAME_MAP;
const {
  ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION,
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
    case ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION:
      return updateFormValue(Q_1_1_CLAIM_DECISION, state, action);
    default:
      return state;
  }
};

export default OnrampReducer;
