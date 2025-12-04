/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

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
    timezone: 'America/New_York',
    phoneNumber: '800-827-0611',
    providerName: 'Bill Brasky',
    typeOfCare: 'VA Solid Start',
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
};

module.exports = delay(responses, 1000);
