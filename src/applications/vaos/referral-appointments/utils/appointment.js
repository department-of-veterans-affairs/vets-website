const appointmentData = {
  id: 'yyQYn7be',
  type: 'epsAppointment',
  attributes: {
    id: 'yyQYn7be',
    status: 'booked',
    start: '2024-11-18T13:30:00Z',
    isLatest: false,
    lastRetrieved: '2025-01-29T16:30:25Z',
    modality: 'OV',
    provider: {
      id: 'DBKQ-123',
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
    },
  },
};

/**
 * Creates a referral appointment object with the given id and status.
 *
 * @param {string} id - The unique identifier for the appointment.
 * @param {string} [status='draft'] - The state of the appointment. Defaults to 'draft'.
 * @param {Object} [draftResponse={}] - The draft response object.
 * @returns {Object} The referral appointment object.
 */
const createMockEpsAppointment = (
  id,
  status = 'booked',
  draftResponse = {},
) => {
  return {
    ...draftResponse,
    id,
    attributes: {
      ...draftResponse?.attributes,
      status,
      id,
    },
  };
};

module.exports = { createMockEpsAppointment, appointmentData };
