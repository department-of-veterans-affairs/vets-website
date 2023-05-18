const initialState = {
  termsAccepted: false,
  termsAcceptedSkill: false,
  currentSkillName: 'Barista',
};

import { ACCEPTED, ACCEPTED_SKILL } from '../actions';

const virtualAgentReducer = (state = initialState, action) => {
  if (action.type === ACCEPTED) {
    return {
      ...state,
      termsAccepted: true,
    };
  }

  if (action.type === ACCEPTED_SKILL) {
    return { ...state, termsAccepted: true, termsAcceptedSkill: true };
  }

  return {
    ...state,
  };
};

export default {
  virtualAgentData: virtualAgentReducer,
};
