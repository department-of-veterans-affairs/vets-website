const { formatInTimeZone } = require('date-fns-tz');
const { APPOINTMENT_STATUS } = require('../../../../utils/constants');
const { findNextBusinessDay } = require('../../utils/confirmedAppointments');
const { getMockSlots } = require('../../utils/slots');
const clinics983 = require('../../v2/clinics_983.json');
const confirmed = require('../../v2/confirmed.json');

function postAppointmentHandler(req, res) {
  const MockAppointmentResponse = {
    data: confirmed.data,
  };

  const nextBusinessDay = findNextBusinessDay();
  const nextBusinessDayString = nextBusinessDay.toISOString().split('T')[0]; // Get YYYY-MM-DD format
  const nextBusinessDayAppointments = MockAppointmentResponse.data.filter(
    appointment => {
      const appointmentDate = appointment.attributes.start?.split('T')[0];
      return appointmentDate === nextBusinessDayString;
    },
  );

  const appointmentSlotsV2 = getMockSlots({
    existingAppointments: MockAppointmentResponse.data,
    futureMonths: 6,
    pastMonths: 1,
    slotsPerDay: 10,
    conflictRate: 0.4, // 40% of days with appointments will have conflicts
    forceConflictWithAppointments: nextBusinessDayAppointments,
  });

  // key: NPI, value: Provider Name
  const providerMock = {
    1801312053: 'AJADI, ADEDIWURA',
    1952935777: 'OH, JANICE',
    1992228522: 'SMAWLEY, DONNA C',
    1053355479: 'LYONS, KRISTYN',
    1396153797: 'STEWART, DARRYL',
    1154867018: 'GUILD, MICHAELA',
    1205346533: 'FREEMAN, SHARON',
    1548796501: 'CHAIB, EMBARKA',
    1780016782: 'Lawton, Amanda',
    1558874636: 'MELTON, JOY C',
    1982005708: 'OLUBUNMI, ABOLANLE A',
    1649609736: 'REISER, KATRINA',
    1770999294: 'TUCKER JONES, MICHELLE A',
    1255962510: 'OYEKAN, ADETOLA O',
    1770904021: 'Jones, Tillie',
  };

  const {
    practitioners = [{ identifier: [{ system: null, value: null }] }],
    kind,
  } = req.body;
  const selectedClinic = clinics983.data.filter(
    clinic => clinic.id === req.body.clinic,
  );
  const providerNpi = practitioners[0]?.identifier[0].value;
  const selectedTime = appointmentSlotsV2.data
    .filter(slot => slot.id === req.body.slot?.id)
    .map(slot => slot.attributes.start);

  // convert to local time in America/Denver timezone
  let localTime;
  if (selectedTime && selectedTime.length) {
    localTime = formatInTimeZone(
      selectedTime[0],
      'America/Denver',
      'yyyy-MM-ddTHH:mm:ss',
    );
  }
  const pending = req.body.status === APPOINTMENT_STATUS.proposed;
  const future = req.body.status === APPOINTMENT_STATUS.booked;
  let patientComments;
  let type;
  let modality;
  if (req.body.kind === 'cc') {
    patientComments = req.body.reasonCode?.text;
    type = pending ? 'COMMUNITY_CARE_REQUEST' : 'COMMUNITY_CARE_APPOINTMENT';
    modality = 'communityCare';
  } else {
    const tokens = req.body.reasonCode?.text?.split('|') || [];
    for (const token of tokens) {
      if (token.startsWith('comments:')) {
        patientComments = token.substring('comments:'.length);
      }
    }
    type = pending ? 'REQUEST' : 'VA';
    modality = 'vaInPerson';
  }

  const submittedAppt = {
    id: `mock${global.currentMockId}`,
    attributes: {
      ...req.body,
      created: new Date().toISOString(),
      kind,
      type,
      modality,
      localStartTime: req.body.slot?.id ? localTime : null,
      start: req.body.slot?.id ? selectedTime[0] : null,
      preferredProviderName: providerNpi ? providerMock[providerNpi] : null,
      contact: {
        telecom: [
          {
            type: 'phone',
            value: '6195551234',
          },
          {
            type: 'email',
            value: 'myemail72585885@unattended.com',
          },
        ],
      },
      physicalLocation: selectedClinic[0]?.attributes.physicalLocation || null,
      patientComments,
      future,
      pending,
    },
  };
  global.currentMockId += 1;
  global.database?.push(submittedAppt);

  return res.json({ data: submittedAppt });
}
exports.postAppointmentHandler = postAppointmentHandler;
