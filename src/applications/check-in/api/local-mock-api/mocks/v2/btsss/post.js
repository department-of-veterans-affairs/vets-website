const createMockSuccessResponse = _data => {
  return { data: { claimId: 'BT10934849' }, status: 200 };
};

const createMockFailedResponse = errorType => {
  return {
    data: {
      error: true,
      errorMsg: 'Error',
      errorCode: errorType,
    },
  };
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
};
