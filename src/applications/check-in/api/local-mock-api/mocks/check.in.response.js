const createMockSuccessResponse = _data => {
  return { data: { success: true } };
};

const createMockFailedResponse = _data => {
  return { data: { error: true } };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
