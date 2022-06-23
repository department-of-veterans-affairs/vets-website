const dateFns = require('date-fns');

const defaultUUID = '46bebc0a-b99c-464f-a5c5-560bc9eae287';
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
          appointmentIen: 'some-ien',
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

const createAppointment = (
  eligibility = 'ELIGIBLE',
  facilityId = 'some-facility',
  appointmentIen = 'some-ien',
  clinicFriendlyName = 'TEST CLINIC',
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
  const formattedStartTime = dateFns.format(
    startTime,
    isoDateWithoutTimezoneFormat,
  );

  // C.f. CHECKIN_MINUTES_BEFORE in {chip repo}/infra/template.yml
  const checkInWindowStart = dateFns.subMinutes(new Date(startTime), 30);
  const formattedCheckInWindowStart = dateFns.format(
    checkInWindowStart,
    isoDateWithOffsetFormat,
  );

  // C.f. CHECKIN_MINUTES_AFTER in {chip repo}/infra/template.yml
  const checkInWindowEnd = dateFns.addMinutes(new Date(startTime), 15);
  const formattedCheckInWindowEnd = dateFns.format(
    checkInWindowEnd,
    isoDateWithOffsetFormat,
  );

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
          `some-ien-L`,
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
  for (let i = 0; i < numberOfCheckInAbledAppointments; i += 1) {
    rv.payload.appointments.push(
      createAppointment(
        'ELIGIBLE',
        'ABC_123',
        `some-ien-${i}`,
        `TEST CLINIC-${i}`,
        false,
        token,
      ),
    );
  }
  rv.payload.appointments.push(
    createAppointment(
      'INELIGIBLE_TOO_EARLY',
      'ABC_123',
      `some-ien-E`,
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
