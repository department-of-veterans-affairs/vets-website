const createMockSuccessResponse = _data => {
  return {
    data: {
      statusCode: 202,
    },
    status: 202,
  };
};

const createMockFailedResponse = () => {
  return {
    data: {
      error: true,
    },
    status: 500,
  };
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
};
