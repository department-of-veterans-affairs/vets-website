const createMockSuccessResponse = (id, permissions) => {
  return {
    data: {
      permissions,
      status: 'success',
      error: undefined,
      id,
    },
  };
};

const createMockFailedResponse = data => {
  return { data: { ...data, error: true } };
};

const v1Api = {
  get: params => {
    const { uuid } = params;
    return createMockSuccessResponse(uuid, 'read.basic');
  },
  post: body => {
    const { id } = body;
    return createMockSuccessResponse(id, 'read.full');
  },
};

module.exports = { createMockSuccessResponse, createMockFailedResponse, v1Api };
