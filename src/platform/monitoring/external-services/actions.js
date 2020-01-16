import { apiRequest } from 'platform/utilities/api';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import scheduledDowntimeWindow from 'platform/monitoring/DowntimeNotification/config/scheduledDowntimeWindow';

export const FETCH_BACKEND_STATUSES_FAILURE = 'FETCH_BACKEND_STATUSES_FAILURE';
export const FETCH_BACKEND_STATUSES_SUCCESS = 'FETCH_BACKEND_STATUSES_SUCCESS';
export const LOADING_BACKEND_STATUSES = 'LOADING_BACKEND_STATUSES';

const BASE_URL = '/backend_statuses';

export function getBackendStatuses(downtimeWindow = scheduledDowntimeWindow) {
  return dispatch => {
    dispatch({ type: LOADING_BACKEND_STATUSES });

    // create global downtime data if feature toggle is enabled and if
    // current time is in downtime window
    // default to empty array
    const { downtimeStart, downtimeEnd } = downtimeWindow;
    const globalDowntimeActive =
      !environment.isLocalhost() &&
      moment().isAfter(downtimeStart) &&
      moment().isBefore(downtimeEnd);
    dispatch({
      type: FETCH_BACKEND_STATUSES_FAILURE,
      globalDowntimeActive,
    });
    return apiRequest(BASE_URL)
      .then(({ data }) =>
        dispatch({ type: FETCH_BACKEND_STATUSES_SUCCESS, data }),
      )
      .catch(() =>
        dispatch({
          type: FETCH_BACKEND_STATUSES_FAILURE,
          globalDowntimeActive,
        }),
      );
  };
}
