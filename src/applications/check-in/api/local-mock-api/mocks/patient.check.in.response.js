const createMockSuccessResponse = (_data, hasBeenValidated) => {
  const rv = {
    id: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
    payload: {
      startTime: '2021-08-19T13:56:31',
      facility: 'LOMA LINDA VA CLINIC',
      clinicPhoneNumber: '5551234567',
      clinicFriendlyName: 'TEST CLINIC',
      clinicName: 'LOM ACC CLINIC TEST',
    },
  };
  if (hasBeenValidated) {
    rv.payload.startTime = '2021-08-19T13:56:31';
  }
  return rv;
};

const createMockFailedResponse = _data => {
  return {
    error: true,
  };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
