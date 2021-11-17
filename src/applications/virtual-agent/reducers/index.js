const initialState = {
  termsAccepted: false,
};

import { ACCEPTED } from '../actions';

const virtualAgentReducer = (state = initialState, action) => {
  if (action.type === ACCEPTED) {
    return {
      ...state,
      termsAccepted: true,
    };
  } else {
    return {
      ...state,
    };
  }
};

export default {
  virtualAgentData: virtualAgentReducer,
};
