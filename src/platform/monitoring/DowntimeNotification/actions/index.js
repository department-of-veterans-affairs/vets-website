import { apiRequest } from 'platform/utilities/api';
import { getCurrentGlobalDowntime } from '../util/helpers';

export const RETRIEVE_SCHEDULED_DOWNTIME = 'RETRIEVE_SCHEDULED_DOWNTIME';
export const RECEIVE_SCHEDULED_DOWNTIME = 'RECEIVE_SCHEDULED_DOWNTIME';
export const RECEIVE_GLOBAL_DOWNTIME = 'RECEIVE_GLOBAL_DOWNTIME';

export const INIT_DISMISSED_DOWNTIME_APPROACHING_MODALS =
  'INIT_DISMISSED_DOWNTIME_APPROACHING_MODALS';
export const DISMISS_DOWNTIME_APPROACHING_MODAL =
  'DISMISS_DOWNTIME_APPROACHING_MODAL';

const getDismissedDowntimeWarningsFromSession = (() => {
  const DISMISSED_DOWNTIME_WARNINGS = 'DISMISSED_DOWNTIME_WARNINGS';

  return appTitle => {
    const fromSession = window.sessionStorage[DISMISSED_DOWNTIME_WARNINGS];
    let parsed = [];

    if (fromSession) {
      try {
        parsed = JSON.parse(fromSession);
      } catch (err) {
        // Value will default to an empty array
      }
    }

    if (appTitle) {
      parsed.push(appTitle);
      window.sessionStorage[DISMISSED_DOWNTIME_WARNINGS] = JSON.stringify(
        parsed,
      );
    }

    return parsed;
  };
})();

export function initializeDowntimeWarnings() {
  return {
    type: INIT_DISMISSED_DOWNTIME_APPROACHING_MODALS,
    dismissedDowntimeWarnings: getDismissedDowntimeWarningsFromSession(),
  };
}

export function dismissDowntimeWarning(appTitle) {
  getDismissedDowntimeWarningsFromSession(appTitle);
  return {
    type: DISMISS_DOWNTIME_APPROACHING_MODAL,
    appTitle,
  };
}

export const getGlobalDowntime = () => async dispatch => {
  const downtime = await getCurrentGlobalDowntime();
  dispatch({ type: RECEIVE_GLOBAL_DOWNTIME, downtime });
};

export function getScheduledDowntime() {
  return async dispatch => {
    dispatch({ type: RETRIEVE_SCHEDULED_DOWNTIME });

    let data;

    try {
      const response = await apiRequest('/maintenance_windows/');
      data = response.data;
    } catch (error) {
      // Probably in a test environment and the route isn't mocked.
    } finally {
      dispatch({ type: RECEIVE_SCHEDULED_DOWNTIME, data });
    }
  };
}
