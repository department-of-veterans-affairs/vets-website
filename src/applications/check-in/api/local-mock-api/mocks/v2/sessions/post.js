const createMockSuccessResponse = (uuid, permissions = 'read.full') => {
  return {
    permissions,
    status: 'success',
    error: undefined,
    uuid,
  };
};

const createMockFailedResponse = () => {
  return {
    errors: [
      {
        title: 'Operation failed',
        detail: 'Operation failed',
        code: 'VA900',
        status: '400',
      },
    ],
  };
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
};
