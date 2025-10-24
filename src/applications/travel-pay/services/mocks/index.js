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
  return {
    ...appt,
    data: {
      ...appt.data,
      id,
      attributes: {
        ...appt.data.attributes,
        id,
        localStartTime,
        start,
        end,
      },
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

  // Individual appointment endpoints that match our appointments list
  'GET /vaos/v2/appointments/167325': (req, res) => {
    const dates = generateAppointmentDates(-1); // 1 day ago
    const appointmentData = overrideAppointment(
      appointment.noClaim,
      '167325',
      dates,
    );
    return res.json(appointmentData);
  },

  'GET /vaos/v2/appointments/167326': (req, res) => {
    const dates = generateAppointmentDates(-3); // 3 days ago
    return res.json(overrideAppointment(appointment.claim, '167326', dates));
  },

  'GET /vaos/v2/appointments/167327': (req, res) => {
    const dates = generateAppointmentDates(-32); // 32 days ago
    return res.json(overrideAppointment(appointment.noClaim, '167327', dates));
  },
  // Get appointments
  'GET /vaos/v2/appointments': (req, res) => {
    const appointments = [
      appointment.noClaim,
      appointment.claim,

      // >30 days appointment
      appointment.noClaim,
    ].map((a, index, array) => {
      // Generate dates within 30 days of current date
      let daysOffset;
      let appointmentId;

      // Make the last appointment be 32 days old
      if (index === array.length - 1) {
        daysOffset = -32; // 32 days in the past
        appointmentId = '167327';
      } else {
        daysOffset = -(index * 2 + 1); // Space other appointments 2 days apart in the past, starting at 1 day ago
        appointmentId = index === 0 ? '167325' : '167326';
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
