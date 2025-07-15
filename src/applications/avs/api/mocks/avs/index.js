const data = id => {
  let avs = {};
  const filename = `../../../tests/fixtures/${id}.json`;

  try {
    // eslint-disable-next-line import/no-dynamic-require
    avs = require(filename);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Could not load file for AVS id ${id}.`);
  }

  return {
    data: avs,
  };
};

// status: 401, error.status: 'unauthorized'
// eg. id: '9448C91A721810765817079493131823'
const unauthorizedError = {
  error: [
    {
      title: 'Not authorized',
      detail: 'User may not view this AVS.',
      status: 'unauthorized',
    },
  ],
};

// status: 404, error.status: 'not_found'
// eg. id: '9A7AF40B2BC2471EA116891839113200'
const notFoundError = {
  error: [
    {
      title: 'Not found',
      detail: 'No AVS found for sid 9A7AF40B2BC2471EA116891839113200',
      status: 'not_found',
    },
  ],
};

// status: 400, error-status: 'bad_request'
// eg. id: '1234567890'
const badRequestError = {
  error: [
    {
      title: 'Invalid AVS id',
      detail: 'AVS id does not match accepted format.',
      status: 'bad_request',
    },
  ],
};

module.exports = {
  data,
  notFoundError,
  unauthorizedError,
  badRequestError,
};
