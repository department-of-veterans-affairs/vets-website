const delay = require('mocker-api/lib/delay');

const TOGGLE_NAMES = require('../../../../platform/utilities/feature-toggles/featureFlagNames.json');
const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const travelClaims = require('./travel-claims-31.json');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: `${TOGGLE_NAMES.travelPayPowerSwitch}`, value: true },
        { name: `${TOGGLE_NAMES.travelPayViewClaimDetails}`, value: true },
      ],
    },
  },
  'GET /travel_pay/v0/claims': travelClaims,
  'GET /travel_pay/v0/claims/:id': (req, res) => {
    return res.json({
      id: req.params.id,
      claimNumber: 'claimNumber',
      claimStatus: 'claimStatus',
      appointmentDateTime: '2023-09-24T14:14:20.549Z',
      facilityName: 'facilityName',
      createdOn: '2023-09-24T14:14:20.549Z',
      modifiedOn: '2023-09-26T14:14:20.549Z',
    });
  },
};
module.exports = delay(responses, 1000);
