const dateFns = require('date-fns');
const {
  mockDemographics,
  defaultUUID,
  createAppointment,
} = require('../shared/get');

const phoneApptUUID = '258d753c-262a-4ab2-b618-64b645884daf';
const cvtApptUUID = 'f4b9f1a7-4e3d-4d0c-8b8c-3f9b3d0f9e9b';
const vvcApptUUID = 'cc8bd49c-5ac8-4ad2-880a-b96645cdea64';

const alreadyPreCheckedInUUID = '4d523464-c450-49dc-9a18-c04b3f1642ee';

const canceledAppointmentUUID = '9d7b7c15-d539-4624-8d15-b740b84e8548';
const canceledPhoneAppointmentUUID = '1448d690-fd5f-11ec-b939-0242ac120002';

const expiredUUID = '354d5b3a-b7b7-4e5c-99e4-8d563f15c521';
const past15MinuteUUID = 'f4167a0a-c74d-4e1e-9715-ca22ed7fab9e';
const expiredPhoneUUID = '08ba56a7-68b7-4b9f-b779-53ba609140ef';

const allDemographicsCurrentUUID = 'e544c217-6fe8-44c5-915f-6c3d9908a678';
const onlyDemographicsCurrentUUID = '7397abc0-fb4d-4238-a3e2-32b0e47a1527';

const noFacilityAddressUUID = '5d5a26cd-fb0b-4c5b-931e-2957bfc4b9d3';
const singlePreCheckInAppt = '47fa6bad-62b4-440d-a4e1-50e7f7b92d27';

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
  const mockTime = (() => {
    switch (token) {
      case expiredUUID:
      case expiredPhoneUUID:
        return new Date();
      case past15MinuteUUID:
        return dateFns.sub(new Date(), { minutes: 15 });
      default:
        return dateFns.add(new Date(), { days: 1 });
    }
  })();

  let apptKind = 'clinic';
  let location = null;
  let checkInSteps = [];
  let status = '';
  let facilityAddress = {
    zip: '92357-1000',
    street1: '11201 Benton Street',
    state: 'CA',
    street2: null,
    street3: null,
    city: 'Loma Linda',
  };

  let demographicsNeedsUpdateValue = demographicsNeedsUpdate;
  let demographicsConfirmedAtValue = demographicsConfirmedAt;
  let nextOfKinNeedsUpdateValue = nextOfKinNeedsUpdate;
  let nextOfKinConfirmedAtValue = nextOfKinConfirmedAt;
  let emergencyContactNeedsUpdateValue = emergencyContactNeedsUpdate;
  let emergencyContactConfirmedAtValue = emergencyContactConfirmedAt;

  const yesterday = dateFns.sub(new Date(), { days: -1 }).toISOString();
  if (token === allDemographicsCurrentUUID) {
    demographicsNeedsUpdateValue = false;
    demographicsConfirmedAtValue = yesterday;
    nextOfKinNeedsUpdateValue = false;
    nextOfKinConfirmedAtValue = yesterday;
    emergencyContactNeedsUpdateValue = false;
    emergencyContactConfirmedAtValue = yesterday;
  } else if (token === onlyDemographicsCurrentUUID) {
    demographicsNeedsUpdateValue = false;
    demographicsConfirmedAtValue = yesterday;
  }
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
  if (token === cvtApptUUID) {
    apptKind = 'cvt';
  }
  if (token === vvcApptUUID) {
    apptKind = 'vvc';
  }
  if (token === noFacilityAddressUUID) {
    facilityAddress = {};
  }
  let appointments = [
    createAppointment({
      clinicLocation: location ?? 'SECOND FLOOR ROOM 1',
      kind: apptKind,
      status,
      startTime: mockTime,
      checkInSteps,
      preCheckInValid: true,
      appointmentIen: '0001',
      facilityAddress,
    }),
    createAppointment({
      clinicLocation: location ?? 'SECOND FLOOR ROOM 2',
      kind: apptKind,
      status,
      startTime: dateFns.sub(new Date(), { hours: 1 }),
      checkInSteps,
      preCheckInValid: true,
      appointmentIen: '0002',
      facilityAddress,
    }),
    createAppointment({
      clinicLocation: location ?? 'SECOND FLOOR ROOM 3',
      kind: apptKind,
      status,
      startTime: dateFns.sub(new Date(), { hours: 2 }),
      checkInSteps,
      preCheckInValid: true,
      appointmentIen: '0003',
      facilityAddress,
    }),
  ];
  if (token === singlePreCheckInAppt) {
    appointments = [
      createAppointment({
        clinicLocation: location ?? 'SECOND FLOOR ROOM 1',
        kind: apptKind,
        status,
        startTime: mockTime,
        checkInSteps,
        preCheckInValid: true,
        appointmentIen: '0001',
        facilityAddress,
      }),
    ];
  }
  return {
    id: token || defaultUUID,
    payload: {
      demographics: mockDemographics,
      appointments,
      patientDemographicsStatus: {
        demographicsNeedsUpdate: demographicsNeedsUpdateValue,
        demographicsConfirmedAt: demographicsConfirmedAtValue,
        nextOfKinNeedsUpdate: nextOfKinNeedsUpdateValue,
        nextOfKinConfirmedAt: nextOfKinConfirmedAtValue,
        emergencyContactNeedsUpdate: emergencyContactNeedsUpdateValue,
        emergencyContactConfirmedAt: emergencyContactConfirmedAtValue,
      },
    },
  };
};

module.exports = {
  alreadyPreCheckedInUUID,
  canceledAppointmentUUID,
  createMockSuccessResponse,
  defaultUUID,
  expiredUUID,
  past15MinuteUUID,
};
