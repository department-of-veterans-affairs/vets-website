import { TOGGLE_VALUES_SET } from '~/platform/site-wide/feature-toggles/actionTypes';
import { apiRequest } from '~/platform/utilities/api';
import environment from '~/platform/utilities/environment';

// actions
export const VADX_TOGGLES_OVERRIDDEN = 'VADX_TOGGLES_OVERRIDDEN';
export const VADX_TOGGLES_DEFAULT = 'VADX_TOGGLES_DEFAULT';

export const setVadxToggles = toggles => async dispatch => {
  dispatch({
    type: VADX_TOGGLES_OVERRIDDEN,
  });
  dispatch({
    type: TOGGLE_VALUES_SET,
    newToggleValues: toggles,
  });
};

export const restoreDefaultVadxToggles = () => async dispatch => {
  const toggles = await apiRequest(`${environment.API_URL}/v0/feature_toggles`);

  dispatch({
    type: VADX_TOGGLES_DEFAULT,
  });
  dispatch({
    type: TOGGLE_VALUES_SET,
    payload: toggles.data.attributes,
  });
};
