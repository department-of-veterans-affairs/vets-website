import set from 'lodash/fp/set';

import { GET_ENROLLMENT_DATA_SUCCESS } from '../utils/constants';

const initialState = {
  enrollmentData: null,
};

function post911GIBStatus(state = initialState, action) {
  if (action.type === GET_ENROLLMENT_DATA_SUCCESS) {
    return {
      ...state,
      enrollmentData: action.data,
    };
  }

  return state;
}

export default {
  post911GIBStatus,
};
