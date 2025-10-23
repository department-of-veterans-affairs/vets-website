import { Actions } from '../util/actionTypes';
import {
  apiHideTooltip,
  createTooltip,
  getTooltipsList,
  incrementTooltipCounter,
} from '../api/rxApi';
import { tooltipNames } from '../util/constants';

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

export const updateTooltipVisibility = (
  tooltipId,
  tooltipVisibility,
) => async dispatch => {
  try {
    await apiHideTooltip(tooltipId);
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

export const setTooltip = (tooltipId, tooltipVisibility) => {
  return dispatch => {
    dispatch({
      type: Actions.Tooltip.SET_TOOLTIP_ID,
      payload: tooltipId,
    });
    dispatch({
      type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
      payload: tooltipVisibility,
    });
  };
};

export const getTooltip = () => async dispatch => {
  try {
    const tooltips = await dispatch(getTooltips());

    return tooltips?.find(
      tooltip =>
        tooltip.tooltipName ===
        tooltipNames.mhvMedicationsTooltipFilterAccordion,
    );
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.GET_TOOLTIP_ERROR,
      error,
    });
    return error;
  }
};
