const defaultUUID = '46bebc0a-b99c-464f-a5c5-560bc9eae287';

const createMockSuccessResponse = (data, hasBeenValidated) => {
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
        demographicsNeedsUpdate: true,
        demographicsConfirmedAt: null,
        nextOfKinNeedsUpdate: true,
        nextOfKinConfirmedAt: null,
        emergencyContactNeedsUpdate: true,
        emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
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
) => {
  const startTime = new Date();
  const checkInWindowStart = new Date();
  const checkInWindowEnd = new Date();

  if (eligibility === 'INELIGIBLE_TOO_LATE') {
    startTime.setHours(startTime.getHours() - 1);
  } else if (eligibility === 'INELIGIBLE_TOO_EARLY') {
    startTime.setHours(startTime.getHours() + 1);
  } else {
    startTime.setMinutes(startTime.getMinutes() + 15);
  }
  checkInWindowStart.setHours(startTime.getHours() - 1);
  checkInWindowEnd.getMinutes(startTime.getMinutes() + 10);
  return {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName,
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen,
    startTime,
    eligibility,
    facilityId,
    checkInWindowStart,
    checkInWindowEnd,
    checkedInTime: '',
  };
};

const createMultipleAppointments = (
  token,
  numberOfCheckInAbledAppointments = 2,
  demographicsNeedsUpdate = true,
  nextOfKinNeedsUpdate = true,
  emergencyContactNeedsUpdate = true,
) => {
  const rv = {
    id: token || defaultUUID,
    payload: {
      demographics: {
        emergencyContact: {
          name: 'Bugs Bunny',
          workPhone: '',
          relationship: 'Estranged Uncle',
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
        demographicsConfirmedAt: null,
        nextOfKinNeedsUpdate,
        nextOfKinConfirmedAt: null,
        emergencyContactNeedsUpdate,
        emergencyContactConfirmedAt: null,
      },
    },
  };
  for (let i = 0; i < numberOfCheckInAbledAppointments; i++) {
    rv.payload.appointments.push(
      createAppointment(
        'ELIGIBLE',
        'ABC_123',
        `some-ien-${i}`,
        `TEST CLINIC-${i}`,
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
  createMockSuccessResponse,
  createMockFailedResponse,
  createMultipleAppointments,
  createAppointment,
  defaultUUID,
};
