const delay = require('mocker-api/lib/delay');

const TOGGLE_NAMES = require('../../../../platform/utilities/feature-toggles/featureFlagNames.json');
const travelClaims = require('./travel-claims-31.json');
const user = require('./user.json');

const responses = {
  'GET /v0/user': user,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: `${TOGGLE_NAMES.travelPayPowerSwitch}`, value: true },
        { name: `${TOGGLE_NAMES.travelPayViewClaimDetails}`, value: true },
        { name: `${TOGGLE_NAMES.travelPaySubmitMileageExpense}`, value: true },
      ],
    },
  },
  'GET /travel_pay/v0/claims': travelClaims,
  'GET /travel_pay/v0/claims/:id': (req, res) => {
    return res.json({
      id: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
      claimNumber: 'TC0928098230498',
      claimStatus: 'Claim Submitted',
      appointmentDateTime: '2024-05-26T16:40:45.781Z',
      facilityName: 'Tomah VA Medical Center',
      createdOn: '2024-05-27T16:40:45.781Z',
      modifiedOn: '2024-05-31T16:40:45.781Z',
    });
  },
};
module.exports = delay(responses, 1000);
