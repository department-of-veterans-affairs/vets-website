import set from 'lodash/fp/set';

const initialState = {
  enrollmentData: null,
  available: undefined
};

function post911GIBStatus(state = initialState, action) {
  switch (action.type) {
    case 'GET_ENROLLMENT_DATA_SUCCESS':
      return {
        ...state,
        enrollmentData: action.data,
        available: true
      };
    case 'GET_ENROLLMENT_DATA_FAILURE':
      return set('available', false, state);
    default:
      return state;
  }
}

export default {
  post911GIBStatus
};
