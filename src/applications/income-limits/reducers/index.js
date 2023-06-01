import {
  IL_EDIT_MODE,
  IL_UPDATE_DEPENDENTS,
  IL_UPDATE_ZIP,
} from '../constants';

/* eslint-disable camelcase */
// const initialState = {
//   editMode: false,
//   form: {
//     dependents: null,
//     zipCode: null,
//   },
//   results: {
//     county_name: 'Some County, XX',
//     income_year: 2023,
//     limits: {
//       national_threshold: 44444,
//       pension_threshold: 22222,
//       gmt_threshold: 77777,
//     },
//   },
// };

// Non-standard case (GMT < NMT)
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
      national_threshold: 55555,
      pension_threshold: 22222,
      gmt_threshold: 33333,
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
