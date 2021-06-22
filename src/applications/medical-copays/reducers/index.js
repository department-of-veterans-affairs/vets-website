import { SOME_ACTION, ANOTHER_ACTION } from '../actions';

const initialState = {
  pending: false,
};

const medicalCopays = (state = initialState, action) => {
  switch (action.type) {
    case SOME_ACTION:
      return {
        ...state,
        pending: true,
      };
    case ANOTHER_ACTION:
      return {
        ...state,
        pending: false,
      };
    default:
      return state;
  }
};

export default {
  medicalCopays,
};
