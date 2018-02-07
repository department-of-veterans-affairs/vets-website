import { apiRequest } from '../helpers/api';

export const RETREIVE_SCHEDULED_DOWNTIME = 'RETREIVE_SCHEDULED_DOWNTIME';
export const RECEIVE_SCHEDULED_DOWNTIME = 'RECEIVE_SCHEDULED_DOWNTIME';
export const SET_CURRENT_DOWNTIME_STATUS = 'SET_CURRENT_DOWNTIMW_STATUS';
export const UNSET_CURRENT_DOWNTIME_STATUS = 'UNSET_CURRENT_DOWNTIMW_STATUS';

function receiveScheduledDowntime(dispatch, data) {
  const services = data.map(({ attributes: { externalService: service, description, startTime, endTime } }) => {
    return {
      service,
      description,
      startTime: new Date(startTime),
      endTime: endTime && new Date(endTime) // endTime is optional for indefinite outages
    };
  });
  dispatch({ type: RECEIVE_SCHEDULED_DOWNTIME, value: services });
}

export function getScheduledDowntime() {
  return (dispatch) => {
    dispatch({ type: RETREIVE_SCHEDULED_DOWNTIME });
    return apiRequest(
      '/maintenance_windows/',
      undefined,
      (json) => { receiveScheduledDowntime(dispatch, json.data); },
      () => { receiveScheduledDowntime(dispatch, []); });
  };
}

export function setCurrentStatus(status) {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_DOWNTIME_STATUS, value: status });
  };
}

export function unsetCurrentStatus(status) {
  return (dispatch) => {
    dispatch({ type: UNSET_CURRENT_DOWNTIME_STATUS });
  };
}
