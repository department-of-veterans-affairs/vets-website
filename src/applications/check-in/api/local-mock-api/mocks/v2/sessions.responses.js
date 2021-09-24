const createMockSuccessResponse = (uuid, permissions) => {
  return {
    jwt: `${permissions}-123-123`,
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
  get: params => {
    const { uuid } = params;
    return createMockSuccessResponse(uuid, 'read.basic');
  },
  post: body => {
    const { id } = body;
    return createMockSuccessResponse(id, 'read.full');
  },
};

module.exports = { createMockSuccessResponse, createMockFailedResponse, mocks };
