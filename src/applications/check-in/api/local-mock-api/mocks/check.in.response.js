const createMockSuccessResponse = data => {
  return { data: { ...data, status: 'checked-in' } };
};

const createMockFailedResponse = data => {
  return { data: { ...data, status: 'failed' } };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
