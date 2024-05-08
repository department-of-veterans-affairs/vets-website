/* istanbul ignore file */
const dateFns = require('date-fns');
const { utcToZonedTime, zonedTimeToUtc, format } = require('date-fns-tz');
const {
  singleAppointment,
  singleUpcomingAppointment,
} = require('../../../../../tests/unit/mocks/mock-appointments');

const isoDateWithoutTimezoneFormat = "yyyy-LL-dd'T'HH:mm:ss";
const isoDateWithOffsetFormat = "yyyy-LL-dd'T'HH:mm:ss.SSSxxx";

const defaultUUID = '46bebc0a-b99c-464f-a5c5-560bc9eae287';

// check in UUIDS
const aboutToExpireUUID = '25165847-2c16-4c8b-8790-5de37a7f427f';
const pacificTimezoneUUID = '6c72b801-74ac-47fe-82af-cfe59744b45f';
const allAppointmentTypesUUID = 'bb48c558-7b35-44ec-8ab7-32b7d49364fc';
const checkInTooLateUUID = '127c6f75-ea5f-4986-b0f5-d411d9d5e55c';

// travel-claim UUIDS
const multiOHAppointmentsUUID = 'd80ade2e-7a96-4a30-9edc-efc08b4d157d';

// Minutes before start time that the window for check-in starts.
const checkInStartWindowMinutes = 45;

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

const createUpcomingAppointment = ({
  id = singleUpcomingAppointment[0].id,
  status = singleUpcomingAppointment[0].attributes.status,
  serviceType = singleUpcomingAppointment[0].attributes.serviceType,
  locationId = singleUpcomingAppointment[0].attributes.locationId,
  clinic = singleUpcomingAppointment[0].attributes.clinic,
  kind = singleUpcomingAppointment[0].attributes.kind,
  start = singleUpcomingAppointment[0].attributes.start,
  end = singleUpcomingAppointment[0].attributes.end,
  minutesDuration = singleUpcomingAppointment[0].attributes.minutesDuration,
  serviceName = singleUpcomingAppointment[0].attributes.serviceName,
  physicalLocation = singleUpcomingAppointment[0].attributes.physicalLocation,
  friendlyName = singleUpcomingAppointment[0].attributes.friendlyName,
  location = singleUpcomingAppointment[0].attributes.location,
}) => {
  return {
    id,
    type: 'appointments',
    attributes: {
      status,
      serviceType,
      locationId,
      clinic,
      kind,
      start,
      end,
      minutesDuration,
      serviceName,
      physicalLocation,
      friendlyName,
      location,
    },
  };
};

const createAppointment = ({
  facility = singleAppointment[0].facility,
  eligibility = singleAppointment[0].eligibility,
  appointmentIen = Math.floor(Math.random() * 100000),
  clinicFriendlyName = 'HEART CLINIC 1',
  clinicName = singleAppointment[0].clinicName,
  preCheckInValid = false,
  uuid = defaultUUID,
  timezone = 'browser',
  stationNo = singleAppointment[0].stationNo,
  clinicLocation = singleAppointment[0].clinicLocation,
  kind = singleAppointment[0].kind,
  status = singleAppointment[0].status,
  startTime = getAppointmentStartTime(eligibility, preCheckInValid, uuid),
  checkInSteps = singleAppointment[0].checkInSteps,
  clinicStopCodeName = singleAppointment[0].clinicStopCodeName,
  doctorName = singleAppointment[0].doctorName,
  clinicIen = singleAppointment[0].clinicIen,
  facilityAddress = singleAppointment[0].facilityAddress,
  clinicPhoneNumber = singleAppointment[0].clinicPhoneNumber,
} = {}) => {
  const formattedStartTime = dateFns.format(
    startTime,
    isoDateWithoutTimezoneFormat,
  );

  // C.f. CHECKIN_MINUTES_BEFORE in {chip repo}/infra/template.yml
  let checkInWindowStart = dateFns.subMinutes(
    new Date(startTime),
    checkInStartWindowMinutes,
  );
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
      checkInStartWindowMinutes,
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
    facility,
    kind,
    checkInSteps,
    clinicPhoneNumber,
    clinicFriendlyName,
    clinicName,
    appointmentIen,
    startTime: formattedStartTime,
    eligibility,
    checkInWindowStart: formattedCheckInWindowStart,
    checkInWindowEnd: formattedCheckInWindowEnd,
    checkedInTime: '',
    status,
    stationNo,
    clinicLocation,
    clinicStopCodeName,
    doctorName,
    clinicIen,
    facilityAddress,
  };
};

const createAppointments = (
  token = defaultUUID,
  demographicsNeedsUpdate = false,
  demographicsConfirmedAt = null,
  nextOfKinNeedsUpdate = false,
  nextOfKinConfirmedAt = null,
  emergencyContactNeedsUpdate = false,
  emergencyContactConfirmedAt = null,
  number = 3,
) => {
  const timezone =
    token === pacificTimezoneUUID ? 'America/Los_Angeles' : 'browser';

  let appointments = [
    createAppointment({
      eligibility: 'ELIGIBLE',
      clinicIen: '0001',
      appointmentIen: `0001`,
      clinicFriendlyName: `HEART CLINIC-1`,
      uuid: token,
      timezone,
    }),
  ];

  if (token === checkInTooLateUUID) {
    appointments = [
      createAppointment({
        eligibility: 'INELIGIBLE_TOO_LATE',
        clinicIen: '0001',
        appointmentIen: '0000',
        clinicFriendlyName: `HEART CLINIC-1`,
      }),
      createAppointment({
        eligibility: 'INELIGIBLE_TOO_LATE',
        clinicIen: '0001',
        appointmentIen: '0000',
        clinicFriendlyName: `HEART CLINIC-1`,
      }),
    ];
  }

  if (token === allAppointmentTypesUUID) {
    appointments = [
      createAppointment({
        eligibility: 'INELIGIBLE_TOO_LATE',
        clinicIen: '0001',
        appointmentIen: '0000',
        clinicFriendlyName: `HEART CLINIC-1`,
      }),
    ];
    for (let i = 0; i < number; i += 1) {
      appointments.push(
        createAppointment({
          eligibility: 'ELIGIBLE',
          clinicIen: '0001',
          appointmentIen: `000${i + 1}`,
          clinicFriendlyName: `HEART CLINIC-${i}`,
          uuid: token,
          timezone,
        }),
      );
    }
    appointments.push(
      createAppointment({
        eligibility: 'ELIGIBLE',
        clinicIen: '0001',
        appointmentIen: `0060`,
        clinicFriendlyName: `HEART CLINIC-CVT`,
        kind: 'cvt',
      }),
    );
    appointments.push(
      createAppointment({
        eligibility: 'INELIGIBLE_TOO_EARLY',
        clinicIen: '0001',
        appointmentIen: `0050`,
        clinicFriendlyName: `HEART CLINIC`,
      }),
    );
  }

  return {
    id: token,
    payload: {
      demographics: mockDemographics,
      appointments,
      patientDemographicsStatus: {
        demographicsNeedsUpdate,
        demographicsConfirmedAt,
        nextOfKinNeedsUpdate,
        nextOfKinConfirmedAt,
        emergencyContactNeedsUpdate,
        emergencyContactConfirmedAt,
      },
      setECheckinStartedCalled: true,
    },
  };
};

const createUpcomingAppointments = (token, number = 3) => {
  const appointments = [
    createUpcomingAppointment({
      id: '123123',
      friendlyName: `HEART CLINIC-1`,
      start: dateFns.addDays(new Date('2023-09-26T14:00:00'), 1),
    }),
  ];
  for (let i = 0; i < number; i += 1) {
    appointments.push(
      createUpcomingAppointment({
        id: `12300${i + 1}`,
        friendlyName: `HEART CLINIC-${i}`,
        start: dateFns.addHours(new Date('2023-09-26T14:00:00'), i),
      }),
    );
  }
  appointments.push(
    createUpcomingAppointment({
      id: `123456`,
      friendlyName: `HEART CLINIC-E`,
      start: dateFns.addMonths(new Date('2023-09-26T14:00:00'), 2),
    }),
  );

  return {
    data: appointments,
  };
};

const createMockFailedResponse = _data => {
  return {
    error: true,
  };
};

const createMockNotFoundResponse = () => {
  return {
    errors: [
      {
        status: '404',
      },
    ],
  };
};
const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const createAppointmentOH = ({
  appointmentIen = '1111',
  type = 'Endoscopy',
  clinicPhoneNumber = '555-555-5555',
  facility = 'Example Veterans Hospital',
  facilityAddress = {
    street1: '12345 Main St',
    street2: 'Suite 100',
    street3: 'Box #3',
    city: 'Washington',
    state: 'DC',
    zip: '20002',
  },
  stationNo = '500',
  clinicIen = '32216049',
  clinicLocation = '',
  doctorName = 'Dr. Smith',
  kind = 'clinic',
  startTime = new Date().toISOString(),
  status = 'Confirmed',
  timezone = 'America/Los_Angeles',
} = {}) => {
  return {
    facility,
    kind,
    clinicPhoneNumber,
    clinicFriendlyName: type,
    clinicName: type,
    appointmentIen,
    startTime: zonedTimeToUtc(startTime, browserTimezone),
    status,
    stationNo,
    clinicLocation,
    clinicStopCodeName: type,
    doctorName,
    clinicIen,
    facilityAddress,
    timezone,
  };
};

const createAppointmentsOH = (token = defaultUUID) => {
  const appointments = [createAppointmentOH()];

  if (token === multiOHAppointmentsUUID) {
    appointments.push(
      createAppointmentOH({
        appointmentIen: '2222',
        startTime: dateFns.addHours(new Date(), 1).toISOString(),
        type: 'Mental Health',
        stationNo: '500',
      }),
    );
  }

  return {
    id: token,
    payload: {
      appointments,
      address: '1166 6th Avenue\n22\nNew York, NY 23423\nUS',
    },
  };
};

module.exports = {
  aboutToExpireUUID,
  checkInTooLateUUID,
  createAppointments,
  createAppointmentsOH,
  createAppointment,
  createUpcomingAppointment,
  createUpcomingAppointments,
  createMockFailedResponse,
  createMockNotFoundResponse,
  multiOHAppointmentsUUID,
  defaultUUID,
  mockDemographics,
};
