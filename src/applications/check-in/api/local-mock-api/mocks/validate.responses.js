const createMockSuccessResponse = _data => {
  return {
    data: {
      startTime: '2021-07-19T13:56:31',
      facility: 'LOMA LINDA VA CLINIC',
      clinicPhoneNumber: '5551234567',
      clinicFriendlyName: 'TEST CLINIC',
      clinicName: 'LOM ACC CLINIC TEST',
    },
  };
};

const createMockFailedResponse = data => {
  return { data: { ...data, error: true } };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
