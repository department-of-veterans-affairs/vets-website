/* eslint-disable camelcase */
import moment from 'moment';

export const RETREIVE_SCHEDULED_DOWNTIME = 'RETREIVE_SCHEDULED_DOWNTIME';
export const RECEIVE_SCHEDULED_DOWNTIME = 'RECEIVE_SCHEDULED_DOWNTIME';

function mockStatusDown() {
  return {
    start_time: moment().subtract(1, 'hour').toISOString(),
    end_time: moment().add(1, 'hour').toISOString()
  };
}

function mockStatusDownApproaching() {
  return {
    start_time: moment().add(1, 'hour').toISOString(),
    end_time: moment().add(2, 'hour').toISOString()
  };
}

const mock = {
  data: [
    {
      id: '139',
      type: 'maintenance_windows',
      attributes: {
        external_service: 'evss',
        description: 'Benefits services will be unavailable for 24 hours.',
        ...mockStatusDownApproaching()
      }
    },
    {
      id: '140',
      type: 'maintenance_windows',
      attributes: {
        external_service: 'mhv',
        description: 'This is broken!',
        ...mockStatusDown()
      }
    }
  ]
};

function receiveScheduledDowntime(dispatch, data) {
  const services = data.map(({ attributes: { external_service: service, description, start_time: startTime, end_time: endTime } }) => {
    return { service, description, startTime: new Date(startTime), endTime: new Date(endTime) };
  });
  dispatch({ type: RECEIVE_SCHEDULED_DOWNTIME, value: services });
}

export function getScheduledDowntime() {
  return (dispatch) => {
    dispatch({ type: RETREIVE_SCHEDULED_DOWNTIME });
    setTimeout(() => receiveScheduledDowntime(dispatch, mock.data), 500);
  };
}
