const createMockSuccessResponse = (data, hasBeenValidated) => {
  const rv = {
    id: data.id || '46bebc0a-b99c-464f-a5c5-560bc9eae287',
    payload: {
      appointments: [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
        },
      ],
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
  const appointmentCheckInStart = new Date();
  if (eligibility === 'INELIGIBLE_TOO_LATE') {
    startTime.setHours(startTime.getHours() - 1);
  } else if (eligibility === 'INELIGIBLE_TOO_EARLY') {
    startTime.setHours(startTime.getHours() + 1);
  } else {
    startTime.setMinutes(startTime.getMinutes() + 15);
  }
  appointmentCheckInStart.setHours(startTime.getHours() - 1);
  return {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName,
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen,
    startTime,
    eligibility,
    facilityId,
    appointmentCheckInStart,
  };
};

const createMultipleAppointments = (
  token,
  numberOfCheckInAbledAppointments = 2,
) => {
  const rv = {
    id: token || '46bebc0a-b99c-464f-a5c5-560bc9eae287',
    payload: {
      appointments: [
        createAppointment(
          'INELIGIBLE_TOO_LATE',
          'ABC_123',
          `some-ien-L`,
          `TEST CLINIC-L`,
        ),
      ],
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
};
