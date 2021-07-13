const createMockSuccessResponse = _data => {
  return { ':data': { ':checkInStatus': 'completed' } };
};

const createMockFailedResponse = _data => {
  return { ':data': { ':checkInStatus': 'failed' } };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
