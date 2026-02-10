const { NON_MATCHING_APPOINTMENTS } = require('./appointmentData');

const appointmentTemplates = {
  original: require('../vaos-appointment-original.json'),
  claim: require('../vaos-appointment-with-claim.json'),
  savedClaim: require('../vaos-appointment-with-saved-claim.json'),
  noClaim: require('../vaos-appointment-no-claim.json'),
};
/**
 * Returns a mock API handler for fetching a VAOS appointment by its ID.
 *
 * @param {Array} baseAppointments - Array of VAOS-style appointment objects
 * @returns {Function} Express-style request handler (req, res)
 */
function getAppointmentByIdHandler(baseAppointments) {
  return (req, res) => {
    // Extract the appointment ID from the URL parameters
    const { id } = req.params;

    // Look for an appointment in the mock store with a matching ID
    const appointment = baseAppointments.find(appt => appt?.id === id);

    // If no appointment is found, return a 404 Not Found response
    if (!appointment) {
      return res.status(404).json({
        errors: [{ detail: 'Appointment not found in mock store' }],
      });
    }

    // Return the matching appointment wrapped in a 'data' object to mimic VAOS API response
    return res.json({ data: appointment });
  };
}

/**
 * Returns a mock API handler for fetching a list of VAOS appointments.
 *
 * @param {Array} baseAppointments - Array of VAOS-style appointments linked to claims
 * @returns {Function} Express-style request handler (req, res)
 */
function getAppointmentsHandler(baseAppointments) {
  return (req, res) => {
    // Extract query parameters for date filtering and inclusion of travel-pay claim appointments
    const { start: startParam, end: endParam, _include } = req.query;

    let appointments = [];

    // Only include claim-linked appointments when explicitly requested
    if (_include && _include.includes('travel_pay_claims')) {
      appointments = baseAppointments;
    }

    // Build non-claim VAOS appointments
    const nonMatchingAppointments = NON_MATCHING_APPOINTMENTS.map(a => ({
      ...appointmentTemplates.noClaim.data,
      id: a.id,
      type: 'appointments',
      attributes: {
        ...appointmentTemplates.noClaim.data.attributes,
        id: a.id,
        localStartTime: a.localStartTime,
        start: a.start,
        end: a.end,
      },
    }));

    // Combine claim-linked appointments and static non-claim appointments
    const combinedAppointments = [...appointments, ...nonMatchingAppointments];

    // Apply date filtering if provided
    let filteredAppointments = combinedAppointments;
    if (startParam && endParam) {
      const startDate = new Date(startParam);
      const endDate = new Date(endParam);

      filteredAppointments = combinedAppointments.filter(appt => {
        const startStr = appt.attributes?.start;
        if (!startStr) return false;
        const apptStart = new Date(startStr);
        return apptStart >= startDate && apptStart <= endDate;
      });
    }

    // Return filtered appointments in a 'data' array to mimic VAOS API response
    return res.json({ data: filteredAppointments });
  };
}

module.exports = {
  getAppointmentByIdHandler,
  getAppointmentsHandler,
};
