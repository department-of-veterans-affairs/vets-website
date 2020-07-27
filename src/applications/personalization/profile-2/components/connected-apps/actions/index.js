export * from 'platform/user/profile/actions';
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { mockConnectedApps } from 'applications/personalization/profile360/util/connected-apps.js';
import { isEmpty } from 'lodash';

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

export function loadConnectedApps() {
  return async dispatch => {
    dispatch({ type: LOADING_CONNECTED_APPS });

    // Locally we cannot call the endpoint
    if (environment.isLocalhost()) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({
        type: FINISHED_LOADING_CONNECTED_APPS,
        data: mockConnectedApps,
      });
      return;
    }

    await apiRequest(grantsUrl)
      .then(({ data }) => {
        const deletedApps = data ? data.filter(app => app.deleted) : [];
        const hasConnectedApps = data && deletedApps?.length !== data?.length;

        recordEvent({
          event: 'profile-get-connected-apps-retrieved',
          'user-has-connected-apps': hasConnectedApps,
        });
        dispatch({ type: FINISHED_LOADING_CONNECTED_APPS, data });
      })
      .catch(({ errors }) => {
        recordEvent({ event: 'profile-get-connected-apps-failure' });
        dispatch({ type: ERROR_LOADING_CONNECTED_APPS, errors });
      });
  };
}

export function deleteConnectedApp(appId) {
  return async (dispatch, getState) => {
    dispatch({ type: DELETING_CONNECTED_APP, appId });

    // Locally we cannot call the endpoint
    if (environment.isLocalhost()) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({ type: FINISHED_DELETING_CONNECTED_APP, appId });
      return;
    }

    await apiRequest(`${grantsUrl}/${appId}`, { method: 'DELETE' })
      .then(() => {
        const { connectedApps } = getState();
        const apps = connectedApps?.apps;
        const activeApps = apps ? apps.filter(app => !app.deleted) : [];
        const deletingLastApp =
          activeApps?.length === 1 && activeApps[0].deleting;
        const hasConnectedApps = activeApps?.length && !deletingLastApp;

        recordEvent({
          event: 'profile-navigation',
          'profile-action': 'disconnect-button',
          'profile-section': 'connected-accounts',
          'user-has-connected-apps': hasConnectedApps,
        });
        dispatch({ type: FINISHED_DELETING_CONNECTED_APP, appId });
      })
      .catch(({ errors }) =>
        dispatch({ type: ERROR_DELETING_CONNECTED_APP, appId, errors }),
      );
  };
}

export function dismissDeletedAppAlert(appId) {
  return async dispatch =>
    dispatch({ type: DELETED_APP_ALERT_DISMISSED, appId });
}
