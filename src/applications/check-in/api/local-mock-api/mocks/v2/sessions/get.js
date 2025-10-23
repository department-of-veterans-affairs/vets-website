const createMockSuccessResponse = params => {
  const { uuid, permissions = 'read.none' } = params;
  return {
    permissions,
    status: 'success',
    error: undefined,
    uuid,
  };
};

const createMockFailedResponse = (errorCode = 400) => {
  return {
    errors: [
      {
        title: 'Operation failed',
        detail: 'Operation failed',
        code: 'VA900',
        status: errorCode.toString(),
      },
    ],
  };
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
};
