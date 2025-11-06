const appointmentData = {
  id: 'QC9S60he',
  type: 'epsAppointment',
  attributes: {
    id: 'QC9S60he',
    status: 'booked',
    start: '2024-11-18T13:30:00Z',
    past: false,
    isLatest: true,
    lastRetrieved: '2025-10-14T15:15:07Z',
    modality: 'communityCareEps',
    provider: {
      id: 'KMWjsCY3',
      name: 'Dr. Smith @ Acme Cardiology - Anywhere, USA',
      practice: 'Acme Cardiology',
      phone: '555-555-0001',
      location: {
        name: 'Temple University Hospital - Jeanes Campus',
        address: '7500 CENTRAL AVE, STE 108, PHILADELPHIA, PA 19111-2430',
        latitude: 40.06999282694126,
        longitude: -75.08769957031448,
        timezone: 'America/New_York',
      },
    },
    location: {
      id: 'KMWjsCY3',
      type: 'appointments',
      attributes: {
        name: 'Temple University Hospital - Jeanes Campus',
        timezone: {
          timeZoneId: 'America/New_York',
        },
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
