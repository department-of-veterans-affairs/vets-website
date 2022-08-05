const dateFns = require('date-fns');
const { utcToZonedTime, format } = require('date-fns-tz');

const isoDateWithoutTimezoneFormat = "yyyy-LL-dd'T'HH:mm:ss";
const isoDateWithOffsetFormat = "yyyy-LL-dd'T'HH:mm:ss.SSSxxx";

// check in UUIDS
const defaultUUID = '46bebc0a-b99c-464f-a5c5-560bc9eae287';
const aboutToExpireUUID = '25165847-2c16-4c8b-8790-5de37a7f427f';
const pacificTimezoneUUID = '6c72b801-74ac-47fe-82af-cfe59744b45f';

const mockDemographics = {
  emergencyContact: {
    name: 'Star Garnet',
    workPhone: '',
    relationship: 'EXTENDED FAMILY MEMBER',
    phone: '5558675309',
    address: {
      zip: '87102',
      country: 'USA',
      street3: '',
      city: 'Albuquerque',
      county: null,
      street1: '1233 8th Street',
      zip4: '',
      street2: '',
      state: 'New Mexico',
    },
  },
  nextOfKin1: {
    name: 'Johnnie Shaye',
    relationship: 'BROTHER',
    phone: '1112223333',
    workPhone: '4445556666',
    address: {
      street1: '123 Main St',
      street2: 'Ste 234',
      street3: '',
      city: 'Los Angeles',
      county: 'Los Angeles',
      state: 'CA',
      zip: '90089',
      zip4: '',
      country: 'USA',
    },
  },
  mailingAddress: {
    street1: '123 Turtle Trail',
    street2: '',
    street3: '',
    city: 'Treetopper',
    state: 'Tennessee',
    zip: '101010',
  },
  homeAddress: {
    street1: '445 Fine Finch Fairway',
    street2: 'Apt 201',
    city: 'Fairfence',
    state: 'Florida',
    zip: '445545',
  },
  homePhone: '5552223333',
  mobilePhone: '5553334444',
  workPhone: '5554445555',
  emailAddress: 'fred.carter@mailbox.com',
};

const getAppointmentStartTime = (
  eligibility = 'ELIGIBLE',
  preCheckInValid = false,
  uuid = defaultUUID,
) => {
  let startTime = preCheckInValid ? dateFns.addDays(new Date(), 1) : new Date();

  if (eligibility === 'INELIGIBLE_TOO_LATE') {
    startTime = dateFns.subHours(startTime, 1);
  } else if (eligibility === 'INELIGIBLE_TOO_EARLY') {
    startTime = dateFns.addHours(startTime, 1);
  } else if (uuid === aboutToExpireUUID) {
    startTime = dateFns.subMinutes(startTime, 14);
  } else {
    startTime = dateFns.addMinutes(startTime, 15);
  }

  return startTime;
};

const createAppointment = ({
  eligibility = 'ELIGIBLE',
  facilityId = 'some-facility',
  appointmentIen = Math.floor(Math.random() * 100000),
  clinicFriendlyName = 'HEART CLINIC 1',
  preCheckInValid = false,
  uuid = defaultUUID,
  timezone = 'browser',
  stationNo = '0001',
  clinicLocation = 'SECOND FLOOR ROOM 2',
  kind = 'clinic',
  status = '',
  startTime = getAppointmentStartTime(eligibility, preCheckInValid, uuid),
  checkInSteps = [],
} = {}) => {
  const formattedStartTime = dateFns.format(
    startTime,
    isoDateWithoutTimezoneFormat,
  );

  // C.f. CHECKIN_MINUTES_BEFORE in {chip repo}/infra/template.yml
  let checkInWindowStart = dateFns.subMinutes(new Date(startTime), 30);
  let formattedCheckInWindowStart = format(
    checkInWindowStart,
    isoDateWithOffsetFormat,
  );
  // C.f. CHECKIN_MINUTES_AFTER in {chip repo}/infra/template.yml
  let checkInWindowEnd = dateFns.addMinutes(new Date(startTime), 15);
  let formattedCheckInWindowEnd = dateFns.format(
    checkInWindowEnd,
    isoDateWithOffsetFormat,
  );

  if (timezone !== 'browser') {
    checkInWindowStart = dateFns.subMinutes(
      utcToZonedTime(new Date(startTime), timezone),
      30,
    );
    formattedCheckInWindowStart = format(
      checkInWindowStart,
      isoDateWithOffsetFormat,
      { timeZone: timezone },
    );
    checkInWindowEnd = dateFns.addMinutes(
      utcToZonedTime(new Date(startTime), timezone),
      15,
    );
    formattedCheckInWindowEnd = format(
      checkInWindowEnd,
      isoDateWithOffsetFormat,
      { timeZone: timezone },
    );
  }

  return {
    facility: 'LOMA LINDA VA CLINIC',
    kind,
    checkInSteps,
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName,
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen,
    startTime: formattedStartTime,
    eligibility,
    facilityId,
    checkInWindowStart: formattedCheckInWindowStart,
    checkInWindowEnd: formattedCheckInWindowEnd,
    checkedInTime: '',
    status,
    stationNo,
    clinicLocation,
  };
};

const createMultipleAppointments = (
  token,
  numberOfCheckInAbledAppointments = 2,
  demographicsNeedsUpdate = false,
  demographicsConfirmedAt = null,
  nextOfKinNeedsUpdate = false,
  nextOfKinConfirmedAt = null,
  emergencyContactNeedsUpdate = false,
  emergencyContactConfirmedAt = null,
) => {
  const rv = {
    id: token || defaultUUID,
    payload: {
      demographics: mockDemographics,
      appointments: [
        createAppointment({
          eligibility: 'INELIGIBLE_TOO_LATE',
          facilityId: 'ABC_123',
          appointmentIen: '0000',
          clinicFriendlyName: `HEART CLINIC-1`,
        }),
      ],
      patientDemographicsStatus: {
        demographicsNeedsUpdate,
        demographicsConfirmedAt,
        nextOfKinNeedsUpdate,
        nextOfKinConfirmedAt,
        emergencyContactNeedsUpdate,
        emergencyContactConfirmedAt,
      },
    },
  };

  let timezone = 'browser';
  if (token === pacificTimezoneUUID) {
    timezone = 'America/Los_Angeles';
  }
  for (let i = 0; i < numberOfCheckInAbledAppointments; i += 1) {
    rv.payload.appointments.push(
      createAppointment({
        eligibility: 'ELIGIBLE',
        facilityId: 'ABC_123',
        appointmentIen: `000${i + 1}`,
        clinicFriendlyName: `HEART CLINIC-${i}`,
        uuid: token,
        timezone,
      }),
    );
  }
  rv.payload.appointments.push(
    createAppointment({
      eligibility: 'INELIGIBLE_TOO_EARLY',
      facilityId: 'ABC_123',
      appointmentIen: `0050`,
      clinicFriendlyName: `HEART CLINIC-E`,
    }),
  );

  return rv;
};

module.exports = {
  aboutToExpireUUID,
  createMultipleAppointments,
  createAppointment,
  defaultUUID,
  mockDemographics,
};
