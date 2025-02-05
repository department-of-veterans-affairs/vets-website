const delay = require('mocker-api/lib/delay');

const TOGGLE_NAMES = require('../../../../platform/utilities/feature-toggles/featureFlagNames.json');
const travelClaims = require('./travel-claims-31.json');
// const appointment = require('./vaos-appointment.json');
const appointmentNoclaim = require('./vaos-appointment-no-claim.json');
const user = require('./user.json');
// const noAddressUser = require('./user-no-address.json');

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
  // 'GET /travel_pay/v0/claims': (req, res) => {
  //   return res.status(503).json({
  //     errors: [
  //       {
  //         title: 'Server error',
  //         status: 503,
  //         detail: 'An unknown server error has occured.',
  //         code: 'VA900',
  //       },
  //     ],
  //   });
  // },
  // 'GET /travel_pay/v0/claims': (req, res) => {
  //   return res.status(400).json({
  //     errors: [
  //       {
  //         title: 'Bad request',
  //         status: 400,
  //         detail: 'There is not an ICN in the auth token.',
  //         code: 'VA900',
  //       },
  //     ],
  //   });
  // },
  // 'GET /travel_pay/v0/claims': (req, res) => {
  //   return res.status(403).json({
  //     errors: [
  //       {
  //         title: 'Forbidden',
  //         status: 403,
  //         detail: 'The user is not a Veteran.',
  //         code: 'VA900',
  //       },
  //     ],
  //   });
  // },
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
  'GET /vaos/v2/appointments/:id': (req, res) => {
    return res.json(appointmentNoclaim);
  },
  // 'GET /vaos/v2/appointments/:id': (req, res) => {
  //   return res.status(503).json({
  //     errors: [
  //       {
  //         title: 'Service unavailable',
  //         status: 503,
  //         detail: 'An unknown error has occured.',
  //         code: 'VA900',
  //       },
  //     ],
  //   });
  // },
};
module.exports = delay(responses, 1000);
