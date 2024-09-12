const delay = require('mocker-api/lib/delay');

const TOGGLE_NAMES = require('../../../../platform/utilities/feature-toggles/featureFlagNames.json');
const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const travelClaims = require('./travel-claims-31.json');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [{ name: `${TOGGLE_NAMES.travelPayPowerSwitch}`, value: true }],
    },
  },
  'GET /travel_pay/v0/claims': travelClaims,
  'GET /travel_pay/v0/claims/:id': (req, res) => {
    return res.json({
      id: req.params.id,
      claimNumber: 'claimNumber',
      claimStatus: 'claimStatus',
      appointmentDateTime: 'appointmentDateTime',
      facilityName: 'facilityName',
      createdOn: 'createdOn',
      modifiedOn: 'modifiedOn',
    });
  },
};
module.exports = delay(responses, 1000);
