const unauthenticated = {
  errors: [
    {
      title: 'Not authorized',
      detail: 'Not authorized',
      code: '401',
      status: '401',
    },
  ],
};

const notFound = {
  errors: [
    {
      title: 'Not found',
      detail: 'Not found',
      code: '404',
      status: '404',
    },
  ],
};

const unprocessableEntity = {
  errors: [
    {
      title: 'Unprocessable entity',
      detail: 'Unprocessable entity',
      code: '422',
      status: '422',
    },
  ],
};

const internalServerError = {
  errors: [
    {
      title: 'Internal server error',
      detail: 'Internal server error',
      code: '500',
      status: '500',
    },
  ],
};

const badGateway = {
  errors: [
    {
      title: 'Bad gateway',
      detail: 'Bad gateway',
      code: '502',
      status: '502',
    },
  ],
};

module.exports = {
  unauthenticated,
  notFound,
  unprocessableEntity,
  internalServerError,
  badGateway,
};
