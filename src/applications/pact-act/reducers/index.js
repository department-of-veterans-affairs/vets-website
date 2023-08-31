import {
  PAW_UPDATE_BURN_PIT_210,
  PAW_UPDATE_SERVICE_PERIOD,
  PAW_VIEWED_RESULTS_PAGE_1,
} from '../constants';
import { SHORT_NAME_MAP } from '../utilities/question-data-map';

const formValues = () => {
  const storeObject = {};

  for (const question of Object.keys(SHORT_NAME_MAP)) {
    storeObject[question] = null;
  }

  return storeObject;
};

const initialState = {
  form: formValues(),
  viewedResultsPage1: false,
};

const pactAct = (state = initialState, action) => {
  switch (action.type) {
    case PAW_UPDATE_BURN_PIT_210:
      return {
        ...state,
        form: {
          ...state.form,
          BURN_PIT_210: action.payload,
        },
      };
    case PAW_UPDATE_SERVICE_PERIOD:
      return {
        ...state,
        form: {
          ...state.form,
          SERVICE_PERIOD: action.payload,
        },
      };
    case PAW_VIEWED_RESULTS_PAGE_1:
      return {
        ...state,
        viewedResultsPage1: action.payload,
      };
    default:
      return state;
  }
};

export default {
  pactAct,
};
