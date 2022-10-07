const createMockSuccessResponse = _data => {
  return { data: { claimId: 'BT10934849' }, status: 200 };
};

const createMockFailedResponse = _data => {
  return { data: { error: true } };
};

module.exports = { createMockSuccessResponse, createMockFailedResponse };
