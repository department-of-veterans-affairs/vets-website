const error401Data = require('../../../tests/fixtures/errors/401.json');

const success = {
  data: {
    id: '',
    type: 'hashes',
    attributes: {
      first: 'Mitchell',
      middle: 'G',
      last: 'Jenkins',
      suffix: null,
    },
  },
};

const createErrorBadRequest401 = (_, res) => {
  return res.status(401).json(error401Data);
};

module.exports = { success, error401Data, createErrorBadRequest401 };
