const appointmentData = {
  id: '12345',
  type: 'epsAppointment',
  attributes: {
    id: 'qdm61cJ5',
    status: 'booked',
    start: '2024-11-21T18:00:00Z',
    typeOfCare: 'OPTOMETRY',
    isLatest: true,
    lastRetrieved: '2024-11-21T18:00:00Z',
    modality: 'Office Visit',
    provider: {
      id: 'DBKQ-123',
      name: 'Dr. Jane Smith',
      practice: 'Springfield Medical Group',
      phone: '(505) 248-4062',
      address: {
        street1: '123 Medical Dr',
        street2: 'Suite 456',
        city: 'Springfield',
        state: 'VA',
        zip: '22150',
      },
    },
    referringFacility: {
      name: 'Different Test Medical Complex',
      phoneNumber: '555-555-5555',
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
