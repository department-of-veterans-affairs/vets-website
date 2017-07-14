import set from 'lodash/fp/set';

const initialState = {
  enrollmentData: null,
  availability: 'awaitingResponse'
};

function post911GIBStatus(state = initialState, action) {
  switch (action.type) {
    case 'GET_ENROLLMENT_DATA_SUCCESS':
      return {
        ...state,
        enrollmentData: action.data,
        availability: 'available'
      };
    case 'GET_ENROLLMENT_DATA_FAILURE':
      return set('availability', 'unavailable', state);
    default:
      return state;
  }
}

export default {
  post911GIBStatus
};
