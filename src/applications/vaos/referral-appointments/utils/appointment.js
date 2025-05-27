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
      name: 'Dr. Jane Smith',
      practice: 'Springfield Medical Group',
      address: {
        street1: '123 Medical Dr',
        street2: 'Suite 456',
        city: 'Springfield',
        state: 'VA',
        zip: '22150',
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
