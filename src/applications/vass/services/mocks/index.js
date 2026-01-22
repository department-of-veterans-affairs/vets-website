/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');
const mockTopics = require('./utils/topic');
const { generateSlots, createMockJwt } = require('../../utils/mock-helpers');
const { decodeJwt } = require('../../utils/auth');

const mockUUIDs = Object.freeze({
  'c0ffee-1234-beef-5678': {
    lastname: 'Smith',
    dob: '1935-04-07',
    otc: '123456',
    email: 's****@email.com',
  },
});

// uuid -> date string of last attempt in ISO 8601 format (UTC) delimited by count of attempts example: '2026-01-12T10:00:00Z|1'
const lowAuthVerifications = new Map();
const maxLowAuthVerifications = 3;
const lowAuthVerificationTimeout = 15 * 60 * 1000; // 15 minutes

// Keep a count of how manny attempts to use the OTC have been made for each uuid
const otcUseCounts = new Map(); // uuid -> count
const maxOtcUseCount = 5;

const mockAppointments = [
  {
    appointmentId: 'abcdef123456',
    // Currently the appointment GET api does not return topics, so we are not mocking them
    // ideally VASS adds these values to the appointment GET api response
    // topics: [
    //   {
    //     topicId: '123',
    //     topicName: 'General Health',
    //   },
    // ],
    startUTC: '2025-12-24T10:00:00Z',
    endUTC: '2025-12-24T10:30:00Z',
    agentId: '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
    agentNickname: 'Bill Brasky',
    appointmentStatusCode: 1,
    appointmentStatus: 'Confirmed',
    cohortStartUtc: '2025-12-01T00:00:00Z',
    cohortEndUtc: '2026-02-28T23:59:59Z',
  },
];

const responses = {
  'POST /vass/v0/authenticate': (req, res) => {
    const { uuid, lastname, dob } = req.body;
    let attemptCount = 0;
    const [lastAttempt, attemptCountStr] = lowAuthVerifications
      .get(uuid)
      ?.split('|') || [new Date().toISOString(), '0'];

    attemptCount = parseInt(attemptCountStr, 10);

    if (
      new Date(lastAttempt) < new Date(Date.now() - lowAuthVerificationTimeout)
    ) {
      // Reset the attempt count if the last attempt was more than 15 minutes ago
      attemptCount = 0;
    }

    // Increment the attempt count
    lowAuthVerifications.set(
      uuid,
      `${new Date().toISOString()}|${attemptCount + 1}`,
    );
    const mockUser = mockUUIDs[uuid];
    if (lastname === mockUser?.lastname && dob === mockUser?.dob) {
      lowAuthVerifications.delete(uuid);
      return res.json({
        data: {
          message: 'OTC sent to registered email address',
          expiresIn: 600,
          email: mockUser.email,
        },
      });
    }
    if (attemptCount >= maxLowAuthVerifications) {
      return res.status(401).json({
        errors: [
          {
            code: 'rate_limit_exceeded',
            detail: 'Too many OTC requests.  Please try again later.',
            retryAfter: 900,
          },
        ],
      });
    }

    return res.status(401).json({
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
    const mockUser = mockUUIDs[uuid];
    if (
      otc === mockUser?.otc &&
      lastname === mockUser?.lastname &&
      dob === mockUser?.dob
    ) {
      otcUseCounts.delete(uuid); // reset the use count on successful verification to allow for new attempts
      const expiresIn = 3600; // 1 hour
      return res.json({
        data: {
          token: createMockJwt(uuid, expiresIn),
          expiresIn,
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
  'GET /vass/v0/appointment-availablity': (req, res) => {
    const { headers } = req;
    const token = headers.authorization;
    if (!token) {
      return res.status(401).json({
        errors: [{ code: 'unauthorized', detail: 'Unauthorized' }],
      });
    }
    const uuid = decodeJwt(token).sub;
    return res.json({
      data: {
        appointmentId: uuid,
        availableTimeSlots: generateSlots(),
      },
    });
  },
};

module.exports = delay(responses, 1000);
