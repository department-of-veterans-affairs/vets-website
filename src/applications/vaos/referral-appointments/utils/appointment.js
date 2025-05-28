const appointmentData = {
  id: 'yyQYn7be',
  type: 'epsAppointment',
  attributes: {
    id: '1YuyeLuc',
    status: 'booked',
    start: '2025-05-27T15:00:00Z',
    typeOfCare: null,
    isLatest: true,
    lastRetrieved: '2025-05-27T19:30:50Z',
    modality: 'OV',
    provider: {
      id: '8is2_VVQ',
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
    },
    referringFacility: {},
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
