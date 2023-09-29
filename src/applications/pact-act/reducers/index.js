import {
  PAW_UPDATE_ORANGE_2_2_A,
  PAW_UPDATE_ORANGE_2_2_B,
  PAW_UPDATE_ORANGE_2_2_1_A,
  PAW_UPDATE_ORANGE_2_2_1_B,
  PAW_UPDATE_ORANGE_2_2_2,
  PAW_UPDATE_ORANGE_2_2_3,
  PAW_UPDATE_BURN_PIT_2_1,
  PAW_UPDATE_BURN_PIT_2_1_1,
  PAW_UPDATE_BURN_PIT_2_1_2,
  PAW_UPDATE_FORM_STORE,
  PAW_UPDATE_SERVICE_PERIOD,
  PAW_VIEWED_INTRO_PAGE,
  PAW_VIEWED_RESULTS_PAGE_1,
} from '../constants';
import { SHORT_NAME_MAP } from '../utilities/question-data-map';
import { createFormStore, updateFormValue } from './utilities';

const {
  BURN_PIT_2_1,
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  ORANGE_2_2_1_A,
  ORANGE_2_2_1_B,
  ORANGE_2_2_2,
  ORANGE_2_2_3,
  ORANGE_2_2_A,
  ORANGE_2_2_B,
  SERVICE_PERIOD,
} = SHORT_NAME_MAP;

const initialState = {
  form: createFormStore(SHORT_NAME_MAP),
  viewedIntroPage: false,
  viewedResultsPage1: false,
};

const pactAct = (state = initialState, action) => {
  switch (action.type) {
    case PAW_UPDATE_ORANGE_2_2_A:
      return updateFormValue(ORANGE_2_2_A, false, state, action);
    case PAW_UPDATE_ORANGE_2_2_B:
      return updateFormValue(ORANGE_2_2_B, true, state, action);
    case PAW_UPDATE_ORANGE_2_2_1_A:
      return updateFormValue(ORANGE_2_2_1_A, false, state, action);
    case PAW_UPDATE_ORANGE_2_2_1_B:
      return updateFormValue(ORANGE_2_2_1_B, true, state, action);
    case PAW_UPDATE_ORANGE_2_2_2:
      return updateFormValue(ORANGE_2_2_2, false, state, action);
    case PAW_UPDATE_ORANGE_2_2_3:
      return updateFormValue(ORANGE_2_2_3, false, state, action);
    case PAW_UPDATE_BURN_PIT_2_1:
      return updateFormValue(BURN_PIT_2_1, false, state, action);
    case PAW_UPDATE_BURN_PIT_2_1_1:
      return updateFormValue(BURN_PIT_2_1_1, false, state, action);
    case PAW_UPDATE_BURN_PIT_2_1_2:
      return updateFormValue(BURN_PIT_2_1_2, false, state, action);
    case PAW_UPDATE_SERVICE_PERIOD:
      return updateFormValue(SERVICE_PERIOD, false, state, action);
    case PAW_VIEWED_INTRO_PAGE:
      return {
        ...state,
        viewedIntroPage: action.payload,
      };
    case PAW_VIEWED_RESULTS_PAGE_1:
      return {
        ...state,
        viewedResultsPage1: action.payload,
      };
    case PAW_UPDATE_FORM_STORE:
      return {
        ...state,
        form: {
          ...state.form,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default {
  pactAct,
};
