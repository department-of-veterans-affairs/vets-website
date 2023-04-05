const createMockSuccessResponse = params => {
  const { uuid, permissions = 'read.full' } = params;
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

const createMockValidateErrorResponse = () => {
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
};
const createMockMissingUuidErrorResponse = () => {
  return {
    errors: [
      {
        title: 'Not Found',
        detail: 'Not Found',
        code: 'CHIP-API_404',
        status: '404',
      },
    ],
  };
};
const createMockMaxValidateErrorResponse = () => {
  return {
    errors: [
      {
        title: 'Authentication Error',
        detail: 'Authentication Error',
        code: 'LOROTA-MAPPED-API_401',
        status: '410',
      },
    ],
  };
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
  createMockValidateErrorResponse,
  createMockMissingUuidErrorResponse,
  createMockMaxValidateErrorResponse,
};
