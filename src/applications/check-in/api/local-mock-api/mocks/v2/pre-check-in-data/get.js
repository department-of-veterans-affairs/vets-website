const dateFns = require('date-fns');

const defaultUUID = '0429dda5-4165-46be-9ed1-1e652a8dfd83';
const alreadyPreCheckedInUUID = '4d523464-c450-49dc-9a18-c04b3f1642ee';
const canceledAppointmentUUID = '9d7b7c15-d539-4624-8d15-b740b84e8548';
const expiredUUID = '354d5b3a-b7b7-4e5c-99e4-8d563f15c521';
const phoneApptUUID = '258d753c-262a-4ab2-b618-64b645884daf';
const expiredPhoneUUID = '08ba56a7-68b7-4b9f-b779-53ba609140ef';

const isoDateWithoutTimezoneFormat = "yyyy-LL-dd'T'HH:mm:ss";
const isoDateWithOffsetFormat = "yyyy-LL-dd'T'HH:mm:ss.SSSxxx";

const createMockSuccessResponse = (
  token,
  demographicsNeedsUpdate = false,
  demographicsConfirmedAt = null,
  nextOfKinNeedsUpdate = false,
  nextOfKinConfirmedAt = null,
  emergencyContactNeedsUpdate = false,
  emergencyContactConfirmedAt = null,
) => {
  const mockTime =
    token === expiredUUID || token === expiredPhoneUUID
      ? new Date()
      : dateFns.add(new Date(), { days: 1 });

  let apptKind = 'clinic';

  let checkInSteps = [];
  let status = '';

  if (token === alreadyPreCheckedInUUID) {
    // 35 minutes ago.
    const preCheckinStarted = dateFns.format(
      new Date(mockTime.getTime() - 2100000),
      isoDateWithoutTimezoneFormat,
    );
    // 30 minutes ago.
    const preCheckinCompleted = dateFns.format(
      new Date(mockTime.getTime() - 1800000),
      isoDateWithoutTimezoneFormat,
    );

    checkInSteps = [
      {
        status: 'PRE-CHECK-IN STARTED',
        dateTime: preCheckinStarted,
        ien: 1,
      },
      {
        status: 'PRE-CHECK-IN COMPLETE',
        dateTime: preCheckinCompleted,
        ien: 2,
      },
    ];
  } else if (token === canceledAppointmentUUID) {
    status = 'CANCELLED BY CLINIC';
  } else if (token === phoneApptUUID || token === expiredPhoneUUID) {
    apptKind = 'phone';
  }

  const formattedStartTime = dateFns.format(
    mockTime,
    isoDateWithoutTimezoneFormat,
  );

  const checkInWindowStart = dateFns.subMinutes(
    new Date(mockTime.getTime()),
    30,
  );
  const formattedCheckInWindowStart = dateFns.format(
    checkInWindowStart,
    isoDateWithOffsetFormat,
  );

  const checkInWindowEnd = dateFns.addMinutes(new Date(mockTime.getTime()), 15);
  const formattedCheckInWindowEnd = dateFns.format(
    checkInWindowEnd,
    isoDateWithOffsetFormat,
  );

  return {
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
        {
          facility: 'LOMA LINDA VA CLINIC',
          kind: apptKind,
          checkInSteps,
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
          startTime: formattedStartTime,
          eligibility: 'ELIGIBLE',
          facilityId: 'some-facility',
          checkInWindowStart: formattedCheckInWindowStart,
          checkInWindowEnd: formattedCheckInWindowEnd,
          checkedInTime: '',
          status,
        },
        {
          facility: 'LOMA LINDA VA CLINIC',
          kind: apptKind,
          checkInSteps,
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-other-ien',
          startTime: formattedStartTime,
          eligibility: 'ELIGIBLE',
          facilityId: 'some-facility',
          checkInWindowStart: formattedCheckInWindowStart,
          checkInWindowEnd: formattedCheckInWindowEnd,
          checkedInTime: '',
          status,
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
};

const createMockFailedResponse = _data => {
  return {
    error: true,
  };
};

module.exports = {
  alreadyPreCheckedInUUID,
  canceledAppointmentUUID,
  createMockSuccessResponse,
  createMockFailedResponse,
  defaultUUID,
  expiredUUID,
};
