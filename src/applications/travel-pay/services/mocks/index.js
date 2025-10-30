const fs = require('fs');
const delay = require('mocker-api/lib/delay');

// Generate a UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
}

const TOGGLE_NAMES = require('../../../../platform/utilities/feature-toggles/featureFlagNames.json');
const travelClaims = require('./travel-claims-31.json');

const appointment = {
  original: require('./vaos-appointment-original.json'),
  claim: require('./vaos-appointment-with-claim.json'),
  noClaim: require('./vaos-appointment-no-claim.json'),
};

const user = {
  withAddress: require('./user.json'),
  noAddress: require('./user-no-address.json'),
};

const claimDetails = {
  v1: require('./travel-claim-details-v1.json'),
  v2: require('./travel-claim-details-v2.json'),
};

const maintenanceWindows = {
  none: require('./maintenance-windows/none.json'),
  enabled: require('./maintenance-windows/enabled.json'),
};

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': maintenanceWindows.none,
  'GET /v0/user': user.withAddress,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: `${TOGGLE_NAMES.travelPayPowerSwitch}`, value: true },
        { name: `${TOGGLE_NAMES.travelPayViewClaimDetails}`, value: true },
        { name: `${TOGGLE_NAMES.travelPaySubmitMileageExpense}`, value: true },
        { name: `${TOGGLE_NAMES.travelPayClaimsManagement}`, value: true },
        {
          name: `${TOGGLE_NAMES.travelPayClaimsManagementDecisionReason}`,
          value: true,
        },
        { name: `${TOGGLE_NAMES.travelPayEnableComplexClaims}`, value: true },
      ],
    },
  },
  'GET /travel_pay/v0/claims': travelClaims,

  // 'GET /travel_pay/v0/claims': (req, res) => {
  //   return res.status(200).json({
  //     metadata: {
  //       status: 200,
  //       pageNumber: 1,
  //       totalRecordCount: 0,
  //     },
  //     data: [],
  //   });
  // },

  // 'GET /travel_pay/v0/claims': (req, res) => {
  //   return res.status(503).json({
  //     errors: [
  //       {
  //         title: 'Server error',
  //         status: 503,
  //         detail: 'An unknown server error has occurred.',
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
  'GET /travel_pay/v0/claims/:id': claimDetails.v1,
  // 'GET /travel_pay/v0/claims/:id': (req, res) => {
  //   return res.status(403).json({
  //     errors: [
  //       {
  //         title: 'Forbidden',
  //         status: 403,
  //         detail: 'Forbidden.',
  //         code: 'VA900',
  //       },
  //     ],
  //   });
  // },

  // Submitting a new claim
  'POST /travel_pay/v0/claims': { claimId: '12345' },
  // 'POST /travel_pay/v0/claims': (req, res) => {
  //   return res.status(502).json({
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

  // Creating a new complex claim
  'POST /travel_pay/v0/complex_claims': {
    claimId: generateUUID(),
    claimNumber: 'TC0000000002',
    status: 'InProgress',
    appointmentDateTime: '2024-01-15T10:00:00Z',
  },

  // Submitting a complex claim
  'PATCH /travel_pay/v0/complex_claims': {
    claimId: 'a1f33265-014a-4dc6-93ae-66a29b94675b',
    claimNumber: 'TC0000000002',
    status: 'Submitted',
    submittedOn: '2024-01-15T15:30:00Z',
  },

  // Creating expenses
  'POST /travel_pay/v0/expenses/mileage': {
    id: generateUUID(),
  },

  // Updating expense
  'PATCH /travel_pay/v0/expenses/mileage/:expenseId': (req, res) => {
    return res.json({
      id: req.params.expenseId,
    });
  },

  // Deleting expenses
  'DELETE /travel_pay/v0/expenses/:expenseType/:expenseId': (req, res) => {
    return res.status(200).json({
      id: req.params.expenseId,
    });
  },

  // Get travel-pay appointment
  'GET /vaos/v2/appointments/:id': (req, res) => {
    return res.json(appointment.original);
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

  // Document download
  'GET /travel_pay/v0/claims/:claimId/documents/:docId': (req, res) => {
    // Error condition for screenshot-2 from the mock data
    if (req.params.docId === '12fcfecc-5132-4c16-8a9a-7af07b714cd4') {
      return res.status(503).json({
        errors: [
          {
            title: 'Service unavailable',
            status: 503,
            detail: 'An unknown error has occured.',
            code: 'VA900',
          },
        ],
      });
    }

    // Absolute path to our mock docx file
    const docx = fs.readFileSync(
      'src/applications/travel-pay/services/mocks/sample-decision-letter.docx',
    );
    res.writeHead(200, {
      'Content-Disposition': 'attachment; filename="Rejection Letter.docx"',
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Length': docx.length,
    });
    return res.end(Buffer.from(docx, 'binary'));
  },
};
module.exports = delay(responses, 1000);
