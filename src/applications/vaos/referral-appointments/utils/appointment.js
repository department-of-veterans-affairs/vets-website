const appointmentData = {
  appointment: {
    id: 'qdm61cJ5',
    status: 'booked',
    patientIcn: 'care-nav-patient-casey',
    created: '2025-02-10T14:35:44Z',
    locationId: 'sandbox-network-5vuTac8v',
    clinic: 'Aq7wgAux',
    start: '2024-11-21T18:00:00Z',
    referralId: '12345',
    referral: {
      referralNumber: '12345',
      facilityName: 'Linda Loma',
      facilityPhone: '555-555-5555',
      typeOfCare: 'Physical Therapy',
      modality: 'In Person',
    },
  },
  provider: {
    id: 'test-provider-id',
    name: 'Dr. Bones',
    isActive: true,
    individualProviders: [
      {
        name: 'Dr. Bones',
        npi: 'test-npi',
      },
    ],
    providerOrganization: {
      name: 'Meridian Health',
    },
    location: {
      name: 'Test Medical Complex',
      address: '207 Davishill Ln',
      latitude: 33.058736,
      longitude: -80.032819,
      timezone: 'America/New_York',
    },
    networkIds: ['sandbox-network-test'],
    schedulingNotes:
      'New patients need to send their previous records to the office prior to their appt.',
    appointmentTypes: [
      {
        id: 'off',
        name: 'Office Visit',
        isSelfSchedulable: true,
      },
    ],
    specialties: [
      {
        id: 'test-id',
        name: 'Urology',
      },
    ],
    visitMode: 'phone',
    features: null,
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
    appointment: { ...draftResponse?.appointment, status, id },
  };
};

module.exports = { createMockEpsAppointment, appointmentData };
