const appointmentData = {
  id: '12345',
  type: 'eps_appointments',
  attributes: {
    id: 'qdm61cJ5',
    status: 'not-booked',
    start: '2024-11-21T18:00:00Z',
    typeOfCare: 'Physical Therapy',
    isLatest: true,
    lastRetrieved: '2024-11-21T18:00:00Z',
    modality: 'Office Visit',
  },
  provider: {
    id: 'test-provider-id',
    name: 'Dr. Bones',
    isActive: true,
    phoneNumber: '555-555-5555',
    organization: {
      name: 'Meridian Health',
    },
    location: {
      name: 'Test Medical Complex',
      address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
      latitude: 33.058736,
      longitude: -80.032819,
      timezone: 'America/New_York',
    },
    networkIds: ['sandbox-network-test'],
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
const createMockEpsAppointment = (id, status = 'draft', draftResponse = {}) => {
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
