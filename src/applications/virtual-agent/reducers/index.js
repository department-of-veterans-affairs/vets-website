export const ACCEPTED = 'ACCEPTED';

const initialState = {
  termsAccepted: false,
};

const virtualAgentReducer = (state = initialState, action) => {
  if (action.type === ACCEPTED) {
    return {
      ...state,
      termsAccepted: true,
    };
  }
  return {
    ...state,
  };
};

export default {
  virtualAgentData: virtualAgentReducer,
};
