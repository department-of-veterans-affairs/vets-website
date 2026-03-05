const { appointmentsStore } = require('../mockStore');

// /**
//  * Returns a mock API handler for fetching a VAOS appointment by its ID.
//  *
//  * @param {Array} baseAppointments - Array of VAOS-style appointment objects
//  * @returns {Function} Express-style request handler (req, res)
//  */
function getAppointmentByIdHandler() {
  return (req, res) => {
    const { id } = req.params;
    const appointment = appointmentsStore[id];

    if (!appointment) {
      return res
        .status(404)
        .json({ errors: [{ detail: 'Appointment not found' }] });
    }

    return res.json({ data: appointment });
  };
}

// /**
//  * Returns a mock API handler for fetching a list of VAOS appointments.
//  *
//  * @param {Array} baseAppointments - Array of VAOS-style appointments linked to claims
//  * @returns {Function} Express-style request handler (req, res)
//  */
function getAppointmentsHandler() {
  return (req, res) => {
    const { start: startParam, end: endParam, _include } = req.query;

    let appointments = Object.values(appointmentsStore);

    // Include only claim-linked appointments if requested
    if (_include && _include.includes('travel_pay_claims')) {
      appointments = appointments.filter(
        appt => appt.attributes?.travelPayClaim,
      );
    }

    // Date filtering
    if (startParam && endParam) {
      const startDate = new Date(startParam);
      const endDate = new Date(endParam);

      appointments = appointments.filter(appt => {
        const apptStart = new Date(appt.attributes?.start);
        return apptStart >= startDate && apptStart <= endDate;
      });
    }

    return res.json({ data: appointments });
  };
}

module.exports = {
  getAppointmentByIdHandler,
  getAppointmentsHandler,
};
