import moment from 'moment';

// A series of date strings that match the format used by Redux. All appointment
// dates are in the following string format: 2021-05-26T18:00:00-06:00.
const tomorrow = moment
  .utc()
  .add(2, 'day')
  .startOf('day')
  .utcOffset(-6)
  .format();
const dayAfterTomorrow = moment
  .utc()
  .add(3, 'day')
  .startOf('day')
  .utcOffset(-6)
  .format();
const nextWeek = moment
  .utc()
  .add(8, 'day')
  .startOf('day')
  .utcOffset(-6)
  .format();
const fortyDays = moment
  .utc()
  .add(40, 'day')
  .startOf('day')
  .utcOffset(-6)
  .format();

const ccAppointment = date => {
  return {
    additionalInfo: null,
    id: '8a4812b77035101201703a2086750033',
    isVideo: false,
    providerName: 'Jeckle and Hyde',
    startsAt: date,
    timeZone: 'MT',
    type: 'cc',
  };
};

const vaInPersonAppointment = date => {
  return {
    additionalInfo: null,
    facility: {
      id: 'vha_442',
      attributes: {
        name: 'Cheyenne VA Medical Center',
      },
    },
    id: '20abc6741c00ac67b6cbf6b972d084c1',
    isVideo: false,
    providerName: 'Cheyenne VA Medical Center',
    startsAt: date,
    type: 'va',
    timeZone: 'MT',
  };
};

const videoAppointment = date => {
  return {
    additionalInfo: 'at home',
    facility: {
      id: 'vha_442',
      attributes: {
        name: 'Cheyenne VA Medical Center',
      },
    },
    id: '05760f00c80ae60ce49879cf37a05fc8',
    isVideo: true,
    providerName: 'Cheyenne VA Medical Center',
    startsAt: date,
    type: 'va',
    timeZone: 'MT',
  };
};

// These exports are for populating the Redux store used by the Appointments
// component. They are not for mocking API calls!
export const upcomingVideoAppointment = [
  videoAppointment(tomorrow),
  ccAppointment(dayAfterTomorrow),
  vaInPersonAppointment(nextWeek),
];

export const upcomingVAAppointment = [
  vaInPersonAppointment(tomorrow),
  ccAppointment(dayAfterTomorrow),
  videoAppointment(nextWeek),
];

export const upcomingCCAppointment = [
  ccAppointment(dayAfterTomorrow),
  videoAppointment(nextWeek),
  vaInPersonAppointment(nextWeek),
];

export const farFutureAppointments = [
  ccAppointment(fortyDays),
  videoAppointment(fortyDays),
  vaInPersonAppointment(fortyDays),
];
