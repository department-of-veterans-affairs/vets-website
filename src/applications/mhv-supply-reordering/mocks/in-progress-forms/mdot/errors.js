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

const notFound = {
  errors: [
    {
      title: 'Veteran Not Found',
      detail: 'The veteran could not be found',
      code: 'MDOT_invalid',
      source: 'MDOT::Client',
      status: '404',
    },
  ],
};

module.exports = {
  unauthenticated,
  internalServerError,
  notFound,
};
