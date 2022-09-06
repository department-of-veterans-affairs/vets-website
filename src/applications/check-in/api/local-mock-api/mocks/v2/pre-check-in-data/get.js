const dateFns = require('date-fns');
const {
  mockDemographics,
  defaultUUID,
  createAppointment,
} = require('../shared/get');

const phoneApptUUID = '258d753c-262a-4ab2-b618-64b645884daf';

const alreadyPreCheckedInUUID = '4d523464-c450-49dc-9a18-c04b3f1642ee';

const canceledAppointmentUUID = '9d7b7c15-d539-4624-8d15-b740b84e8548';
const canceledPhoneAppointmentUUID = '1448d690-fd5f-11ec-b939-0242ac120002';

const expiredUUID = '354d5b3a-b7b7-4e5c-99e4-8d563f15c521';
const expiredPhoneUUID = '08ba56a7-68b7-4b9f-b779-53ba609140ef';

const isoDateWithoutTimezoneFormat = "yyyy-LL-dd'T'HH:mm:ss";

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
  let location = null;
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
  } else if (
    token === canceledAppointmentUUID ||
    token === canceledPhoneAppointmentUUID
  ) {
    status = 'CANCELLED BY CLINIC';
  }
  if (
    token === phoneApptUUID ||
    token === expiredPhoneUUID ||
    token === canceledPhoneAppointmentUUID
  ) {
    apptKind = 'phone';
    location = '';
  }
  return {
    id: token || defaultUUID,
    payload: {
      demographics: mockDemographics,
      appointments: [
        createAppointment({
          clinicLocation: location ?? 'SECOND FLOOR ROOM 1',
          kind: apptKind,
          status,
          startTime: mockTime,
          checkInSteps,
          preCheckInValid: true,
        }),
        createAppointment({
          clinicLocation: location ?? 'SECOND FLOOR ROOM 2',
          kind: apptKind,
          status,
          startTime: mockTime,
          checkInSteps,
          preCheckInValid: true,
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
