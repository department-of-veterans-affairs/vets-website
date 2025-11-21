const fs = require('fs');
const delay = require('mocker-api/lib/delay');

const TOGGLE_NAMES = require('../../../../platform/utilities/feature-toggles/featureFlagNames.json');
const travelClaims = require('./travel-claims-31.json');

const appointment = {
  original: require('./vaos-appointment-original.json'),
  claim: require('./vaos-appointment-with-claim.json'),
  savedClaim: require('./vaos-appointment-with-saved-claim.json'),
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

// Helper function to generate appointment dates and times
function generateAppointmentDates(daysOffset) {
  const baseDate = new Date();
  const appointmentDate = new Date(baseDate);
  appointmentDate.setDate(baseDate.getDate() + daysOffset);

  // Set appointment time to 8:00 AM local time
  appointmentDate.setHours(8, 0, 0, 0);

  // Format as ISO string with timezone offset for localStartTime
  const localStartTime = appointmentDate.toISOString().replace('Z', '-08:00');

  // Create UTC times for start and end (8:00 AM PST = 4:00 PM UTC)
  const startDate = new Date(appointmentDate);
  startDate.setHours(startDate.getHours() + 8); // Convert to UTC
  const start = startDate.toISOString();

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 30); // 30 minutes later
  const end = endDate.toISOString();

  return { localStartTime, start, end };
}

function overrideAppointment(appt, id, { localStartTime, start, end }) {
  const attributes = {
    ...appt.data.attributes,
    id,
    localStartTime,
    start,
    end,
  };

  // Preserve travelPayClaim if it exists
  if (appt.data.attributes.travelPayClaim) {
    attributes.travelPayClaim = appt.data.attributes.travelPayClaim;
  }

  return {
    ...appt,
    data: {
      ...appt.data,
      id,
      attributes,
    },
  };
}

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': maintenanceWindows.none,
  'GET /v0/user': user.withAddress,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        // Travel Pay feature flags
        { name: `${TOGGLE_NAMES.travelPayPowerSwitch}`, value: true },
        { name: `${TOGGLE_NAMES.travelPayViewClaimDetails}`, value: true },
        { name: `${TOGGLE_NAMES.travelPaySubmitMileageExpense}`, value: true },
        { name: `${TOGGLE_NAMES.travelPayClaimsManagement}`, value: true },
        {
          name: `${TOGGLE_NAMES.travelPayClaimsManagementDecisionReason}`,
          value: true,
        },
        { name: `${TOGGLE_NAMES.travelPayEnableComplexClaims}`, value: true },

        // camelCase flags for VAOS appointments mocks
        { name: 'vaOnlineScheduling', value: true },
        { name: 'travelPayViewClaimDetails', value: true },
        { name: 'travelPaySubmitMileageExpense', value: true },
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

  // Get travel-pay appointment - handle specific IDs first
  'GET /vaos/v2/appointments/:id': (req, res) => {
    const { id } = req.params;

    // Handle specific appointment IDs
    switch (id) {
      case '167325': {
        const dates = generateAppointmentDates(-1); // 1 day ago
        return res.json(
          overrideAppointment(appointment.noClaim, '167325', dates),
        );
      }
      case '167326': {
        const dates = generateAppointmentDates(-3); // 3 days ago
        return res.json(
          overrideAppointment(appointment.claim, '167326', dates),
        );
      }
      case '167327': {
        const dates = generateAppointmentDates(-32); // 32 days ago
        return res.json(
          overrideAppointment(appointment.noClaim, '167327', dates),
        );
      }
      case '167328': {
        const dates = generateAppointmentDates(-5); // 5 days ago
        return res.json(
          overrideAppointment(appointment.savedClaim, '167328', dates),
        );
      }
      case '167329': {
        const dates = generateAppointmentDates(-33); // 32 days ago
        return res.json(
          overrideAppointment(appointment.savedClaim, '167329', dates),
        );
      }
      default:
        // For any other ID, return the original mock
        return res.json(appointment.original);
    }
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
  // Get appointments
  'GET /vaos/v2/appointments': (req, res) => {
    const appointments = [
      appointment.noClaim,
      appointment.claim,
      appointment.savedClaim,

      // >30 days appointments
      appointment.noClaim,
      appointment.savedClaim,
    ].map((a, index, array) => {
      // Generate dates within 30 days of current date
      let daysOffset;
      let appointmentId;

      // Make the last two appointments be >30 days old
      if (index === array.length - 2) {
        daysOffset = -32; // 32 days in the past
        appointmentId = '167327';
      } else if (index === array.length - 1) {
        daysOffset = -33; // 33 days in the past
        appointmentId = '167329';
      } else {
        daysOffset = -(index * 2 + 1); // Space other appointments 2 days apart in the past, starting at 1 day ago
        if (index === 0) {
          appointmentId = '167325';
        } else if (index === 1) {
          appointmentId = '167326';
        } else if (index === 2) {
          appointmentId = '167328';
        }
      }

      const { localStartTime, start, end } = generateAppointmentDates(
        daysOffset,
      );

      return {
        ...a.data,
        id: appointmentId,
        type: 'appointments',
        attributes: {
          ...a.data.attributes,
          id: appointmentId,
          localStartTime,
          start,
          end,
          // Preserve travelPayClaim if it exists
          ...(a.data.attributes.travelPayClaim && {
            travelPayClaim: a.data.attributes.travelPayClaim,
          }),
        },
      };
    });
    return res.json({ data: appointments });
  },

  // Document download
  'GET /travel_pay/v0/claims/:claimId/documents/:docId': (req, res) => {
    // Document download
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
