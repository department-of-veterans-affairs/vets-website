import { Actions } from '../util/actionTypes';

const initialState = {
  isPilot: false,
};

export const appReducer = (state = initialState, action) => {
  if (action.type === Actions.App.IS_PILOT) {
    return {
      isPilot: true,
    };
  }
  return state;
};
