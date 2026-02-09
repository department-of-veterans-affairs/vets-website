export * from 'platform/user/profile/actions';
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

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
    recordEvent({ event: 'profile-get-connected-apps-started' });
    dispatch({ type: LOADING_CONNECTED_APPS });

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
        recordEvent({ event: 'profile-get-connected-apps-failed' });
        dispatch({ type: ERROR_LOADING_CONNECTED_APPS, errors });
      });
  };
}

export function deleteConnectedApp(appId) {
  return async (dispatch, getState) => {
    recordEvent({ event: 'profile-disconnect-connected-app-started' });
    dispatch({ type: DELETING_CONNECTED_APP, appId });

    await apiRequest(`${grantsUrl}/${appId}`, { method: 'DELETE' })
      .then(() => {
        const { connectedApps } = getState();
        const apps = connectedApps?.apps;
        const activeApps = apps ? apps.filter(app => !app.deleted) : [];
        const deletingLastApp =
          activeApps?.length === 1 && activeApps[0].deleting;
        const hasConnectedApps = activeApps?.length && !deletingLastApp;

        recordEvent({
          event: 'profile-disconnect-connected-app-successful',
          'user-has-connected-apps': hasConnectedApps,
        });
        dispatch({ type: FINISHED_DELETING_CONNECTED_APP, appId });
      })
      .catch(({ errors }) => {
        recordEvent({
          event: 'profile-disconnect-connected-app-failed',
          'error-key': `${errors?.[0]?.code}_${errors?.[0]?.status}`,
        });
        dispatch({ type: ERROR_DELETING_CONNECTED_APP, appId, errors });
      });
  };
}

export function dismissDeletedAppAlert(appId) {
  return async dispatch =>
    dispatch({ type: DELETED_APP_ALERT_DISMISSED, appId });
}
