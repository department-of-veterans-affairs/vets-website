const createMockSuccessResponse = (data, hasBeenValidated) => {
  const rv = {
    id: data.id || '46bebc0a-b99c-464f-a5c5-560bc9eae287',
    payload: {
      facility: 'LOMA LINDA VA CLINIC',
      clinicPhoneNumber: '5551234567',
      clinicFriendlyName: 'TEST CLINIC',
      clinicName: 'LOM ACC CLINIC TEST',
      appointmentIen: 'some-ien',
    },
  };
  if (hasBeenValidated) {
    rv.payload.startTime = '2021-08-19T13:56:31';
    rv.payload.eligibility = 'ELIGIBLE';
  }
  return rv;
};

const createMockFailedResponse = _data => {
  return {
    error: true,
  };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
