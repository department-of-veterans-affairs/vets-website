import { Actions } from '../util/actionTypes';

const initialState = {
  tooltipVisible: false,
  tooltipId: undefined,
  error: undefined,
};

export const tooltipReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Tooltip.SET_TOOLTIP_ID:
      return { ...state, tooltipId: action.payload, error: null };
    case Actions.Tooltip.SET_TOOLTIP_VISIBILITY:
      return { ...state, tooltipVisible: action.payload, error: null };
    case Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR:
    case Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
