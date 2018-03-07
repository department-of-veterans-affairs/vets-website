import { apiRequest } from '../helpers/api';

export const FETCH_BETA_FEATURES_SUCCESS = 'FETCH_BETA_FEATURES_SUCCESS';
export const BETA_REGISTERING = 'BETA_REGISTERING';
export const BETA_REGISTER_SUCCESS = 'BETA_REGISTER_SUCCESS';
export const BETA_REGISTER_FAILURE = 'BETA_REGISTER_FAILURE';

export const betaFeatures = {
  healthAccount: 'health_account',
  veteranIdCard: 'veteran_id_card',
  personalization: 'personalization'
};

export function getBetaFeatures() {
  return { type: FETCH_BETA_FEATURES_SUCCESS, betaFeatures: [] };
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
        status: 'succeeded',
        featureName
      }),
      () => dispatch({
        type: BETA_REGISTER_FAILURE,
        status: 'failed',
        featureName
      })
    );
  };
}

