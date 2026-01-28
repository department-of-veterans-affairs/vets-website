const clinics = require('../../v2/clinics_983.json');

function postAppointmentHandler(req, res) {
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
  const selectedClinic = clinics.data.filter(
    clinic => clinic.id === req.body.clinic,
  );
  const providerNpi = practitioners[0]?.identifier[0].value;
  const pending = req.body.status === 'proposed';
  const future = req.body.status === 'booked';

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

  const tokens = req.body.slot?.id.split('|');
  const response = {
    id: `mock${global.currentMockId}`,
    attributes: {
      ...req.body,
      cancellable: true,
      contact: {
        telecom: [
          { type: 'phone', value: '6195551234' },
          { type: 'email', value: 'myemail72585885@unattended.com' },
        ],
      },
      created: new Date().toISOString(),
      future,
      id: `mock${global.currentMockId}`,
      kind,
      localStartTime: req.body.slot?.id ? tokens[2] : null, // TODO: Default to current date????
      modality,
      patientComments,
      pending,
      physicalLocation: selectedClinic[0]?.attributes.physicalLocation || null,
      preferredProviderName: providerNpi ? providerMock[providerNpi] : null,
      start: req.body.slot?.id ? tokens[2] : null, // TODO: Default to current date????
      type,
    },
  };

  global.currentMockId += 1;
  global.database?.push(response);

  return res.json({ data: response });
}
exports.postAppointmentHandler = postAppointmentHandler;
