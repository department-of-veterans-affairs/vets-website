import recordEvent from '~/platform/monitoring/record-event';
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
        'api-name': 'GET on-site notifications',
        'api-status': 'failed',
      });
      return dispatch({
        type: NOTIFICATIONS_RECEIVED_FAILED,
        notificationError: true,
        errors: response.errors,
      });
    }
    const filteredNotifications = response.data.filter(
      n => !n.attributes?.dismissed,
    );
    if (filteredNotifications && filteredNotifications.length) {
      recordEvent({
        event: `api_call`,
        'api-name': 'GET on-site notifications',
        'api-status': 'successful with notifications',
      });
    } else {
      recordEvent({
        event: `api_call`,
        'api-name': 'GET on-site notifications',
        'api-status': 'successful no notifications',
      });
    }
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
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
      body: JSON.stringify({
        onsiteNotification: {
          dismissed: true,
        },
      }),
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
        'api-name': 'PATCH dismiss on-site notification',
        'api-status': 'failed',
      });
      return dispatch({
        type: NOTIFICATION_DISMISSAL_FAILED,
        dismissalError: true,
        errors: response.errors,
      });
    }
    recordEvent({
      event: `api_call`,
      'api-name': 'PATCH dismiss on-site notification',
      'api-status': 'successful',
    });
    const notification = response.data;
    const successful = notification.attributes.dismissed;
    return dispatch({
      type: NOTIFICATION_DISMISSAL_SUCCEEDED,
      successful,
      id: notification.id,
    });
  } catch (error) {
    recordEvent({
      event: `api_call`,
      'error-key': `internal error`,
      'api-name': 'PATCH dismiss on-site notification',
      'api-status': 'failed',
    });
    return dispatch({
      type: NOTIFICATION_DISMISSAL_FAILED,
      dismissalError: true,
      errors: error,
    });
  }
};
