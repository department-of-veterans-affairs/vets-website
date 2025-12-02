const {
  currentDateMinusMinutes,
  currentDateAddHours,
  currentDateAddOneHourMinusOneMinute,
} = require('../../../util/dateHelpers');

const SERVICES = {
  mhvMr: 'mhv_mr',
  mhvPlatform: 'mhv_platform',
};

const beforeNow = currentDateMinusMinutes(1);
const withinHour = currentDateAddOneHourMinusOneMinute();
const endTime = currentDateAddHours(6);

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
