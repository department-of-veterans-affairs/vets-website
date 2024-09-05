import { OMB_INFO_LOADED } from '../actions/ombInfo';

export const initialState = {
  expDate: null,
  ombNumber: null,
  resBurden: null,
};

export default (state = initialState, action) => {
  if (action?.type === OMB_INFO_LOADED) {
    return { ...state, ...action.payload.ombInfo };
  }

  return state;
};
