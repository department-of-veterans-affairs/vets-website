const moment = require('moment');

const SERVICES = {
  mhvSm: 'mhv_sm',
  mhvPlatform: 'mhv_platform',
};

const beforeNow = moment()
  .subtract(1, 'minute')
  .toISOString();
const withinHour = moment()
  .add(1, 'hour')
  .subtract(1, 'minute')
  .toISOString();
const endTime = moment()
  .add(6, 'hour')
  .toISOString();

const createDowntimeNotificationBase = (services, startTime) => {
  return {
    data: services.map(service => {
      return {
        id: '139',
        type: 'maintenance_windows',
        attributes: {
          externalService: service,
          description: `Description for ${service}`,
          startTime,
          endTime,
        },
      };
    }),
  };
};

const createDowntimeApproachingNotification = services => {
  return createDowntimeNotificationBase(services, withinHour);
};

const createDowntimeActiveNotification = services => {
  return createDowntimeNotificationBase(services, beforeNow);
};

const noDowntime = { data: [] };

module.exports = {
  createDowntimeApproachingNotification,
  createDowntimeActiveNotification,
  noDowntime,
  SERVICES,
};
