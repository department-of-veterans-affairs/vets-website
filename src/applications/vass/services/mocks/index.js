/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');
const mockTopics = require('./utils/topic');

const mockUsers = [
  {
    uuid: 'c0ffee-1234-beef-5678',
    lastname: 'Smith',
    dob: '1935-04-07',
    otc: '123456',
  },
];

// Keep a count of how manny attempts to use the OTC have been made for each uuid
const otcUseCounts = new Map(); // uuid -> count
const maxOtcUseCount = 3;

const mockAppointments = [
  {
    appointmentId: 'abcdef123456',
    topics: [
      {
        topicId: '123',
        topicName: 'General Health',
      },
    ],
    dtStartUtc: '2024-07-01T14:00:00Z',
    dtEndUtc: '2024-07-01T14:30:00Z',
    // TODO: verify the accuracy of appointment payload data from API
    phoneNumber: '800-827-0611',
    providerName: 'Bill Brasky',
    typeOfCare: 'Solid Start',
  },
];
const responses = {
  'POST /vass/v0/authenticate': (req, res) => {
    const { uuid, lastname, dob } = req.body;
    const mockUser = mockUsers.find(user => user.uuid === uuid);
    if (lastname === mockUser.lastname && dob === mockUser.dob) {
      return res.json({
        data: {
          message: 'OTC sent to registered email address',
          expiresIn: 600,
        },
      });
    }
    return res.json({
      errors: [
        {
          code: 'invalid_credentials',
          detail: 'Unable to verify identity. Please check your information.',
        },
      ],
    });
  },
  'POST /vass/v0/authenticate-otc': (req, res) => {
    const { otc, uuid, lastname, dob } = req.body;
    const useCount = otcUseCounts.get(uuid) || 0;
    otcUseCounts.set(uuid, useCount + 1);
    const mockUser = mockUsers.find(user => user.uuid === uuid);
    if (
      otc === mockUser.otc &&
      lastname === mockUser.lastname &&
      dob === mockUser.dob
    ) {
      return res.json({
        data: {
          token: '<JWT token string>',
          expiresIn: 3600, // 1 hour
          tokenType: 'Bearer',
        },
      });
    }
    if (useCount >= maxOtcUseCount) {
      return res.status(401).json({
        errors: [
          {
            code: 'account_locked',
            detail: 'Too many failed attempts.  Please request a new OTC.',
            status: 401, // TODO: confirm status code
            retryAfter: 900, // 15 minutes TODO
          },
        ],
      });
    }
    return res.status(401).json({
      errors: [
        {
          code: 'invalid_otc',
          detail: 'Invalid or expired OTC.  Please try again.',
          attemptsRemaining: maxOtcUseCount - useCount,
          status: 401,
        },
      ],
    });
  },
  'POST /vass/v0/appointment': (req, res) => {
    return res.json({
      data: {
        appointmentId: 'abcdef123456',
      },
    });
  },
  'GET /vass/v0/appointment/:appointmentId': (req, res) => {
    const { appointmentId } = req.params;
    const mockAppointment = mockAppointments.find(
      appointment => appointment.appointmentId === appointmentId,
    );
    return res.json({
      data: mockAppointment,
    });
  },
  'GET /vass/v0/topics': (req, res) => {
    return res.json({
      data: {
        topics: mockTopics,
      },
    });
  },
};

module.exports = delay(responses, 1000);
