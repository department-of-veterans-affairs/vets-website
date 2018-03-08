import { apiRequest } from '../helpers/api';

export const FETCH_BETA_FEATURES_SUCCESS = 'FETCH_BETA_FEATURES_SUCCESS';
export const BETA_REGISTERING = 'BETA_REGISTERING';
export const BETA_REGISTER_SUCCESS = 'BETA_REGISTER_SUCCESS';
export const BETA_REGISTER_FAILURE = 'BETA_REGISTER_FAILURE';

export const statuses = {
  succeeded: 'succeeded',
  failed: 'failed',
  pending: 'pending'
};

export function getBetaFeatures() {
  // @todo How do we get this information? Can it be included in the user object?
  return { type: FETCH_BETA_FEATURES_SUCCESS, betaFeatures: [] };
}

export function registerBetaToSession(featureName) {
  return dispatch => {
    dispatch({ type: BETA_REGISTERING, featureName });
    setTimeout(() => {
      dispatch({
        type: BETA_REGISTER_SUCCESS,
        status: statuses.succeeded,
        featureName
      });
    }, 500);
  };
}

export function registerBeta(featureName) {
  return dispatch => {
    dispatch({ type: BETA_REGISTERING, featureName });
    const settings = {
      method: 'POST',
    };
    apiRequest(`/beta_registration/${featureName}`,
      settings,
      response => dispatch({
        type: BETA_REGISTER_SUCCESS,
        username: response.user,
        status: statuses.succeeded,
        featureName
      }),
      () => dispatch({
        type: BETA_REGISTER_FAILURE,
        status: statuses.succeeded,
        featureName
      })
    );
  };
}

