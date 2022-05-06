import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from '~/platform/utilities/api';
import environment from '~/platform/utilities/environment';

export const NOTIFICATIONS_RECEIVED_STARTED = 'NOTIFICATIONS_RECEIVED_STARTED';
export const NOTIFICATIONS_RECEIVED_SUCCEEDED =
  'NOTIFICATIONS_RECEIVED_SUCCEEDED';
export const NOTIFICATIONS_RECEIVED_FAILED = 'NOTIFICATIONS_RECEIVED_FAILED';

export const NOTIFICATION_DISMISSAL_STARTED = 'NOTIFICATION_DISMISSAL_STARTED';
export const NOTIFICATION_DISMISSAL_SUCCEEDED =
  'NOTIFICATION_DISMISSAL_SUCCEEDED';
export const NOTIFICATION_DISMISSAL_FAILED = 'NOTIFICATION_DISMISSAL_FAILED';

export const fetchNotifications = () => async dispatch => {
  const getNotifications = () => {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };

    return apiRequest(
      `${environment.API_URL}/v0/onsite_notifications`,
      options,
    );
  };

  try {
    const response = await getNotifications();
    if (response.errors) {
      recordEvent({
        event: `api_call`,
        'error-key': `server error`,
        'api-name': 'GET onsight notifications',
        'api-status': 'failed',
      });
      return dispatch({
        type: NOTIFICATIONS_RECEIVED_FAILED,
        error: response,
      });
    }
    recordEvent({
      event: `api_call`,
      'api-name': 'GET onsight notifications',
      'api-status': 'successful',
    });
    const filteredNotifications = response.data.filter(
      n => n.attributes.dismissed,
    );
    return dispatch({
      type: NOTIFICATIONS_RECEIVED_SUCCEEDED,
      notifications: filteredNotifications,
    });
  } catch (error) {
    recordEvent({
      event: `api_call`,
      'error-key': `internal error`,
      'api-name': 'GET onsite notifications',
      'api-status': 'failed',
    });
    throw new Error(error);
  }
};

export const dismissNotificationById = id => async dispatch => {
  const dismissNotification = () => {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
      body: {
        onsiteNotification: {
          dismissed: true,
        },
      },
    };

    return apiRequest(
      `${environment.API_URL}/v0/onsite_notifications/${id}`,
      options,
    );
  };

  try {
    const response = await dismissNotification();
    if (response.errors) {
      recordEvent({
        event: `api_call`,
        'error-key': `server error`,
        'api-name': 'GET onsight notifications',
        'api-status': 'failed',
      });
      return dispatch({
        type: NOTIFICATION_DISMISSAL_FAILED,
        error: response,
      });
    }
    recordEvent({
      event: `api_call`,
      'api-name': 'Dismiss onsight notification',
      'api-status': 'successful',
    });
    const successful = response.data.attributes.dismissed;
    return dispatch({
      type: NOTIFICATION_DISMISSAL_SUCCEEDED,
      successful,
    });
  } catch (error) {
    recordEvent({
      event: `api_call`,
      'error-key': `internal error`,
      'api-name': 'Dismiss onsite notification',
      'api-status': 'failed',
    });
    throw new Error(error);
  }
};
