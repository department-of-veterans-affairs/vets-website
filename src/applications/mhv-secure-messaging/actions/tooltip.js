import { Actions } from '../util/actionTypes';
import {
  hideTooltip,
  createTooltip as createTooltipApi,
  getTooltipsList,
  incrementTooltipCounter,
} from '../api/SmApi';

export const getTooltips = () => async dispatch => {
  try {
    const response = await getTooltipsList();
    dispatch({
      type: Actions.Tooltip.GET_TOOLTIPS,
      response,
    });
    return response;
  } catch (error) {
    dispatch({ type: Actions.Tooltip.GET_TOOLTIPS_ERROR });
    return error;
  }
};

export const createNewTooltip = tooltipName => async dispatch => {
  try {
    const response = await createTooltipApi(tooltipName);
    dispatch({
      type: Actions.Tooltip.CREATE_TOOLTIP,
      response,
    });
    return response;
  } catch (error) {
    dispatch({ type: Actions.Tooltip.CREATE_TOOLTIP_ERROR });
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

export const updateTooltipVisibility = (
  tooltipId,
  tooltipVisibility,
) => async dispatch => {
  try {
    await hideTooltip(tooltipId);
    dispatch({
      type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
      payload: tooltipVisibility,
    });
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR,
      error,
    });
  }
};

export const setTooltip = (tooltipId, tooltipVisibility) => dispatch => {
  dispatch({
    type: Actions.Tooltip.SET_TOOLTIP_ID,
    payload: tooltipId,
  });
  dispatch({
    type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
    payload: tooltipVisibility,
  });
};

export const getTooltipByName = tooltipName => async dispatch => {
  try {
    const tooltips = await dispatch(getTooltips());
    return tooltips?.find?.(t => t.tooltipName === tooltipName);
  } catch (error) {
    return undefined;
  }
};
