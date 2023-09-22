import {
  IL_EDIT_MODE,
  IL_UPDATE_DEPENDENTS,
  IL_PAST_MODE,
  IL_RESULTS_VAL_ERROR,
  IL_RESULTS_VAL_ERROR_TEXT,
  IL_UPDATE_RESULTS,
  IL_UPDATE_YEAR,
  IL_UPDATE_ZIP,
  IL_ZIP_VAL_ERROR,
} from '../constants';

const initialState = {
  editMode: false,
  form: {
    dependents: null,
    year: null,
    zipCode: null,
  },
  pastMode: null,
  results: null,
  resultsValidationServiceError: false,
  zipValidationServiceError: false,
};

const incomeLimits = (state = initialState, action) => {
  switch (action.type) {
    case IL_UPDATE_DEPENDENTS:
      return {
        ...state,
        form: {
          ...state.form,
          dependents: action.payload,
        },
      };
    case IL_UPDATE_YEAR:
      return {
        ...state,
        form: {
          ...state.form,
          year: action.payload,
        },
      };
    case IL_UPDATE_ZIP:
      return {
        ...state,
        form: {
          ...state.form,
          zipCode: action.payload,
        },
      };
    case IL_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload,
      };
    case IL_PAST_MODE:
      return {
        ...state,
        pastMode: action.payload,
      };
    case IL_UPDATE_RESULTS:
      return {
        ...state,
        results: action.payload,
      };
    case IL_ZIP_VAL_ERROR:
      return {
        ...state,
        zipValidationServiceError: action.payload,
      };
    case IL_RESULTS_VAL_ERROR:
      return {
        ...state,
        resultsValidationServiceError: action.payload,
      };
    case IL_RESULTS_VAL_ERROR_TEXT:
      return {
        ...state,
        resultsValidationErrorText: action.payload,
      };
    default:
      return state;
  }
};

export default {
  incomeLimits,
};
