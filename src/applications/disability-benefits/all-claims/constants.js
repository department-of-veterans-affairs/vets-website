import disabilityLabels from './content/disabilityLabels';

export const itfStatuses = {
  active: 'active',
  expired: 'expired',
  claimRecieved: 'claim_recieved',
  duplicate: 'duplicate',
  incomplete: 'incomplete',
};

export const RESERVE_GUARD_TYPES = {
  nationalGuard: 'National Guard',
  reserve: 'Reserve',
};

export const PCIU_STATES = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'American Samoa', value: 'AS' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'Armed Forces Americas (AA)', value: 'AA' },
  { label: 'Armed Forces Europe (AE)', value: 'AE' },
  { label: 'Armed Forces Pacific (AP)', value: 'AP' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District Of Columbia', value: 'DC' },
  { label: 'Federated States Of Micronesia', value: 'FM' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Guam', value: 'GU' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Marshall Islands', value: 'MH' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Northern Mariana Islands', value: 'MP' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Palau', value: 'PW' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Philippine Islands', value: 'PI' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'U.S. Minor Outlying Islands', value: 'UM' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virgin Islands', value: 'VI' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];

export const STATE_LABELS = PCIU_STATES.map(state => state.label);
export const STATE_VALUES = PCIU_STATES.map(state => state.value);

export const MILITARY_STATE_VALUES = ['AA', 'AE', 'AP'];
export const MILITARY_STATE_LABELS = [
  'Armed Forces Americas (AA)',
  'Armed Forces Europe (AE)',
  'Armed Forces Pacific (AP)',
];

export const MILITARY_CITIES = ['APO', 'DPO', 'FPO'];
export const USA = 'USA';

export const ADDRESS_PATHS = {
  mailingAddress: 'mailingAddress',
  forwardingAddress: 'forwardingAddress',
};

export const HOMELESSNESS_TYPES = {
  atRisk: 'atRisk',
  homeless: 'homeless',
  notHomeless: 'no',
};

export const AT_RISK_HOUSING_TYPES = {
  losingHousing: 'losingHousing',
  leavingShelter: 'leavingShelter',
  other: 'other',
};

export const HOMELESS_HOUSING_TYPES = {
  shelter: 'shelter',
  notShelter: 'notShelter',
  anotherPerson: 'anotherPerson',
  other: 'other',
};

export const SERVICE_CONNECTION_TYPES = {
  notServiceConnected: 'NOTSVCCON',
  serviceConnected: 'SVCCONNCTED',
};

export const DATA_PATHS = {
  hasVAEvidence:
    'view:hasEvidenceFollowUp.view:selectableEvidenceTypes.view:hasVaMedicalRecords',
  hasPrivateEvidence:
    'view:hasEvidenceFollowUp.view:selectableEvidenceTypes.view:hasPrivateMedicalRecords',
  hasPrivateRecordsToUpload:
    'view:uploadPrivateRecordsQualifier.view:hasPrivateRecordsToUpload',
  hasAdditionalDocuments:
    'view:hasEvidenceFollowUp.view:selectableEvidenceTypes.view:hasOtherEvidence',
};

export const VA_FORM4142_URL =
  'https://www.vba.va.gov/pubs/forms/VBA-21-4142-ARE.pdf';

export const VA_FORM4192_URL =
  'https://www.vba.va.gov/pubs/forms/VBA-21-4192-ARE.pdf';

export const TWENTY_FIVE_MB = 26214400;

export const FIFTY_MB = 52428800;

export const PTSD_MATCHES = [
  'ptsd',
  'post traumatic stress disorder',
  'post-traumatic stress disorder',
  'post traumatic stress',
  'post-traumatic stress',
];

// Max number of incident iterations a user can go through.
export const PTSD_INCIDENT_ITERATION = 3;

export const NINE_ELEVEN = '2001-09-11';

export const ERR_MSG_CSS_CLASS = '.usa-input-error-message';

export const submissionStatuses = {
  // Statuses returned by the API
  pending: 'try', // Submitted to EVSS, waiting response
  retry: 'retryable_error',
  succeeded: 'success', // Submitted to EVSS, received response
  exhausted: 'exhausted', // EVSS is down or something; ran out of retries
  failed: 'non_retryable_error', // EVSS responded with some error
  // When the api serves a failure
  apiFailure: 'apiFailure',
};

export const terminalStatuses = new Set([
  submissionStatuses.succeeded,
  submissionStatuses.exhausted,
  submissionStatuses.retry,
  submissionStatuses.failed,
]);

export const accountTitleLabels = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  NOBANK: 'No Bank Account',
};

export const disabilityActionTypes = {
  INCREASE: 'INCREASE',
  NONE: 'NONE',
};

export const causeTypes = {
  NEW: 'NEW',
  SECONDARY: 'SECONDARY',
  WORSENED: 'WORSENED',
  VA: 'VA',
};

export const specialIssueTypes = {
  POW: 'POW',
};

export const PTSD_CHANGE_LABELS = {
  changeAssignment:
    'Sudden requests for a change in occupational series or duty assignment',
  increasedLeave: 'Increased use of leave',
  withoutLeave: 'AWOL - Absent without leave',
  performanceChanges: 'Changes in performance and performance evaluations',
  economicChanges: 'Economic changes',
  resign: 'Resigning from your job',
  increasedVisits:
    'Increased visits to a medical or counseling clinic or dispensary, even without a specific diagnosis or specific ailment',
  pregnancyTests: 'Pregnancy tests around the time of the incident',
  hivTests: 'Tests for HIV or sexually transmitted diseases',
  weightChanges: 'Extreme weight loss or gain',
  lethargy: 'Lethargy',
  breakup: 'Breakup of primary relationship',
  increasedDisregard: 'Increased disregard for military or civilian authority',
  withdrawal: 'Withdrawal from friends',
  unexplained: 'Unexplained social behavior changes',
  depression:
    'Episodes of depression, panic attacks, or anxiety without an identifiable cause',
  obsessive: 'Obsessive behaviors',
  prescription:
    'Increased or decreased use of prescription medications or over-the-counter medications',
  substance: 'Substance abuse such as alcohol or drugs',
  hypervigilance: 'Hypervigilance, heightened fight or flight response',
  agoraphobia: 'Staying at home, not wanting to go out, agoraphobia',
  fear: 'Increased fear of surroundings, inability to go to certain areas',
};

// KEYS on formData that contain uploaded files that need to be added to attachments
export const ATTACHMENT_KEYS = [
  'form781Upload',
  'form781aUpload',
  'form8940Upload',
  'form4192Upload',
  'privateMedicalRecordAttachments',
  'additionalDocuments',
  'unemployabilitySupportingDocuments',
  'secondaryUploadSources0',
  'secondaryUploadSources1',
  'secondaryUploadSources2',
];

export const LOWERED_DISABILITY_DESCRIPTIONS = Object.values(
  disabilityLabels,
).map(v => v.toLowerCase());

export const HELP_TEXT_CLICKED_EVENT = 'help-text-label';

export const ANALYTICS_EVENTS = {
  openedPrivateRecordsAcknowledgment: {
    event: 'form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 4142 - Private Medical Records: Read the full text',
  },
  openedPrivateChoiceHelp: {
    event: 'form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 4142 - Private Medical Records: Which should I choose',
  },
  openedLimitedConsentHelp: {
    event: 'form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 4142 - Private Medical Records Release: What does this mean',
  },
};
