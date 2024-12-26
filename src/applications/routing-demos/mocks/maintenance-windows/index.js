const { formatISO, subMinutes, addHours } = require('date-fns');

const SERVICES = {
  mhvSm: 'mhv_sm',
  mhvPlatform: 'mhv_platform',
};

const beforeNow = formatISO(subMinutes(new Date(), 1));
const withinHour = formatISO(subMinutes(addHours(new Date(), 1), 1));
const endTime = formatISO(addHours(new Date(), 6));

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
