const dateFns = require('date-fns');
const { utcToZonedTime, format } = require('date-fns-tz');

const defaultUUID = '46bebc0a-b99c-464f-a5c5-560bc9eae287';
const pacificTimezoneUUID = '6c72b801-74ac-47fe-82af-cfe59744b45f';
const aboutToExpireUUID = '25165847-2c16-4c8b-8790-5de37a7f427f';

const isoDateWithoutTimezoneFormat = "yyyy-LL-dd'T'HH:mm:ss";
const isoDateWithOffsetFormat = "yyyy-LL-dd'T'HH:mm:ss.SSSxxx";

const createMockSuccessResponse = (
  data,
  hasBeenValidated,
  demographicsNeedsUpdate = false,
  demographicsConfirmedAt = null,
  nextOfKinNeedsUpdate = false,
  nextOfKinConfirmedAt = null,
  emergencyContactNeedsUpdate = false,
  emergencyContactConfirmedAt = null,
) => {
  const rv = {
    id: data.id || defaultUUID,
    payload: {
      demographics: {
        mailingAddress: {
          street1: '123 Turtle Trail',
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
        emailAddress: 'kermit.frog@sesameenterprises.us',
      },
      appointments: [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: '0001',
          stationNo: '0001',
        },
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
  if (hasBeenValidated) {
    rv.payload.appointments[0].startTime = '2021-08-19T13:56:31';
    rv.payload.appointments[0].eligibility = 'ELIGIBLE';
    rv.payload.appointments[0].facilityId = 'ABC_123';
  }
  return rv;
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

const createAppointment = (
  eligibility = 'ELIGIBLE',
  facilityId = 'some-facility',
  appointmentIen = Math.floor(Math.random() * 100000),
  clinicFriendlyName = 'TEST CLINIC',
  preCheckInValid = false,
  uuid = defaultUUID,
  timezone = 'browser',
  stationNo = '0001',
  clinicLocation = 'Test location, room A',
) => {
  const startTime = getAppointmentStartTime(eligibility, preCheckInValid, uuid);
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
    checkInSteps: [],
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
      demographics: {
        emergencyContact: {
          name: 'Bugs Bunny',
          workPhone: '',
          relationship: 'EXTENDED FAMILY MEMBER',
          phone: '5558675309',
          address: {
            zip: '87102',
            country: 'USA',
            street3: '',
            city: 'Albuquerque',
            county: null,
            street1: '123 fake street',
            zip4: '',
            street2: '',
            state: 'New Mexico',
          },
        },
        nextOfKin1: {
          name: 'VETERAN,JONAH',
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
        emailAddress: 'kermit.frog@sesameenterprises.us',
      },
      appointments: [
        createAppointment(
          'INELIGIBLE_TOO_LATE',
          'ABC_123',
          '0000',
          `TEST CLINIC-L`,
        ),
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
      createAppointment(
        'ELIGIBLE',
        'ABC_123',
        `000${i + 1}`,
        `TEST CLINIC-${i}`,
        false,
        token,
        timezone,
      ),
    );
  }
  rv.payload.appointments.push(
    createAppointment(
      'INELIGIBLE_TOO_EARLY',
      'ABC_123',
      `0050`,
      `TEST CLINIC-E`,
    ),
  );

  return rv;
};

const createMockFailedResponse = _data => {
  return {
    error: true,
  };
};

module.exports = {
  aboutToExpireUUID,
  createMockSuccessResponse,
  createMockFailedResponse,
  createMultipleAppointments,
  createAppointment,
  defaultUUID,
};
