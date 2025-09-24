/* eslint-disable camelcase */
const commonResponses = require('@department-of-veterans-affairs/platform-testing/common');

const featureToggles = require('./feature-toggles');
const avs = require('./avs');

const delaySingleResponse = (cb, responseDelay = 3) => {
  setTimeout(() => {
    cb();
  }, responseDelay * 1000);
};

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': (req, res) => {
    const secondsOfDelay = 1;
    const { data } = featureToggles.generateFeatureToggles({});
    return delaySingleResponse(() => res.json({ data }), secondsOfDelay);
  },
  'GET /avs/v0/avs/:id': (req, res) => {
    const secondsOfDelay = 1;
    const { data } = avs.data(req.params.id);
    if (!data.data) {
      return res.status(404).json(avs.notFoundError);
      // return res.status(401).json(avs.unauthorizedError);
      // return res.status(400).json(avs.badRequestError);
      // return res.status(500).json(data);
    }
    return delaySingleResponse(() => res.json(data), secondsOfDelay);
  },
};

module.exports = responses;
