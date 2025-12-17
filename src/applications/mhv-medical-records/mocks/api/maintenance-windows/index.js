// Returns ISO UTC string e.g. 2025-11-20T19:14:57.282Z
const isoNowPlusMillis = ms => new Date(Date.now() + ms).toISOString();

const SERVICES = {
  mhvMr: 'mhv_mr',
  mhvPlatform: 'mhv_platform',
};

const beforeNow = isoNowPlusMillis(-1 * 60 * 1000);
const withinHour = isoNowPlusMillis((60 - 1) * 60 * 1000);
const endTime = isoNowPlusMillis(6 * 60 * 60 * 1000);

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
