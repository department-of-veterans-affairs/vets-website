import { apiRequest } from '../../../platform/utilities/api';
import { createServiceMap } from './util/helpers';

export const RETREIVE_SCHEDULED_DOWNTIME = 'RETREIVE_SCHEDULED_DOWNTIME';
export const RECEIVE_SCHEDULED_DOWNTIME = 'RECEIVE_SCHEDULED_DOWNTIME';

export function getScheduledDowntime() {
  return async (dispatch) => {
    dispatch({ type: RETREIVE_SCHEDULED_DOWNTIME });

    let response = null;
    try {
      response = await apiRequest('/maintenance_windows/');
    } catch (err) {
      // Probably in a test environment and the route isn't mocked.
    }

    dispatch({
      type: RECEIVE_SCHEDULED_DOWNTIME,
      map: createServiceMap(response && response.data)
    });
  };
}
