const createMockSuccessResponse = _data => {
  return {
    data: {
      startTime: 'Jul 12, 2021, 11:00:00 AM',
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
