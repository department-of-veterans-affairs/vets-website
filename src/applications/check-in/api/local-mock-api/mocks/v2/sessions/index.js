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
      const { uuid } = params;
      return createMockSuccessResponse(uuid, 'read.none');
    },
    createMockFailedResponse,
  },
  post: {
    createMockSuccessResponse: body => {
      const { id } = body;
      return createMockSuccessResponse(id, 'read.full');
    },
    createMockFailedResponse,
  },
};

module.exports = {
  ...mocks,
};
