import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * Tooltip visibility, visible by default
   * @type {boolean}
   */
  tooltipVisible: false,
  /**
   * Store the tooltip ID for updates
   * @type {boolean}
   */
  tooltipId: undefined,
  /**
   * tooltip error
   */
  error: undefined,
};

export const inProductEducationReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Tooltip.HIDE_TOOLTIP:
      return { ...state, tooltipVisible: false, error: null };
    case Actions.Tooltip.SET_TOOLTIP_ID:
      return { ...state, tooltipId: action.tooltipId, error: null };
    case Actions.Tooltip.SHOW_TOOLTIP:
      return {
        ...state,
        tooltipVisible: true,
        tooltipId: action.tooltipId,
        error: null,
      };
    case Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR:
    case Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
