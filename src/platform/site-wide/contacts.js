/**
 * Map of phone numbers to descriptions. This is only intended for documentation
 * purposes. Use CONTACTS.<key> to get the actual phone number.
 */
export const contactsMap = Object.freeze({
  '222_VETS': { phoneNumber: '8772228387', description: 'VA Help Line' },
  '4AID_VET': {
    phoneNumber: '8774243838',
    description: 'National Call Center for Homeless Veterans',
  },
  711: { phoneNumber: '711', description: 'Telecommunications Relay Service' },
  911: { phoneNumber: '911', description: '911' },
  CAREGIVER: {
    phoneNumber: '8552603274',
    description: 'VA National Caregiver Support Line',
  },
  CRISIS_LINE: {
    phoneNumber: '8002738255',
    description: 'Veterans Crisis hotline',
  },
  CRISIS_TTY: {
    phoneNumber: '8007994889',
    description: 'Veterans Crisis hotline TTY',
  },
  DMC: { phoneNumber: '8008270648', description: 'Debt Management Center' },
  DMC_OVERSEAS: {
    phoneNumber: '6127136415',
    description: 'Debt Management Center (Overseas)',
  },
  DMDC_DEERS: {
    phoneNumber: '8663632883',
    description:
      'Defense Manpower Data Center (DMDC) | Defense Enrollment Eligibility Reporting System (DEERS) Support Office',
  },
  DS_LOGON: {
    phoneNumber: '8005389552',
    description: 'Defense Manpower Data Center',
  },
  DS_LOGON_TTY: {
    phoneNumber: '8663632883',
    description: 'Defense Manpower Data Center TTY',
  },
  FEDERAL_RELAY_SERVICE: {
    phoneNumber: '8008778339',
    description: 'Federal Relay Service',
  },
  GI_BILL: {
    phoneNumber: '8884424551',
    description: 'Education Call Center (1-888-GI-BILL-1)',
  },
  GO_DIRECT: {
    phoneNumber: '8003331795',
    description: 'Go Direct/Direct Express (Treasury)',
  },
  HELP_DESK: { phoneNumber: '8006982411', description: 'VA Help desk' },
  HEALTHCARE_ELIGIBILITY_CENTER: {
    phoneNumber: '8554888440',
    description: 'VA Healthcare Eligibility Center (Eligibility Division)',
  },
  HELP_TTY: { phoneNumber: '8008778339', description: 'VA Help Desk TTY' },
  MY_HEALTHEVET: {
    phoneNumber: '8773270022',
    description: 'My HealtheVet help desk',
  },
  NCA: {
    phoneNumber: '8005351117',
    description: 'National Cemetery Scheduling Office',
  },
  SUICIDE_PREVENTION_LIFELINE: {
    phoneNumber: '8007994889',
    description: 'Suicide Prevention Line',
  },
  TESC: {
    phoneNumber: '8882242950',
    description: 'U.S. Treasury Electronic Payment Solution Center',
  },
  TREASURY_DMS: {
    phoneNumber: '8888263127',
    description: 'U.S. Department of the Treasury (Debt Management Services)',
  },
  // VA_311 used before the number changed to include 411
  VA_311: { phoneNumber: '8006982411', description: 'VA Help desk (VA411)' },
  VA_411: { phoneNumber: '8006982411', description: 'VA Help desk (VA411)' },
  VA_BENEFITS: {
    phoneNumber: '8008271000',
    description: 'Veterans Benefits Assistance',
  },
});

/**
 * Map of phone numbers. CONTACTS.GI_BILL, for example, will return the phone
 * number defined in contactsMap.
 */
export const CONTACTS = Object.freeze(
  Object.entries(contactsMap).reduce(
    (allContacts, currentContact) => ({
      ...allContacts,
      [currentContact[0]]: currentContact[1].phoneNumber,
    }),
    {},
  ),
);
