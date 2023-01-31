/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../testing/local-dev-mock-api/common');

const featureToggles = {
  generateFeatureToggles: (toggles = {}) => {
    const { superCoolMHVFeature = true } = toggles;

    return {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'super_cool_mhv_feature',
            value: superCoolMHVFeature,
          },
        ],
      },
    };
  },
};

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
};

module.exports = delay(responses, 2000);
