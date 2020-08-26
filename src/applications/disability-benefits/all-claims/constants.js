import { pciuStates as PCIU_STATES } from 'vets-json-schema/dist/constants.json';

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

export { PCIU_STATES };

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

export const DISABILITY_526_V2_ROOT_URL =
  '/disability/file-disability-claim-form-21-526ez';

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

// Percent of string length used to calculate maximum levenshtein edit distance
// E.g., for a 10-char string, we'd say the max edit distance is:
// Math.ceil(10 x TYPO_THRESHOLD)
export const TYPO_THRESHOLD = 0.25;

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
  'serviceTreatmentRecordsAttachments',
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

export const PTSD_TYPES_TO_FORMS = {
  combatNonCombat: '781',
  personalAssaultSexualTrauma: '781a',
};

export const HELP_TEXT_CLICKED_EVENT = 'help-text-label';

export const ANALYTICS_EVENTS = {
  openedPrivateRecordsAcknowledgment: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 4142 - Private Medical Records: Read the full text',
  },
  openedPrivateChoiceHelp: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 4142 - Private Medical Records: Which should I choose',
  },
  openedLimitedConsentHelp: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 4142 - Private Medical Records Release: What does this mean',
  },
  openedPtsdTypeHelp: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - PTSD Intro - Which should I choose',
  },
  openedPtsd781WalkthroughChoiceHelp: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 21-0781 - Walkthrough Choice - Which should I choose',
  },
  openedPtsd781aWalkthroughChoiceHelp: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 21-0781a - Walkthrough Choice - Which should I choose',
  },
  openedPtsd781IncidentDateHelp: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 21-0781 - What if I can’t remember the date',
  },
  openedPtsd781aIncidentDateHelp: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 21-0781a - What if I can’t remember the date',
  },
  openedPtsd781aOtherSourcesHelp: {
    event: 'disability-526EZ-form-help-text-clicked',
    [HELP_TEXT_CLICKED_EVENT]:
      'Disability - Form 21-0781a - PTSD Secondary Sources - Which should I choose',
  },
};

export const NULL_CONDITION_STRING = 'Unknown Condition';

// Moment date format
export const DATE_FORMAT = 'LL';

// sessionStorage key used to show the wizard has or hasn't been completed
export const WIZARD_STATUS = 'wizardStatus';

// sessionStorage key used for the user entered separation date in the wizard
// used by the first page of the form to populate the form data
export const SAVED_SEPARATION_DATE = 'savedSeparationDate';

export const EBEN_526_PATH =
  'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation';

export const BDD_INFO_URL =
  '/disability/how-to-file-claim/when-to-file/pre-discharge-claim/';
