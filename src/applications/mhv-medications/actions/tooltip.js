import { Actions } from '../util/actionTypes';
import {
  apiHideTooltip,
  createTooltip,
  getTooltipsList,
  incrementTooltipCounter,
} from '../api/rxApi';

export const getTooltips = () => async dispatch => {
  try {
    const response = await getTooltipsList();
    dispatch({
      type: Actions.Tooltip.GET_TOOLTIPS,
      response,
    });
    return response;
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.GET_TOOLTIPS_ERROR,
    });
    return error;
  }
};

export const createNewTooltip = () => async dispatch => {
  try {
    const response = await createTooltip();
    dispatch({
      type: Actions.Tooltip.CREATE_TOOLTIP,
      response,
    });
    return response;
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.CREATE_TOOLTIP_ERROR,
    });
    return error;
  }
};

export const incrementTooltip = tooltipId => async dispatch => {
  try {
    await incrementTooltipCounter(tooltipId);
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR,
      error,
    });
  }
};

export const updateTooltipVisibility = tooltipId => async dispatch => {
  try {
    await apiHideTooltip(tooltipId);
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR,
      error,
    });
  }
};

export const hideTooltip = () => {
  return {
    type: Actions.Tooltip.HIDE_TOOLTIP,
  };
};
