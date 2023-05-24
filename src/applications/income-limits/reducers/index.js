import {
  IL_EDIT_MODE,
  IL_UPDATE_DEPENDENTS,
  IL_UPDATE_ZIP,
} from '../constants';

/* eslint-disable camelcase */
const initialState = {
  editMode: false,
  form: {
    dependents: null,
    zipCode: null,
  },
  results: {
    county_name: 'Some County, XX',
    income_year: 2023,
    limits: {
      national_threshold: {
        '0_dependent': 44444,
        '1_dependent': 55555,
        additional_dependents: 6666,
      },
      pension_threshold: {
        '0_dependent': 11111,
        '1_dependent': 22222,
        additional_dependents: 3333,
      },
      gmt_threshold: 77777,
    },
  },
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
    default:
      return state;
  }
};

export default {
  incomeLimits,
};
