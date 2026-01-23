const { isWithinInterval } = require('date-fns');
const { findNextBusinessDay } = require('../utils/confirmedAppointments');
const { getMockSlots } = require('../utils/slots');
const confirmedV2 = require('../v2/confirmed.json');
const clinics983V2 = require('../v2/clinics_983.json');
const clinics984V2 = require('../v2/clinics_984.json');

const confirmedAppointmentsV3 = {
  data: confirmedV2.data,
};
const nextBusinessDay = findNextBusinessDay();
const nextBusinessDayString = nextBusinessDay.toISOString().split('T')[0]; // Get YYYY-MM-DD format
const nextBusinessDayAppointments = confirmedAppointmentsV3.data.filter(
  appointment => {
    const appointmentDate = appointment.attributes.start?.split('T')[0];
    return appointmentDate === nextBusinessDayString;
  },
);

const appointmentSlotsV2 = getMockSlots({
  existingAppointments: confirmedAppointmentsV3.data,
  futureMonths: 6,
  pastMonths: 1,
  slotsPerDay: 10,
  conflictRate: 0.4, // 40% of days with appointments will have conflicts
  forceConflictWithAppointments: nextBusinessDayAppointments,
});

const responses = {
  'GET /vaos/v2/locations/:id/clinics': (req, res) => {
    if (req.query.clinic_ids) {
      return res.json({
        data: clinics983V2.data.filter(clinic =>
          req.query.clinic_ids.includes(clinic.id),
        ),
      });
    }

    if (req.params.id === '983') {
      return res.json(clinics983V2);
    }

    if (req.params.id === '984') {
      return res.json(clinics984V2);
    }

    return res.json({
      data: [],
    });
  },
  'GET /vaos/v2/locations/:facility_id/slots': (req, res) => {
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    const slots = appointmentSlotsV2.data.filter(slot => {
      const slotStartDate = new Date(slot.attributes.start);
      return isWithinInterval(slotStartDate, { start, end });
    });
    return res.json({
      data: slots,
    });
  },
  'GET /vaos/v2/locations/:facility_id/clinics/:clinic_id/slots': (
    req,
    res,
  ) => {
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    const slots = appointmentSlotsV2.data.filter(slot => {
      const slotStartDate = new Date(slot.attributes.start);
      return isWithinInterval(slotStartDate, { start, end });
    });
    return res.json({
      data: slots,
    });
  },
};
module.exports = responses;
