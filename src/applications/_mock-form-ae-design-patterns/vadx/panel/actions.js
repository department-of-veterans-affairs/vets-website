import { TOGGLE_VALUES_SET } from '~/platform/site-wide/feature-toggles/actionTypes';
import { apiRequest } from '~/platform/utilities/api';
import environment from '~/platform/utilities/environment';

// actions
export const POWERTOOLS_TOGGLES_OVERRIDDEN = 'POWERTOOLS_TOGGLES_OVERRIDDEN';
export const POWERTOOLS_TOGGLES_DEFAULT = 'POWERTOOLS_TOGGLES_DEFAULT';

export const setPowerToolsToggles = toggles => async dispatch => {
  dispatch({
    type: POWERTOOLS_TOGGLES_OVERRIDDEN,
  });
  dispatch({
    type: TOGGLE_VALUES_SET,
    newToggleValues: toggles,
  });
};

export const restoreDefaultPowerToolsToggles = () => async dispatch => {
  const toggles = await apiRequest(`${environment.API_URL}/v0/feature_toggles`);

  dispatch({
    type: POWERTOOLS_TOGGLES_DEFAULT,
  });
  dispatch({
    type: TOGGLE_VALUES_SET,
    payload: toggles.data.attributes,
  });
};
