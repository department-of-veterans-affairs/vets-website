const createMockSuccessResponse = (uuid, permissions) => {
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

const mocks = {
  get: {
    createMockSuccessResponse: params => {
      const { uuid, permissions = 'read.none' } = params;
      return createMockSuccessResponse(uuid, permissions);
    },
    createMockFailedResponse,
  },
  post: {
    createMockSuccessResponse: body => {
      const { id } = body;
      return createMockSuccessResponse(id, 'read.full');
    },
    createMockValidateErrorResponse: () => {
      return {
        errors: [
          {
            title: 'Authentication Error',
            detail: 'Authentication Error',
            code: 'LOROTA-MAPPED-API_401',
            status: '401',
          },
        ],
      };
    },
    createMockFailedResponse,
  },
};

module.exports = {
  ...mocks,
};
