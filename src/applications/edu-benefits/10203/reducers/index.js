import { GET_REMAINING_ENTITLEMENT_SUCCESS } from '../utils/constants';

const initialState = {
  enrollmentData: null,
};

function post911GIBStatus(state = initialState, action) {
  if (action.type === GET_REMAINING_ENTITLEMENT_SUCCESS) {
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
