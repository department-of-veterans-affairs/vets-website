import { apiRequest } from '../../../utilities/api';
import { createServiceMap } from '../util/helpers';

export const RETRIEVE_SCHEDULED_DOWNTIME = 'RETRIEVE_SCHEDULED_DOWNTIME';
export const RECEIVE_SCHEDULED_DOWNTIME = 'RECEIVE_SCHEDULED_DOWNTIME';

export const DISMISS_DOWNTIME_APPROACHING_MODAL = 'DISMISS_DOWNTIME_APPROACHING_MODAL';

export function dismissDowntimeApproachingModal(appTitle) {
  return { type: DISMISS_DOWNTIME_APPROACHING_MODAL, appTitle };
}

export function getScheduledDowntime() {
  return async (dispatch) => {
    dispatch({ type: RETRIEVE_SCHEDULED_DOWNTIME });

    let response;
    try {
      response = await apiRequest('/maintenance_windows/');
    } catch (err) {
      // Probably in a test environment and the route isn't mocked.
    } finally {
      dispatch({
        type: RECEIVE_SCHEDULED_DOWNTIME,
        map: createServiceMap(response && response.data)
      });
    }
  };
}
