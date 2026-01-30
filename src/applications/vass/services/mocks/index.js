/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');
const mockTopics = require('./utils/topic');
const { generateSlots, createMockJwt } = require('../../utils/mock-helpers');
const { decodeJwt } = require('../../utils/jwt-utils');
const { createAppointmentData } = require('../../utils/appointments');
const {
  createOTPInvalidError,
  createOTPAccountLockedError,
  createRateLimitExceededError,
  createVassApiError,
  createServiceError,
  createUnauthorizedError,
  createInvalidCredentialsError,
  createNotWithinCohortError,
} = require('./utils/errors');

const mockUUIDs = Object.freeze({
  'c0ffee-1234-beef-5678': {
    lastName: 'Smith',
    dob: '1935-04-07',
    otp: '123456',
    email: 's****@email.com',
  },
  'authenticate-otc-vass-api-error': {
    lastName: 'Smith',
    dob: '1935-04-07',
    otp: '123456',
    email: 's****@email.com',
  },
  'authenticate-otc-service-error': {
    lastName: 'Smith',
    dob: '1935-04-07',
    otp: '123456',
    email: 's****@email.com',
  },
  'not-within-cohort': {
    lastName: 'Smith',
    dob: '1935-04-07',
    otp: '123456',
    email: 's****@email.com',
  },
});

// uuid -> date string of last attempt in ISO 8601 format (UTC) delimited by count of attempts example: '2026-01-12T10:00:00Z|1'
const lowAuthVerifications = new Map();
const maxLowAuthVerifications = 3;
const lowAuthVerificationTimeout = 15 * 60 * 1000; // 15 minutes

// Keep a count of how manny attempts to use the OTC have been made for each uuid
const otpUseCounts = new Map(); // uuid -> count
const maxOtpUseCount = 5;

const mockAppointments = [createAppointmentData()];

const responses = {
  'POST /vass/v0/request-otp': (req, res) => {
    const { uuid, lastName, dob } = req.body;

    if (uuid === 'authenticate-vass-api-error') {
      return res.status(500).json(createVassApiError());
    }
    if (uuid === 'authenticate-service-error') {
      return res.status(500).json(createServiceError());
    }

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
    if (lastName === mockUser?.lastName && dob === mockUser?.dob) {
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
      return res.status(401).json(createRateLimitExceededError(900));
    }

    return res.status(401).json(createInvalidCredentialsError());
  },
  'POST /vass/v0/authenticate-otp': (req, res) => {
    const { otp, uuid, lastName, dob } = req.body;
    if (uuid === 'authenticate-otc-vass-api-error') {
      return res.status(500).json(createVassApiError());
    }
    if (uuid === 'authenticate-otc-service-error') {
      return res.status(500).json(createServiceError());
    }
    const useCount = otpUseCounts.get(uuid) || 0;
    otpUseCounts.set(uuid, useCount + 1);
    const mockUser = mockUUIDs[uuid];
    if (
      otp === mockUser?.otp &&
      lastName === mockUser?.lastName &&
      dob === mockUser?.dob
    ) {
      otpUseCounts.delete(uuid); // reset the use count on successful verification to allow for new attempts
      const expiresIn = 3600; // 1 hour
      return res.json({
        data: {
          token: createMockJwt(uuid, expiresIn),
          expiresIn,
          tokenType: 'Bearer',
        },
      });
    }
    if (useCount >= maxOtpUseCount) {
      return res.status(401).json(createOTPAccountLockedError(900));
    }
    return res
      .status(401)
      .json(createOTPInvalidError(maxOtpUseCount - useCount));
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
  'GET /vass/v0/appointment-availability': (req, res) => {
    const { headers } = req;
    const [, token] = headers.authorization?.split(' ') || [];
    const tokenPayload = decodeJwt(token);

    const uuid = tokenPayload?.payload?.sub;
    if (!token || !uuid) {
      return res.status(401).json(createUnauthorizedError());
    }

    if (uuid === 'not-within-cohort') {
      return res.status(401).json(createNotWithinCohortError());
    }

    return res.json({
      data: {
        appointmentId: uuid,
        availableSlots: generateSlots(),
      },
    });
  },
  'POST /vass/v0/appointment/:appointmentId/cancel': (req, res) => {
    const { headers } = req;
    const [, token] = headers.authorization?.split(' ') || [];
    const tokenPayload = decodeJwt(token);

    const uuid = tokenPayload?.payload?.sub;
    if (!token || !uuid) {
      return res.status(401).json(createUnauthorizedError());
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
