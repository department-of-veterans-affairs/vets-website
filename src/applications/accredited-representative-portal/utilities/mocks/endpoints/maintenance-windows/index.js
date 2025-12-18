const { addDays, addHours, addMinutes, subMinutes } = require('date-fns');
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

const now = new Date();
const beforeNow = subMinutes(now, 1).toISOString();
const withinHour = addMinutes(now, 59).toISOString();
const daysAway = addDays(now, 5).toISOString();
const defaultEndTime = addHours(now, 6).toISOString();
const daysAwayEndTime = addHours(now, 174).toISOString(); // 7 days and 6 hours

const createDowntimeNotificationBase = (
  services,
  startTime,
  endTime = defaultEndTime,
) => {
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

const createDowntimeFutureNotification = services => {
  return createDowntimeNotificationBase(services, daysAway, daysAwayEndTime);
};

const noDowntime = { data: [] };

module.exports = {
  createDowntimeActiveNotification,
  createDowntimeApproachingNotification,
  createDowntimeFutureNotification,
  noDowntime,
  SERVICES,
};
