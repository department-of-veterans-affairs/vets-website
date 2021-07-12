const createMockSuccessResponse = _data => {
  return {
    ':data': {
      ':uuid': 'abc-1234',
      ':appointmentTime': '2021-07-06 12:58:39 UTC',
      ':facilityName': 'Acme VA',
      ':clinicName': 'Green Team Clinic1',
      ':clinicPhone': '555-555-5555',
    },
  };
};

const createMockFailedResponse = data => {
  return { data: { ...data, isValid: false } };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
