const commonResponses = require('../../../../../../platform/testing/local-dev-mock-api/common');

const delay = require('mocker-api/lib/delay');

const responses = {
  ...commonResponses,
  'POST /covid-research/volunteer/create': (req, res) => {
    return res.status(202).json({
      status: 'accepted',
      code: 202,
    });
  },
  'POST /covid-research/volunteer/update': (req, res) => {
    return res.status(202).json({
      status: 'accepted',
      code: 202,
    });
  },
};

module.exports = delay(responses, 2000);
