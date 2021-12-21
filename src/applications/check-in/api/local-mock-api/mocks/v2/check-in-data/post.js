const createMockSuccessResponse = _data => {
  return { data: 'Checkin successful', status: 200 };
};

const createMockFailedResponse = _data => {
  return { data: { error: true } };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
