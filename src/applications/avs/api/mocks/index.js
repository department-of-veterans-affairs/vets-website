/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles');
const avs = require('./avs');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
  'GET /avs/v0/avs/:id': (req, res) => {
    const { data } = avs.data(req.params.id);
    if (!data.data) {
      return res.status(404).json(data);
    }
    return res.json(data);
  },
};

module.exports = delay(responses, 1000);
