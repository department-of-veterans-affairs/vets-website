import {
  IL_EDIT_MODE,
  IL_UPDATE_DEPENDENTS,
  IL_PAST_MODE,
  IL_UPDATE_RESULTS,
  IL_UPDATE_YEAR,
  IL_UPDATE_ZIP,
} from '../constants';

const initialState = {
  editMode: false,
  form: {
    dependents: null,
    year: null,
    zipCode: null,
  },
  pastMode: false,
  results: null,
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
    case IL_UPDATE_RESULTS: {
      return {
        ...state,
        results: action.payload,
      };
    }
    default:
      return state;
  }
};

export default {
  incomeLimits,
};
