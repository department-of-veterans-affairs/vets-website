const oneDayInMS = 24 * 60 * 60 * 1000;
const fourtyDays = Date.now() + oneDayInMS * 40;
const tomorrow = Date.now() + oneDayInMS;
const dayAfterTomorrow = Date.now() + oneDayInMS * 2;
const nextWeek = Date.now() + oneDayInMS * 7;

const ccAppointment = date => {
  return {
    additionalInfo: null,
    id: '8a4812b77035101201703a2086750033',
    isVideo: false,
    providerName: 'Jeckle and Hyde',
    startsAt: date,
    timeZone: '-06:00 MDT',
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
  ccAppointment(fourtyDays),
  videoAppointment(fourtyDays),
  vaInPersonAppointment(fourtyDays),
];
