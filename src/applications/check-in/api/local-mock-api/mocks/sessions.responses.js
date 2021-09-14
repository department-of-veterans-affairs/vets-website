const createMockSuccessResponse = (uuid, permissions) => {
  return {
    data: {
      jwt: `${permissions}-123-123`,
      permissions,
      status: 'success',
      error: undefined,
      uuid,
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
