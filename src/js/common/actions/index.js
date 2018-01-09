/* eslint-disable camelcase */

export const RETREIVE_SCHEDULED_DOWNTIME = 'RETREIVE_SCHEDULED_DOWNTIME';
export const RECEIVE_SCHEDULED_DOWNTIME = 'RECEIVE_SCHEDULED_DOWNTIME';

const mock = {
  data: [
    {
      id: '139',
      type: 'maintenance_windows',
      attributes: {
        external_service: 'evss',
        start_time: '2018-01-02T19:02:50.000Z',
        end_time: '2018-01-03T19:02:00.000Z',
        description: 'Benefits services will be unavailable for 24 hours.'
      }
    },
    {
      id: '140',
      type: 'maintenance_windows',
      attributes: {
        external_service: 'mhv',
        start_time: '2018-01-02T19:57:36.000Z',
        end_time: '2018-01-02T20:57:00.000Z',
        description: 'This is broken!'
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
