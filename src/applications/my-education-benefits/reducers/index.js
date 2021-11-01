import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
// import set from 'platform/utilities/data/set';

import {
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  // FETCH_MILITARY_INFORMATION_SUCCESS,
  // FETCH_MILITARY_INFORMATION_FAILED,
} from '../actions';

const initialState = {
  formData: {},
  form: {
    data: {},
  },
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  data: (state = initialState, action) => {
    const claimant = action?.response?.data?.claimant || {};

    switch (action.type) {
      case FETCH_PERSONAL_INFORMATION_SUCCESS:
      case FETCH_PERSONAL_INFORMATION_FAILED:
        return {
          ...state,
          // form: {
          //   data: {
          //     userFullName: {
          //       first: claimant.firstName,
          //       middle: claimant.middleName,
          //       last: claimant.lastName,
          //     },
          //   },
          // },
          formData: claimant,
        };
      default:
        return state;
    }
    // fullName: (state = initialState, action) => {
    //   switch (action.type) {
    //     case FETCH_PERSONAL_INFORMATION_SUCCESS:
    //     case FETCH_PERSONAL_INFORMATION_FAILED:
    //       return {
    //         ...state,
    //         first: action.response?.data?.claimant?.firstName,
    //         firstName: action.response?.data?.claimant?.firstName,
    //         fullName: {
    //           firstName: action.response?.data?.claimant?.firstName,
    //         },
    //         'view:userFullName': {
    //           userFullName: {
    //             first: action.response?.data?.claimant?.firstName,
    //             firstName: action.response?.data?.claimant?.firstName,
    //           },
    //         },
    //       };
    //    return set('personalInformation', action.personalInformation, state);
    // } else if (
    //   [
    //     'FETCH_MILITARY_INFORMATION_SUCCESS',
    //     'FETCH_MILITARY_INFORMATION_FAILED',
    //   ].includes(action.type)
    // ) {
    //   return set('militaryInformation', action.militaryInformation, state);
    // }
    //   default:
    //     return state;
    // }
  },
};

// import set from 'platform/utilities/data/set';

// import {
//   // FETCH_HERO_SUCCESS,
//   // FETCH_HERO_FAILED,
//   FETCH_PERSONAL_INFORMATION_SUCCESS,
//   FETCH_PERSONAL_INFORMATION_FAILED,
//   FETCH_MILITARY_INFORMATION_SUCCESS,
//   FETCH_MILITARY_INFORMATION_FAILED,
// } from '~/platform/utilities/actions';

// const initialState = {
//   personalInformation: null,
//   militaryInformation: null,
// };
