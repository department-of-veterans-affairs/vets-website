/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');
const mockTopics = require('./utils/topic');
const { generateSlots, createMockJwt } = require('../../utils/mock-helpers');
const { decodeJwt } = require('../../utils/jwt-utils');
const { createAppointmentData } = require('../../utils/appointments');

const mockUsers = [
  {
    uuid: 'c0ffee-1234-beef-5678',
    lastname: 'Smith',
    dob: '1935-04-07',
    otc: '123456',
  },
  {
    uuid: 'has-appointment',
    lastname: 'Smith',
    dob: '1935-04-07',
    otc: '123456',
  },
];

// Keep a count of how many attempts to use the OTC have been made for each uuid
const otcUseCounts = new Map(); // uuid -> count
const maxOtcUseCount = 5;

const mockAppointments = [createAppointmentData()];

// Track which UUIDs have existing appointments
// For testing: 'has-appointment' UUID will have an existing appointment
const userAppointments = new Map([['has-appointment', mockAppointments[0]]]);

const responses = {
  'POST /vass/v0/authenticate': (req, res) => {
    const { uuid, lastname, dob } = req.body;
    const mockUser = mockUsers.find(user => user.uuid === uuid);
    if (mockUser && lastname === mockUser.lastname && dob === mockUser.dob) {
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
      mockUser &&
      otc === mockUser.otc &&
      lastname === mockUser.lastname &&
      dob === mockUser.dob
    ) {
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
    const { headers } = req;
    const token = headers.authorization;
    if (!token) {
      return res.status(401).json({
        errors: [{ code: 'unauthorized', detail: 'Unauthorized' }],
      });
    }

    const [, tokenValue] = token.split(' ');
    const tokenPayload = decodeJwt(tokenValue);
    const uuid = tokenPayload?.payload?.sub;

    // Check if user already has an appointment
    const existingAppointment = userAppointments.get(uuid);

    if (existingAppointment) {
      return res.status(409).json({
        errors: [
          {
            code: 'appointment_already_booked',
            detail: 'already scheduled',
            appointment: {
              appointmentId: existingAppointment.appointmentId,
              dtStartUTC: existingAppointment.startUTC,
              dtEndUTC: existingAppointment.endUTC,
            },
          },
        ],
      });
    }

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
  'GET /vass/v0/appointment-availability': (req, res) => {
    const { headers } = req;
    const [, token] = headers.authorization?.split(' ') || [];
    const tokenPayload = decodeJwt(token);

    const uuid = tokenPayload?.payload?.sub;
    if (!token || !uuid) {
      return res.status(401).json({
        errors: [{ code: 'unauthorized', detail: 'Unauthorized' }],
      });
    }
    return res.json({
      data: {
        appointmentId: uuid,
        availableTimeSlots: generateSlots(),
      },
    });
  },
  'POST /vass/v0/appointment/:appointmentId/cancel': (req, res) => {
    const { headers } = req;
    const [, token] = headers.authorization?.split(' ') || [];
    const tokenPayload = decodeJwt(token);

    const uuid = tokenPayload?.payload?.sub;
    if (!token || !uuid) {
      return res.status(401).json({
        errors: [{ code: 'unauthorized', detail: 'Unauthorized' }],
      });
    }
    const { appointmentId } = req.params;
    return res.json({
      data: {
        appointmentId,
      },
    });
  },
};

module.exports = delay(responses, 1000);
