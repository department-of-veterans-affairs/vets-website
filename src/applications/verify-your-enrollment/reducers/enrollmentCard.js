/* eslint-disable sonarjs/no-small-switch */

import { TOGGLE_ENROLLMENT_ERROR_STATEMENT } from '../actions';

const initialState = {
  toggleEnrollmentErrorStatement: false,
};

const getEnrollmentCardReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_ENROLLMENT_ERROR_STATEMENT:
      return {
        ...state,
        toggleEnrollmentErrorStatement: !state.toggleEnrollmentErrorStatement,
      };
    default:
      return state;
  }
};

export default getEnrollmentCardReducer;
