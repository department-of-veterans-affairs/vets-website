const fs = require('fs');
const delay = require('mocker-api/lib/delay');
const {
  getExpenseHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
  setClaimRef,
} = require('./expenses/expenseHandlers');
const { getAppointmentById } = require('./vaos/appointmentUtils');
const { buildClaim } = require('./claims/baseClaim');
const { mockClaimsResponse } = require('./claims/baseClaimList');
const {
  STATUS_KEYS,
  EXPENSE_TYPE_OPTIONS,
  EXPENSE_TYPES,
} = require('./constants');

const TOGGLE_NAMES = require('../../../../platform/utilities/feature-toggles/featureFlagNames.json');

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

// 👉 Change the claim details here to see the different claim status for mocks
const claim = buildClaim({
  claimStatus: STATUS_KEYS.SAVED, // e.g., INCOMPLETE, SAVED, CLAIMPAID
  expenseTypeOptions: EXPENSE_TYPE_OPTIONS.ALL, // ALL | NONE | MILEAGE_ONLY
});

setClaimRef(claim);

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

  // IMPORTANT: localStartTime has proper timezone offset (e.g. -08:00 for PST)
  // This represents actual local time: 8:00 AM PST
  const localStartTime = appointmentDate.toISOString().replace('Z', '-08:00');

  // start is in true UTC (8:00 AM PST = 4:00 PM UTC)
  const startDate = new Date(appointmentDate);
  startDate.setHours(startDate.getHours() + 8); // Convert PST to UTC
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

  return {
    ...appt,
    data: {
      ...appt.data,
      id,
      attributes,
    },
  };
}

const featureTogglesResponse = {
  data: {
    type: 'feature_toggles',
    features: [
      // Travel Pay feature flags
      TOGGLE_NAMES.travelPayPowerSwitch,
      TOGGLE_NAMES.travelPayViewClaimDetails,
      TOGGLE_NAMES.travelPaySubmitMileageExpense,
      TOGGLE_NAMES.travelPayClaimsManagement,
      TOGGLE_NAMES.travelPayClaimsManagementDecisionReason,
      TOGGLE_NAMES.travelPayEnableComplexClaims,
    ]
      .map(name => ({ name, value: true }))
      .concat([
        // VAOS camelCase flags
        { name: 'vaOnlineScheduling', value: true },
        { name: 'travelPayViewClaimDetails', value: true },
        { name: 'travelPaySubmitMileageExpense', value: true },
      ]),
  },
};

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': maintenanceWindows.none,
  'GET /v0/user': user.withAddress,
  'GET /v0/feature_toggles': featureTogglesResponse,
  // Get travel-pay appointment - handle specific IDs first
  'GET /vaos/v2/appointments/:id': (req, res) => {
    return res.json(
      getAppointmentById({
        id: req.params.id,
        appointment,
        generateAppointmentDates,
        overrideAppointment,
      }),
    );
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
  // Get appointments - handles both date range queries and list view
  'GET /vaos/v2/appointments': (req, res) => {
    const { start: startParam, end: endParam } = req.query;

    // If querying by date range (used by getAppointmentDataByDateTime action)
    if (startParam && endParam) {
      const startDate = new Date(startParam);
      const endDate = new Date(endParam);

      // Create appointment matching the claim details mock datetime
      const claimDetailsDateTime = claim.appointmentDate;
      const appointmentDate = new Date(claimDetailsDateTime);

      // Check if this appointment falls within the requested range
      if (appointmentDate >= startDate && appointmentDate <= endDate) {
        // IMPORTANT: Claim's appointmentDateTime has 'Z' suffix but represents local time (bad data)
        // Convert it to proper localStartTime format with timezone offset
        // Example: "2025-03-20T16:30:00Z" (claim) -> "2025-03-20T16:30:00.000-08:00" (localStartTime)
        const localStartTime = claimDetailsDateTime.replace('Z', '.000-08:00');

        const matchingAppointment = {
          ...appointment.claim.data,
          id: claim.appointment.id,
          type: 'appointments',
          attributes: {
            ...appointment.claim.data.attributes,
            id: claim.appointment.id,
            localStartTime, // Proper format with timezone offset
            start: claimDetailsDateTime, // Keep as UTC for backend consistency
            end: new Date(
              appointmentDate.getTime() + 30 * 60 * 1000,
            ).toISOString(),
          },
        };

        // Add non-matching appointments to test filtering logic
        return res.json({
          data: [
            {
              ...appointment.noClaim.data,
              id: 'non-match-1',
              type: 'appointments',
              attributes: {
                ...appointment.noClaim.data.attributes,
                id: 'non-match-1',
                localStartTime: '2025-03-20T10:00:00.000-08:00', // Different time - won't match
                start: '2025-03-20T18:00:00Z',
                end: '2025-03-20T18:30:00Z',
              },
            },
            {
              ...appointment.noClaim.data,
              id: 'non-match-2',
              type: 'appointments',
              attributes: {
                ...appointment.noClaim.data.attributes,
                id: 'non-match-2',
                localStartTime: '2025-03-20T20:00:00.000-08:00', // Different time - won't match
                start: '2025-03-21T04:00:00Z',
                end: '2025-03-21T04:30:00Z',
              },
            },
            matchingAppointment,
          ],
        });
      }

      // Return empty array if no appointments match the range
      return res.json({ data: [] });
    }

    // Default behavior - return all appointments (list view)
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
  // Get all claims
  // 'GET /travel_pay/v0/claims'
  'GET /travel_pay/v0/claims': mockClaimsResponse,
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
  //

  // Get claim
  // GET /travel_pay/v0/claims/:id
  'GET /travel_pay/v0/claims/:id': claim,
  //
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

  // Create a new claim
  // POST /travel_pay/v0/claims
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

  // Create a new complex claim
  // POST /travel_pay/v0/complex_claims
  'POST /travel_pay/v0/complex_claims': (req, res) => {
    return res.json({
      claimId: 'bd427107-91ac-4a4a-94ae-177df5aa32dc',
    });
  },

  // Submitting a complex claim
  // PATCH /travel_pay/v0/complex_claims/:claimId/submit
  'PATCH /travel_pay/v0/complex_claims/:claimId/submit': (req, res) => {
    return res.json({
      id: req.params.claimId,
    });
  },

  // Deleting documents
  // DELETE /travel_pay/v0/claims/:claimId/documents/:documentId
  'DELETE /travel_pay/v0/claims/:claimId/documents/:documentId': (req, res) => {
    return res.status(200).json({
      id: req.params.documentId,
    });
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

EXPENSE_TYPES.forEach(type => {
  // Create new expenses
  responses[
    `POST /travel_pay/v0/claims/:claimId/expenses/${type}`
  ] = createExpenseHandler(type);

  // Get individual expense
  responses[
    `GET /travel_pay/v0/claims/:claimId/expenses/${type}/:expenseId`
  ] = getExpenseHandler(type);

  // Update expense
  responses[
    `PATCH /travel_pay/v0/expenses/${type}/:expenseId`
  ] = updateExpenseHandler();

  // Delete expense
  responses[
    `DELETE /travel_pay/v0/expenses/${type}/:expenseId`
  ] = deleteExpenseHandler();
});
module.exports = delay(responses, 1000);
