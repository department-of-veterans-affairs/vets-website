const createMockSuccessResponse = (data, hasBeenValidated) => {
  const rv = {
    id: data.id || '46bebc0a-b99c-464f-a5c5-560bc9eae287',
    payload: [
      {
        facility: 'LOMA LINDA VA CLINIC',
        clinicPhoneNumber: '5551234567',
        clinicFriendlyName: 'TEST CLINIC',
        clinicName: 'LOM ACC CLINIC TEST',
        appointmentIEN: 'some-ien',
      },
    ],
  };
  if (hasBeenValidated) {
    rv.payload[0].startTime = '2021-08-19T13:56:31';
    rv.payload[0].status = 'ELIGIBLE';
    rv.payload[0].facilityId = 'ABC_123';
  }
  return rv;
};

const createAppointment = (
  status = 'ELIGIBLE',
  facilityId = 'some-facility',
  appointmentIEN = 'some-ien',
) => {
  const startTime = new Date();
  if (status === 'INELIGIBLE_TOO_LATE') {
    startTime.setHours(startTime.getHours() - 1);
  } else if (status === 'INELIGIBLE_TOO_EARLY') {
    startTime.setHours(startTime.getHours() + 1);
  } else {
    startTime.setMinutes(startTime.getMinutes() + 15);
  }
  return {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIEN,
    startTime,
    status,
    facilityId,
  };
};

const createMultipleAppointments = (
  token,
  numberOfCheckInAbledAppointments = 2,
) => {
  const rv = {
    id: token || '46bebc0a-b99c-464f-a5c5-560bc9eae287',
    payload: [createAppointment('INELIGIBLE_TOO_LATE')],
  };
  for (let i = 0; i < numberOfCheckInAbledAppointments; i++) {
    rv.payload.push(createAppointment('ELIGIBLE', 'ABC_123', `some-ien${i}`));
  }
  rv.payload.push(createAppointment('INELIGIBLE_TOO_EARLY'));

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
};
