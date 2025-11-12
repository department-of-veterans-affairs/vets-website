const moment = require('moment');

/**
 * Service names that can be used for maintenance window testing.
 * These should match the services configured in vets-api config/settings.yml
 */
const SERVICES = {
  global: 'global',
  bgs: 'bgs',
  vbms: 'vbms',
  mvi: 'mvi',
  vaProfile: 'vet360',
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
  createDowntimeActiveNotification,
  createDowntimeApproachingNotification,
  noDowntime,
  SERVICES,
};
