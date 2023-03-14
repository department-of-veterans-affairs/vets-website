const delay = require('mocker-api/lib/delay');
const commonResponses = require('../../../../../../platform/testing/local-dev-mock-api/common');
const signupFeatureToggles = require('../../../../sign-up/tests/fixtures/toggle-covid-feature.json');
const updateFeatureToggles = require('../../../../update/tests/fixtures/toggle-covid-feature.json');

const featureToggles = {
  data: {
    features: [
      ...updateFeatureToggles.data.features,
      ...signupFeatureToggles.data.features,
    ],
  },
};
const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles,
  'GET /covid_vaccine/v0/facilities/:zip': (req, res) => {
    return res.status(200).json({
      data: [
        {
          id: 'vha_516',
          type: 'vaccination_facility',
          attributes: {
            name:
              'C.W. Bill Young Department of Veterans Affairs Medical Center',
            distance: 15.46,
            city: 'Bay Pines',
            state: 'FL',
          },
        },
        {
          id: 'vha_673',
          type: 'vaccination_facility',
          attributes: {
            name: "James A. Haley Veterans' Hospital",
            distance: 21.83,
            city: 'Tampa',
            state: 'FL',
          },
        },
        {
          id: 'vha_675',
          type: 'vaccination_facility',
          attributes: {
            name: 'Orlando VA Medical Center',
            distance: 94.71,
            city: 'Orlando',
            state: 'FL',
          },
        },
        {
          id: 'vha_573',
          type: 'vaccination_facility',
          attributes: {
            name:
              'Malcom Randall Department of Veterans Affairs Medical Center',
            distance: 113.8,
            city: 'Gainesville',
            state: 'FL',
          },
        },
      ],
    });
  },
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
