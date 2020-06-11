import { apiRequest } from 'platform/utilities/api';

export * from 'platform/user/profile/actions';

import environment from 'platform/utilities/environment';

export const LOADING_CONNECTED_APPS = 'connected-apps/LOADING_CONNECTED_APPS';
export const FINISHED_LOADING_CONNECTED_APPS =
  'connected-apps/FINISHED_LOADING_CONNECTED_APPS';
export const ERROR_LOADING_CONNECTED_APPS =
  'connected-apps/ERROR_LOADING_CONNECTED_APPS';
export const DELETING_CONNECTED_APP = 'connected-apps/DELETING_CONNECTED_APP';
export const ERROR_DELETING_CONNECTED_APP =
  'connected-apps/ERROR_DELETING_CONNECTED_APP';
export const FINISHED_DELETING_CONNECTED_APP =
  'connected-apps/FINISHED_DELETING_CONNECTED_APP';
export const DELETED_APP_ALERT_DISMISSED =
  'connected-apps/DELETED_APP_ALERT_DISMISSED';

const grantsUrl = '/profile/connected_applications';

import { mockConnectedApps } from 'applications/personalization/profile360/util/connected-apps.js';

export function loadConnectedApps(mockRequest) {
  return async dispatch => {
    dispatch({ type: LOADING_CONNECTED_APPS });

    // Locally we cannot call the endpoint
    if (environment.isLocalhost() || mockRequest) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({
        type: FINISHED_LOADING_CONNECTED_APPS,
        data: mockConnectedApps,
      });
      return;
    }

    apiRequest(grantsUrl)
      .then(({ data }) =>
        dispatch({ type: FINISHED_LOADING_CONNECTED_APPS, data }),
      )
      .catch(({ errors }) =>
        dispatch({ type: ERROR_LOADING_CONNECTED_APPS, errors }),
      );
  };
}

export function deleteConnectedApp(appId, mockRequest) {
  return async dispatch => {
    dispatch({ type: DELETING_CONNECTED_APP, appId });

    // Locally we cannot call the endpoint
    if (environment.isLocalhost() || mockRequest) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({ type: FINISHED_DELETING_CONNECTED_APP, appId });
      return;
    }

    apiRequest(`${grantsUrl}/${appId}`, { method: 'DELETE' })
      .then(() => dispatch({ type: FINISHED_DELETING_CONNECTED_APP, appId }))
      .catch(({ errors }) =>
        dispatch({ type: ERROR_DELETING_CONNECTED_APP, appId, errors }),
      );
  };
}

export function dismissDeletedAppAlert(appId) {
  return async dispatch =>
    dispatch({ type: DELETED_APP_ALERT_DISMISSED, appId });
}
