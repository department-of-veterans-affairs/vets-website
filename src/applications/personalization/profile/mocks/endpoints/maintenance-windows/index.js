const moment = require('moment');

const SERVICES = {
  EVSS: 'evss',
  MVI: 'mvi',
  GLOBAL: 'global',
  VA_PROFILE: 'vet360',
  // Sources for VA Profile services:
  VAPRO_PROFILE_PAGE: 'vaproProfilePage',
  VAPRO_CONTACT_INFO: 'vaproContactInformation',
  LIGHTHOUSE_DIRECT_DEPOSIT: 'lighthouseDirectDeposit',
  VAPRO_MILITARY_INFO: 'vaproMilitaryInformation',
  VAPRO_NOTIFICATION_SETTINGS: 'vaproNotificationSettings',
  VAPRO_HEALTH_CARE_CONTACTS: 'vaproPersonalHealthCareContacts',
  VAPRO_PERSONAL_INFO: 'vaproPersonalInformation',
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
