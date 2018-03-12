import { apiRequest } from '../helpers/api';

export const REGISTERING_SERVICE = 'REGISTERING_SERVICE';
export const REGISTER_SERVICE = 'REGISTER_SERVICE';

const betaOverride = !!window.localStorage.BETA_OVERRIDE;

export function isUserRegisteredForBeta(service) {
  return (dispatch, getState) => {
    if (betaOverride) return true;

    const { user } = getState();
    return user.profile.services.includes(service);
  };
}

export function registerBeta(service) {
  return dispatch => {
    dispatch({ type: REGISTERING_SERVICE, service });

    const settings = {
      method: 'POST',
    };

    apiRequest(`/beta_registration/${service}`, settings)
      .then(() => dispatch({ type: REGISTER_SERVICE, service }));
  };
}

