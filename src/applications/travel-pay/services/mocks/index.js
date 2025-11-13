const fs = require('fs');
const delay = require('mocker-api/lib/delay');

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
  // 'GET /travel_pay/v0/claims/:id': claimDetails.v2,
  'GET /travel_pay/v0/claims/:id': (req, res) => {
    const details = { ...claimDetails.v2 };
    // Added a documentId to the expense mocks. Upper envs with have this data once the API team makes their changes
    details.expenses = [
      {
        expenseType: 'Mileage',
        name: 'Mileage Expense',
        dateIncurred: '2025-09-16T08:30:00Z',
        description: 'mileage',
        costRequested: 1.16,
        costSubmitted: {
          source: '0.0',
          parsedValue: 0,
        },
        id: 'a48d48d4-cdc5-4922-8355-c1a9b2742feb',
        documentId: '',
      },
      {
        expenseType: 'Parking',
        name: 'Parking Expense',
        dateIncurred: '2025-09-16T08:30:00Z',
        description: 'Hospital parking',
        costRequested: 15.0,
        costSubmitted: {
          source: '15.0',
          parsedValue: 15.0,
        },
        id: 'e82h82h8-ghg9-8e66-c799-g5ed16186jif',
        documentId: '4f6f751b-87ff-ef11-9341-001dd809b68c',
      },
      {
        expenseType: 'Toll',
        name: 'Toll Expense',
        dateIncurred: '2025-09-16T08:30:00Z',
        description: 'Highway toll',
        costRequested: 5.5,
        costSubmitted: {
          source: '5.5',
          parsedValue: 5.5,
        },
        id: 'f93i93i9-hih0-9f77-d800-h6fe27297kjg',
        documentId: 'a5137021-87ff-ef11-9341-001dd809b68c',
      },
      {
        expenseType: 'Commoncarrier',
        name: 'Common Carrier Expense',
        dateIncurred: '2025-09-16T08:30:00Z',
        description: 'Taxi to appointment',
        costRequested: 45.0,
        costSubmitted: {
          source: '45.0',
          parsedValue: 45.0,
        },
        id: 'g04j04j0-iji1-0g88-e911-i7gf38308lkh',
        documentId: '4f6f751b-87ff-ef11-9341-001dd854jutt',
      },
      {
        expenseType: 'Airtravel',
        name: 'Air Travel Expense',
        dateIncurred: '2025-09-16T08:30:00Z',
        description: 'Flight to medical appointment',
        costRequested: 350.0,
        costSubmitted: {
          source: '350.0',
          parsedValue: 350.0,
        },
        id: 'h15k15k1-jkj2-1h99-f022-j8hg49419mli',
        documentId: '12fcfecc-5132-4c16-8a9a-7af07b714cd4',
      },
      {
        expenseType: 'Lodging',
        name: 'Lodging Expense',
        dateIncurred: '2025-09-16T08:30:00Z',
        description: 'Hotel stay',
        costRequested: 125.0,
        costSubmitted: {
          source: '125.0',
          parsedValue: 125.0,
        },
        id: 'b59e59e5-ded6-5b33-9466-d2ba83853gfc',
        documentId: '887ead10-d849-428c-b83b-50a054fd968b',
      },
      {
        expenseType: 'Meal',
        name: 'Meal Expense',
        dateIncurred: '2025-09-16T08:30:00Z',
        description: 'Breakfast and lunch',
        costRequested: 35.0,
        costSubmitted: {
          source: '35.0',
          parsedValue: 35.0,
        },
        id: 'c60f60f6-efe7-6c44-a577-e3cb94964hgd',
        documentId: '887ead10-d849-428c-b83b-50a05434rtfe',
      },
      {
        expenseType: 'Other',
        name: 'Other Expense',
        dateIncurred: '2025-09-16T08:30:00Z',
        description: 'Medical supplies',
        costRequested: 50.0,
        costSubmitted: {
          source: '50.0',
          parsedValue: 50.0,
        },
        id: 'd71g71g7-fgf8-7d55-b688-f4dc05075ihe',
        documentId: '887ead10-d849-428c-b83b-50a053re44wr',
      },
    ];
    details.documents = [
      {
        documentId: '4f6f751b-87ff-ef11-9341-001dd809b68c',
        filename: 'Parking.docx',
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        createdon: '2025-03-12T21:15:27Z',
      },
      {
        documentId: 'a5137021-87ff-ef11-9341-001dd809b68c',
        filename: 'Toll.pdf',
        mimetype: 'application/pdf',
        createdon: '2025-03-12T21:15:33Z',
      },
      {
        documentId: '4f6f751b-87ff-ef11-9341-001dd854jutt',
        filename: 'CommonCarrier.jpg',
        mimetype: 'image/jpeg',
        createdon: '2025-03-24T14:02:52.893Z',
      },
      {
        documentId: '12fcfecc-5132-4c16-8a9a-7af07b714cd4',
        filename: 'Airtravel.jpg',
        mimetype: 'image/jpeg',
        createdon: '2025-03-24T14:04:00.893Z',
      },
      {
        documentId: '887ead10-d849-428c-b83b-50a054fd968b',
        filename: 'lodging.txt',
        mimetype: '',
        createdon: '2025-03-24T14:06:52.893Z',
      },
      {
        documentId: '887ead10-d849-428c-b83b-50a05434rtfe',
        filename: 'meal.txt',
        mimetype: '',
        createdon: '2025-03-24T14:06:52.893Z',
      },
      {
        documentId: '887ead10-d849-428c-b83b-50a053re44wr',
        filename: 'other.txt',
        mimetype: '',
        createdon: '2025-03-24T14:06:52.893Z',
      },
    ];
    return res.json(details);
  },
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
  'POST /travel_pay/v0/complex_claims': (req, res) => {
    return res.json({
      claimId: 'bd427107-91ac-4a4a-94ae-177df5aa32dc',
    });
  },

  // Submitting a complex claim
  'PATCH /travel_pay/v0/complex_claims/:claimId/submit': (req, res) => {
    return res.json({
      id: req.params.claimId,
    });
  },

  // Creating expenses
  'POST /travel_pay/v0/claims/:claimId/expenses/mileage': (req, res) => {
    return res.json({
      id: 'a48d48d4-cdc5-4922-8355-c1a9b2742feb',
    });
  },
  'POST /travel_pay/v0/claims/:claimId/expenses/parking': (req, res) => {
    return res.json({
      id: 'e82h82h8-ghg9-8e66-c799-g5ed16186jif',
    });
  },
  'POST /travel_pay/v0/claims/:claimId/expenses/toll': (req, res) => {
    return res.json({
      id: 'f93i93i9-hih0-9f77-d800-h6fe27297kjg',
    });
  },
  'POST /travel_pay/v0/claims/:claimId/expenses/commoncarrier': (req, res) => {
    return res.json({
      id: 'g04j04j0-iji1-0g88-e911-i7gf38308lkh',
    });
  },
  'POST /travel_pay/v0/claims/:claimId/expenses/airtravel': (req, res) => {
    return res.json({
      id: 'h15k15k1-jkj2-1h99-f022-j8hg49419mli',
    });
  },
  'POST /travel_pay/v0/claims/:claimId/expenses/lodging': (req, res) => {
    return res.json({
      id: 'b59e59e5-ded6-5b33-9466-d2ba83853gfc',
    });
  },
  'POST /travel_pay/v0/claims/:claimId/expenses/meal': (req, res) => {
    return res.json({
      id: 'c60f60f6-efe7-6c44-a577-e3cb94964hgd',
    });
  },
  'POST /travel_pay/v0/claims/:claimId/expenses/other': (req, res) => {
    return res.json({
      id: 'd71g71g7-fgf8-7d55-b688-f4dc05075ihe',
    });
  },

  // Updating expenses
  'PATCH /travel_pay/v0/expenses/:expenseType/:expenseId': (req, res) => {
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

  // Deleting documents
  'DELETE /travel_pay/v0/claims/:claimId/documents/:documentId': (req, res) => {
    return res.status(200).json({
      id: req.params.documentId,
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
