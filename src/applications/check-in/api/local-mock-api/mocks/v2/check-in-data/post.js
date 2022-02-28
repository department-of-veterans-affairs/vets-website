const createMockSuccessResponse = _data => {
  return { data: 'Checkin successful', status: 200 };
};

const createMockFailedResponse = _data => {
  return { data: { error: true } };
};

const createMockEditSuccessResponse = _data => {
  return { data: 'Update successful', status: 200 };
};

const createMockEditErrorResponse = _data => {
  return { data: { error: true } };
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
  createMockEditSuccessResponse,
  createMockEditErrorResponse,
};
