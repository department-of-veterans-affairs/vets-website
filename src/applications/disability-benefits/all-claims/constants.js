import constants from 'vets-json-schema/dist/constants.json';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { formProfileStates: FORM_PROFILE_STATES } = constants;

import {
  VA_FORM_IDS,
  VA_FORM_IDS_IN_PROGRESS_FORMS_API,
} from '@department-of-veterans-affairs/platform-forms/constants';

import { getDisabilityLabels } from './content/disabilityLabels';

export const PAGE_TITLES = {
  ALL: 'File for disability compensation',
  BDD: 'File a Benefits Delivery at Discharge claim',
};

export const PAGE_TITLE_SUFFIX = 'with VA Form 21-526EZ';
export const DOCUMENT_TITLE_SUFFIX = ' | Veterans Affairs';

export const START_TEXT = {
  ALL: 'Start the Disability Compensation Application',
  BDD: 'Start the Benefits Disability at Discharge Application',
};

export const ITF_NOTICE_TEXT = `By clicking the button to start the disability application, you’ll declare
  your intent to file. This will reserve a potential effective date for when
  you could start getting benefits. You have 1 year from the day you submit
  your intent to file to complete your application.`;

export const itfStatuses = {
  active: 'active',
  expired: 'expired',
  claimRecieved: 'claim_recieved',
  duplicate: 'duplicate',
  incomplete: 'incomplete',
  canceled: 'canceled',
};

export const RESERVE_GUARD_TYPES = {
  nationalGuard: 'National Guard',
  // Not updating to "Reserves"; used in string matching comparisons
  reserve: 'Reserve',
};

export { FORM_PROFILE_STATES };

export const STATE_LABELS = FORM_PROFILE_STATES.map(state => state.label);
export const STATE_VALUES = FORM_PROFILE_STATES.map(state => state.value);

export const MILITARY_STATE_VALUES = ['AA', 'AE', 'AP'];

export const DISABILITY_CAUSE_LABELS = {
  NEW:
    'My condition was caused by an injury or exposure during my military service.',
  SECONDARY:
    'My condition was caused by another service-connected disability I already have. (For example, I have a limp that caused lower-back problems.)',
  WORSENED:
    'My condition existed before I served in the military, but it got worse because of my military service.',
  VA:
    'My condition was caused by an injury or event that happened when I was receiving VA care.',
};
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

export const HOMELESSNESS_LABELS = {
  no: 'No',
  homeless: "I'm currently homeless.",
  atRisk: "I'm at risk of becoming homeless.",
};

export const HOMELESS_HOUSING_LABELS = {
  shelter: 'I’m living in a homeless shelter.',
  notShelter:
    'I’m living somewhere other than a shelter. (For example, I’m living in a car or a tent.)',
  anotherPerson: 'I’m living with another person.',
  other: 'Other',
};

export const AT_RISK_HOUSING_LABELS = {
  losingHousing: 'I’m losing my housing in 30 days.',
  leavingShelter: 'I’m leaving a publicly funded homeless shelter soon.',
  other: 'Other',
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
  hasMedicalRecords: 'view:hasMedicalRecords',
  hasEvidence: 'view:hasEvidence',
  hasVAEvidence: 'view:selectableEvidenceTypes.view:hasVaMedicalRecords',
  hasPrivateEvidence:
    'view:selectableEvidenceTypes.view:hasPrivateMedicalRecords',
  hasPrivateRecordsToUpload:
    'view:uploadPrivateRecordsQualifier.view:hasPrivateRecordsToUpload',
  hasAdditionalDocuments: 'view:selectableEvidenceTypes.view:hasOtherEvidence',
};

export const DATA_DOG_APP_NAME = 'Benefits Disability';
export const DATA_DOG_ID = 'c7eb541a-30d2-4a00-aba0-04965e8a2668';
export const DATA_DOG_TOKEN = 'pub300747eeaef98ae4eb9c8d66f3c747c1';
export const DATA_DOG_SERVICE = 'benefits-disability';
export const DATA_DOG_VERSION = '1.0.0';
export const DATA_DOG_TOGGLE = 'disability526BrowserMonitoringEnabled';

export const DISABILITY_526_V2_ROOT_URL =
  '/disability/file-disability-claim-form-21-526ez';

export const VA_FORM4142_URL =
  'https://www.vba.va.gov/pubs/forms/VBA-21-4142-ARE.pdf';

export const VA_FORM4192_URL =
  'https://www.vba.va.gov/pubs/forms/VBA-21-4192-ARE.pdf';

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2; // binary based

export const MAX_PDF_FILE_SIZE_MB = 99;
// binary based
export const MAX_PDF_FILE_SIZE_BYTES = MAX_PDF_FILE_SIZE_MB * 1024 ** 2;

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

export const defaultDisabilityDescriptions = {
  primaryDescription: 'This disability is related to my military service.',
  causedByDisabilityDescription:
    'This disability was caused by another condition.',
  worsenedDescription: 'This disability was worsened by military service.',
  worsenedEffects:
    'This pre-existing disability was worsened by military service.',
  vaMistreatmentDescription:
    'This disability was caused by an injury or event that happened while I was receiving VA care.',
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
  getDisabilityLabels(),
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

// new /v0/disability_compensation_in_progress_forms/21-526EZ. Not using the
// platform/forms/helpers/inProgressApi because the mock doesn't include the
// environment.API_URL
export const MOCK_SIPS_API =
  VA_FORM_IDS_IN_PROGRESS_FORMS_API[VA_FORM_IDS.FORM_21_526EZ];

export const NULL_CONDITION_STRING = 'Unknown Condition';

// Moment date format
export const DATE_FORMAT = 'LL';

// sessionStorage key used to show the wizard has or hasn't been completed
export const WIZARD_STATUS = 'wizardStatus526';
// sessionStorage key used to determine if the form title should be set to BDD
export const FORM_STATUS_BDD = 'formStatusBdd';

export const SHOW_8940_4192 = 'showSubforms';

export const SERVICE_BRANCHES = 'militaryServiceBranches';

// Session storage keys for tracking
export const TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS =
  '21-526EZ_backButtonClickCount';
export const TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS =
  '21-526EZ_continueButtonClickCount';
export const TRACKING_526EZ_SIDENAV_CLICKS = '21-526EZ_sideNavClickCount';
export const TRACKING_526EZ_SIDENAV_FORM_START = '21-526EZ_formStartTracked';
export const TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE = '21-526EZ_sidenavEnabled';

// sessionStorage key used for the user entered separation date in the wizard
// used by the first page of the form to populate the form data
export const SAVED_SEPARATION_DATE = 'savedSeparationDate';

export const EBEN_526_PATH =
  'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation';

export const BDD_INFO_URL =
  '/disability/how-to-file-claim/when-to-file/pre-discharge-claim/';

/** Public Disability Benefits Questionnaires (DBQs) page which links to the Separation Helth Assessment Part A */
export const DBQ_URL =
  'https://www.benefits.va.gov/compensation/dbq_publicdbqs.asp';

// Pull properties from the "full NEW/SECONDARY/WORSENED/VA" branch
const getNewDisabilitiesProps = () => {
  const nd = fullSchema?.definitions?.newDisabilities?.items;
  if (!nd) return {};

  // New shape: items.anyOf[0].properties
  const branch0Props = nd.anyOf?.[0]?.properties;
  if (branch0Props) return branch0Props;

  // Old shape: items.properties
  return nd.properties || {};
};

// maxLength from schema
const NEW_PROPS = getNewDisabilitiesProps();

export const CHAR_LIMITS = [
  'primaryDescription',
  'causedByDisabilityDescription',
  'worsenedDescription',
  'worsenedEffects',
  'vaMistreatmentDescription',
  'vaMistreatmentLocation',
  'vaMistreatmentDate',
].reduce((acc, key) => {
  const limit = NEW_PROPS?.[key]?.maxLength;
  return { ...acc, [key]: typeof limit === 'number' ? limit : undefined };
}, {});

// migration max string length
export const MAX_HOUSING_STRING_LENGTH = 500;

export const OMB_CONTROL = '2900-0747';

// used to save feature flag in form data for toxic exposure
export const SHOW_TOXIC_EXPOSURE = 'showToxicExposure';

export const TE_URL_PREFIX = 'toxic-exposure';

export const GULF_WAR_1990_LOCATIONS = Object.freeze({
  afghanistan: 'Afghanistan',
  bahrain: 'Bahrain',
  egypt: 'Egypt',
  iraq: 'Iraq',
  israel: 'Israel',
  jordan: 'Jordan',
  kuwait: 'Kuwait',
  neutralzone: 'Neutral zone between Iraq and Saudi Arabia',
  oman: 'Oman',
  qatar: 'Qatar',
  saudiarabia: 'Saudi Arabia',
  somalia: 'Somalia',
  syria: 'Syria',
  uae: 'The United Arab Emirates (UAE)',
  turkey: 'Turkey',
  waters:
    'The waters of the Arabian Sea, Gulf of Aden, Gulf of Oman, Persian Gulf, and Red Sea',
  airspace: 'The airspace above any of these locations',
  none: 'None of these locations',
  notsure: 'I’m not sure if I served in these locations',
});

export const GULF_WAR_2001_LOCATIONS = Object.freeze({
  djibouti: 'Djibouti',
  lebanon: 'Lebanon',
  uzbekistan: 'Uzbekistan',
  yemen: 'Yemen',
  airspace: 'The airspace above any of these locations',
  none: 'None of these locations',
  notsure: 'I’m not sure if I served in these locations',
});

export const HERBICIDE_LOCATIONS = Object.freeze({
  cambodia: 'Cambodia at Mimot or Krek, Kampong Cham Province',
  guam: 'Guam, American Samoa, or their territorial waters',
  koreandemilitarizedzone: 'In or near the Korean demilitarized zone',
  johnston: 'Johnston Atoll or on a ship that called at Johnston Atoll',
  laos: 'Laos',
  c123:
    'Somewhere you had contact with C-123 airplanes while serving in the Air Force or the Air Force Reserves',
  thailand: 'A U.S. or Royal Thai military base in Thailand',
  vietnam: 'Vietnam or the waters in or off of Vietnam',
  none: 'None of these locations',
  notsure: 'I’m not sure if I served in these locations',
});

export const ADDITIONAL_EXPOSURES = Object.freeze({
  asbestos: 'Asbestos',
  chemical:
    'Chemical and biological warfare testing through Project 112 or Project Shipboard Hazard and Defense (SHAD)',
  water: 'Contaminated water at Camp Lejeune or MCAS New River, North Carolina',
  mos: 'Military Occupational Specialty (MOS)-related toxin',
  mustardgas: 'Mustard Gas',
  radiation: 'Radiation',
  none: 'None of these',
  notsure: 'I’m not sure if I have been exposed to these hazards',
});

export const TRAUMATIC_EVENT_TYPES = Object.freeze({
  combat: 'Traumatic events related to combat',
  mst:
    'Traumatic events related to sexual assault or harassment (also known as military sexual trauma or MST)',
  nonMst: 'Traumatic events related to other personal interactions',
  other: 'Other traumatic events',
});

export const OFFICIAL_REPORT_TYPES_SUBTITLES = Object.freeze({
  military: 'Military incident reports',
  other: 'Other reporting options',
  none: 'No reports to include',
  unlisted: 'Other official report type not listed here:',
});

export const MILITARY_REPORT_TYPES = Object.freeze({
  restricted:
    'Restricted incident report (filed with the military while requesting confidentiality)',
  unrestricted:
    'Unrestricted incident report (filed with the military without requesting confidentiality)',
  pre2005: 'Incident report filed with the military before 2005',
});

export const OTHER_REPORT_TYPES = Object.freeze({
  police: 'Police report',
  unsure: 'An official report was filed, but I’m not sure which type it was.',
});

export const NO_REPORT_TYPE = Object.freeze({
  none: 'I don’t have official reports to include.',
});

export const OFFICIAL_REPORT_TYPES_HINTS = Object.freeze({
  military: 'Select any military incident reports filed for this event.',
  other: 'Select any other types of reports filed for this event.',
  none:
    'Select this option if you didn’t have any reports filed, don’t know about any official reports, or prefer not to include them.',
});

export const POLICE_REPORT_LOCATION_FIELDS = [
  'agency',
  'city',
  'state',
  'township',
  'country',
];

export const LISTED_BEHAVIOR_TYPES_WITH_SECTION = Object.freeze({
  reassignment: 'workBehaviors',
  absences: 'workBehaviors',
  performance: 'workBehaviors',
  consultations: 'healthBehaviors',
  episodes: 'healthBehaviors',
  medications: 'healthBehaviors',
  selfMedication: 'healthBehaviors',
  substances: 'healthBehaviors',
  appetite: 'healthBehaviors',
  pregnancy: 'healthBehaviors',
  screenings: 'healthBehaviors',
  socialEconomic: 'otherBehaviors',
  relationships: 'otherBehaviors',
  misconduct: 'otherBehaviors',
});

export const ALL_BEHAVIOR_TYPES_WITH_SECTION = Object.freeze({
  ...LISTED_BEHAVIOR_TYPES_WITH_SECTION,
  unlisted: 'otherBehaviors',
  noChange: 'noBehavioralChange',
});

export const MH_0781_URL_PREFIX = 'mental-health-form-0781';

export const BEHAVIOR_LIST_SECTION_SUBTITLES = Object.freeze({
  work: 'Behavioral changes related to work',
  health: 'Behavioral changes related to health',
  other: 'Other behavioral changes',
  unlisted: 'Other behavioral changes not listed here:',
  none: 'No behavioral changes to include',
});

export const TREATMENT_RECEIVED_SUBTITLES = Object.freeze({
  va: 'VA or military treatment providers',
  nonVa: 'Non-VA treatment providers or Vet Centers',
  none: 'No treatment providers to include',
});

export const TREATMENT_RECEIVED_HINTS = Object.freeze({
  va:
    'Select any VA or military medical provider types where you received treatment for traumatic events.',
  nonVa:
    'Select any Non-VA provider types where you received treatment for traumatic events.',
  none:
    'Select this option if you didn’t seek treatment for traumatic events with any provider, or prefer not to report them.',
});

export const TREATMENT_RECEIVED_VA = Object.freeze({
  medicalCenter: 'VA medical centers (also called a VAMC)',
  communityOutpatient:
    'Community-based outpatient clinics (also called a CBOC)',
  vaPaid: 'VA paid community care providers',
  dod: 'Department of Defense military treatment facilities (also called MTFs)',
});

export const TREATMENT_RECEIVED_NON_VA = Object.freeze({
  nonVa: 'Non-VA health care providers',
  vaCenters: 'VA Vet Centers',
});

export const BEHAVIOR_CHANGES_WORK = Object.freeze({
  reassignment:
    'Request for a change in occupational series or duty assignment',
  absences: 'Increased or decreased use of leave',
  performance: 'Changes in performance or performance evaluations',
});

export const BEHAVIOR_CHANGES_HEALTH = Object.freeze({
  consultations:
    'Increased or decreased visits to a healthcare professional, counselor, or treatment facility',
  episodes: 'Episodes of depression, panic attacks, or anxiety',
  medications: 'Increased or decreased use of prescription medications',
  selfMedication: 'Increased or decreased use of over-the-counter medications',
  substances: 'Increased or decreased use of alcohol or drugs',
  appetite:
    'Changes in eating habits, such as overeating or undereating, or significant changes in weight',
  pregnancy: 'Pregnancy tests around the time of the traumatic experiences',
  screenings: 'Tests for sexually transmitted infections',
});

export const BEHAVIOR_CHANGES_OTHER = Object.freeze({
  socialEconomic: 'Economic or social behavioral changes',
  relationships: 'Changes in or breakup of a significant relationship',
  misconduct: 'Disciplinary or legal difficulties',
  unlisted: 'I experienced other behavioral changes that were not in this list',
});

export const ALL_BEHAVIOR_CHANGE_DESCRIPTIONS = {
  ...BEHAVIOR_CHANGES_WORK,
  ...BEHAVIOR_CHANGES_HEALTH,
  ...BEHAVIOR_CHANGES_OTHER,
};

export const BEHAVIOR_LIST_HINTS = Object.freeze({
  work:
    'Select any work related behavioral changes you experienced after your traumatic events.',
  health:
    'Select any health related behavioral changes you experienced after your traumatic events.',
  other:
    'Select any other types of behavioral changes you experienced after your traumatic events.',
  none:
    'Select this option if you didn’t experience any behavioral changes after your traumatic events, or prefer not to report them.',
});

export const SUPPORTING_EVIDENCE_SUBTITLES = Object.freeze({
  reports: 'Official reports about traumatic events',
  records: 'Records of receiving care after your traumatic events',
  witness: 'Lay or witness statements (also called buddy statements)',
  other: 'Other supporting documents',
  unlisted: 'Other supporting documents not listed here:',
  none: 'No supporting documents to include',
});

export const SUPPORTING_EVIDENCE_REPORT = Object.freeze({
  police: 'Reports from civilian police officers',
});

export const SUPPORTING_EVIDENCE_RECORD = Object.freeze({
  physicians:
    'Records of visits to civilian physicians or caregivers any time after the incident',
  counseling: 'Records of visits to counseling facilities or health clinics',
  crisis:
    'Records of visits to rape crisis centers or centers for domestic abuse',
});

export const SUPPORTING_EVIDENCE_WITNESS = Object.freeze({
  family: 'Statements from family members or roommates',
  faculty: 'Statements from faculty members',
  service: 'Statements from fellow service members',
  clergy: 'Statements from chaplains or clergy members',
});

export const SUPPORTING_EVIDENCE_OTHER = Object.freeze({
  personal: 'Personal diaries or journals',
});

export const SUPPORTING_EVIDENCE_HINTS = Object.freeze({
  reports: 'Select to include official reports about your traumatic events.',
  records:
    'Select to include records of receiving care for your traumatic events.',
  witness:
    'Select to include lay or witness statements about your traumatic events.',
  other:
    'Select to include other supporting documents about your traumatic events.',
  unlisted: 'Other supporting documents not listed here:',
  none:
    'Select this option if you don’t have any supporting documents to include, or prefer not to include them.',
});

export const ARRAY_PATH = 'newDisabilities';
export const NEW_CONDITION_OPTION = "A condition I haven't claimed before";
export const CONDITION_NOT_LISTED_OPTION = 'My condition is not listed';

// Separation Pay
export const SEPARATION_PAY_TITLE =
  'Did you receive separation pay or disability severance pay?';
export const SEPARATION_PAY_BRANCH_TITLE =
  'Please choose the branch of service that gave you separation or severance pay';
export const SEPARATION_PAY_DATE_TITLE =
  'Please tell us the year you received a payment';
export const SEPARATION_PAY_DATE_ERROR = 'Please provide a valid year';
export const SEPARATION_PAY_SECTION_TITLE = 'Separation or Severance Pay';

// Traumatic Events Medical Record Opt-In
export const TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_TITLE =
  'Do you give us permission to add an indicator about claim or appeal events to your VA medical record?';
export const TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_SECTION_TITLE =
  'Option to add indicator of certain upcoming claim and appeal events to your VA medical record';

// General
export const YES = 'Yes';
export const NO = 'No';
