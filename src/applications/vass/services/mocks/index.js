/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');
const { addDays, setHours, setMinutes, addMinutes } = require('date-fns');

/**
 * Generates appointment time slots for weekdays over a specified period.
 * Creates slots starting at 8 AM with 30-minute intervals, excluding weekends.
 */
const generateSlots = (numberOfDays = 14, slotsPerDay = 18) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate time slots (8 AM, 8:30 AM, 9 AM, etc.)
  const timeSlots = Array.from(
    { length: slotsPerDay },
    (_, index) => 8 + index * 0.5,
  );

  const days = Array.from({ length: numberOfDays }, (_, index) =>
    addDays(today, index + 1),
  ).filter(date => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Skip weekends
  });

  return days.flatMap(date => {
    return timeSlots.map(hour => {
      const hours = Math.floor(hour);
      const minutes = (hour % 1) * 60;
      const slotStart = setMinutes(setHours(date, hours), minutes);
      const slotEnd = addMinutes(slotStart, 30);

      return {
        dtStartUtc: slotStart.toISOString(),
        dtEndUtc: slotEnd.toISOString(),
      };
    });
  });
};

const mockUsers = [
  {
    uuid: 'c0ffee-1234-beef-5678',
    lastname: 'Smith',
    dob: '1935-04-07',
    otc: '123456',
  },
];

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
    const mockUser = mockUsers.find(user => user.uuid === uuid);
    if (
      otc === mockUser.otc &&
      lastname === mockUser.lastname &&
      dob === mockUser.dob
    ) {
      return res.json({
        data: {
          token: '<JWT token string>',
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      });
    }
    return res.json({
      errors: [
        {
          code: 'invalid_otc',
          detail: 'Invalid or expired OTC.  Please try again.',
          attemptsRemaining: 3,
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
  'GET /vass/v0/appointment-availability': (req, res) => {
    const availableTimeSlots = generateSlots();
    return res.json({
      data: {
        availableTimeSlots,
      },
    });
  },
};

module.exports = delay(responses, 1000);
