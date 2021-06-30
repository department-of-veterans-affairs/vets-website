const createMockSuccessResponse = data => {
  return { data: { ...data, isValid: true } };
};

const createMockFailedResponse = data => {
  return { data: { ...data, isValid: false } };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
