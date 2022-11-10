const createMockSuccessResponse = _data => {
  return {
    data: {
      value: {
        claimNumber: 'TC202207000011666',
      },
      formatters: [],
      contentTypes: [],
      declaredType: null,
      statusCode: 200,
    },
    status: 200,
  };
};

const createMockFailedResponse = errorType => {
  return {
    data: {
      error: true,
      code: errorType,
      message: '10/16/2020 : Error message',
    },
    status: 400,
  };
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
};
