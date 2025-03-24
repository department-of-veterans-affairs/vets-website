export const recordType = {
  ALLERGIES: 'allergies',
  VACCINES: 'vaccines',
  CARE_SUMMARIES_AND_NOTES: 'care summaries and notes',
  LABS_AND_TESTS: 'lab and test results',
  VITALS: 'vitals',
  HEALTH_CONDITIONS: 'health conditions',
};

export const blueButtonRecordTypes = {
  MEDICATIONS: 'medications',
  APPOINTMENTS: 'appointments',
  DEMOGRAPHICS: 'demographics',
  MILITARY_SERVICE: 'military service',
  ACCOUNT_SUMMARY: 'account summary',
};

export const medicationTypes = {
  VA: 'va',
  NON_VA: 'non-va',
};

export const accessAlertTypes = {
  ALLERGY: 'allergy',
  VACCINE: 'vaccine',
  CARE_SUMMARIES_AND_NOTES: 'care summaries and notes',
  VITALS: 'vitals',
  LABS_AND_TESTS: 'labs and tests',
  HEALTH_CONDITIONS: 'health conditions',
  DOCUMENT: 'document',
  IMAGE_STATUS: 'image',
};

export const documentTypes = {
  BB: 'medical records reports',
  CCD: 'continuity of care document',
  SEI: 'self-entered information',
};

export const labTypes = {
  CHEM_HEM: 'chemistry_hematology',
  MICROBIOLOGY: 'microbiology',
  PATHOLOGY: 'pathology',
  EKG: 'electrocardiogram',
  RADIOLOGY: 'radiology',
  CVIX_RADIOLOGY: 'cvix_radiology',
  OTHER: 'other',
};

export const noteTypes = {
  PHYSICIAN_PROCEDURE_NOTE: 'physician_procedure_note',
  CONSULT_RESULT: 'consult_result',
  DISCHARGE_SUMMARY: 'discharge_summary',
  OTHER: 'other',
};

export const loincCodes = {
  // lab and test results
  MICROBIOLOGY: '18725-2', // changed from '79381-0'
  PATHOLOGY: '11526-1', // changed from '60567-5'
  EKG: '11524-6',
  RADIOLOGY: '18748-4',
  // care summaries and notes
  PHYSICIAN_PROCEDURE_NOTE: '11506-3',
  CONSULT_RESULT: '11488-4',
  DISCHARGE_SUMMARY: '18842-5',
  // vitals
  BLOOD_PRESSURE: '85354-9',
  SYSTOLIC: '8480-6',
  DIASTOLIC: '8462-4',
  HEART_RATE: '8867-4',
};

export const fhirResourceTypes = {
  BUNDLE: 'Bundle',
  DIAGNOSTIC_REPORT: 'DiagnosticReport',
  DOCUMENT_REFERENCE: 'DocumentReference',
  OBSERVATION: 'Observation',
  ORGANIZATION: 'Organization',
  PRACTITIONER: 'Practitioner',
};

/**
 * Interpretation code map based on https://terminology.hl7.org/3.1.0/CodeSystem-v3-ObservationInterpretation.html
 */
export const interpretationMap = {
  CAR: 'Carrier',
  CARRIER: 'Carrier',
  '<': 'Off scale low',
  '>': 'Off scale high',
  A: 'Abnormal',
  AA: 'Critical abnormal',
  AC: 'Anti-complementary substances present',
  B: 'Better',
  D: 'Significant change down',
  DET: 'Detected',
  E: 'Equivocal',
  EX: 'outside threshold',
  EXP: 'Expected',
  H: 'High',
  'H*': 'Critical high',
  HH: 'Critical high',
  HU: 'Significantly high',
  'H>': 'Significantly high',
  HM: 'Hold for Medical Review',
  HX: 'above high threshold',
  I: 'Intermediate',
  IE: 'Insufficient evidence',
  IND: 'Indeterminate',
  L: 'Low',
  'L*': 'Critical low',
  LL: 'Critical low',
  LU: 'Significantly low',
  'L<': 'Significantly low',
  LX: 'below low threshold',
  MS: 'moderately susceptible',
  N: 'Normal',
  NCL: 'No CLSI defined breakpoint',
  ND: 'Not detected',
  NEG: 'Negative',
  NR: 'Non-reactive',
  NS: 'Non-susceptible',
  OBX: 'Interpretation qualifiers in separate OBX segments',
  POS: 'Positive',
  QCF: 'Quality control failure',
  R: 'Resistant',
  RR: 'Reactive',
  S: 'Susceptible',
  SDD: 'Susceptible-dose dependent',
  'SYN-R': 'Synergy - resistant',
  'SYN-S': 'Synergy - susceptible',
  TOX: 'Cytotoxic substance present',
  U: 'Significant change up',
  UNE: 'Unexpected',
  VS: 'very susceptible',
  W: 'Worse',
  WR: 'Weakly reactive',
};

export const EMPTY_FIELD = 'None noted';
export const NONE_RECORDED = 'None recorded';
export const NO_INFO_REPORTED = 'No information reported';
export const NA = 'N/A';
export const UNKNOWN = 'Unknown';

export const IS_TESTING = false;

export const vitalTypes = {
  BLOOD_PRESSURE: ['BLOOD_PRESSURE'],
  PULSE: ['PULSE', 'HEART_RATE'],
  RESPIRATION: ['RESPIRATION', 'RESPIRATORY_RATE'],
  PULSE_OXIMETRY: ['PULSE_OXIMETRY', 'OXYGEN_SATURATION_IN_ARTERIAL_BLOOD'],
  TEMPERATURE: ['TEMPERATURE', 'BODY_TEMPERATURE'],
  WEIGHT: ['WEIGHT', 'BODY_WEIGHT'],
  HEIGHT: ['HEIGHT', 'BODY_HEIGHT'],
  PAIN_SEVERITY: ['PAIN_SEVERITY_0_10_VERBAL_NUMERIC_RATING_SCORE_REPORTED'],
};

export const seiVitalTypes = {
  BLOOD_PRESSURE: 'bloodPressure',
  BLOOD_SUGAR: 'bloodSugar',
  BODY_TEMPERATURE: 'bodyTemperature',
  BODY_WEIGHT: 'bodyWeight',
  CHOLESTEROL: 'cholesterol',
  HEART_RATE: 'heartRate',
  INR: 'inr',
  PAIN: 'pain',
  PULSE_OXIMETRY: 'pulseOximetry',
};

export const vitalTypeDisplayNames = {
  BLOOD_PRESSURE: 'Blood pressure',
  PULSE: 'Heart rate',
  HEART_RATE: 'Heart rate',
  RESPIRATION: 'Breathing rate',
  RESPIRATORY_RATE: 'Breathing rate',
  PULSE_OXIMETRY: 'Blood oxygen level (pulse oximetry)',
  OXYGEN_SATURATION_IN_ARTERIAL_BLOOD: 'Blood oxygen level (pulse oximetry)',
  TEMPERATURE: 'Temperature',
  BODY_TEMPERATURE: 'Temperature',
  BODY_WEIGHT: 'Weight',
  WEIGHT: 'Weight',
  BODY_HEIGHT: 'Height',
  HEIGHT: 'Height',
  PAIN_SEVERITY_0_10_VERBAL_NUMERIC_RATING_SCORE_REPORTED: 'Pain severity',
  PAIN_SEVERITY: 'Pain severity',
};

export const vitalUnitCodes = {
  BLOOD_PRESSURE: '',
  PULSE: '/min',
  HEART_RATE: '/min',
  RESPIRATION: '/min',
  RESPIRATORY_RATE: '/min',
  PULSE_OXIMETRY: '%',
  TEMPERATURE: '[degF]',
  WEIGHT: '[lb_av]',
  BODY_WEIGHT: '[lb_av]',
  HEIGHT: '[in_i]',
  BODY_HEIGHT: '[in_i]',
  PAIN_SEVERITY: '',
};

export const vitalUnitDisplayText = {
  BLOOD_PRESSURE: '',
  PULSE: ' beats per minute',
  HEART_RATE: ' beats per minute',
  RESPIRATION: ' breaths per minute',
  RESPIRATORY_RATE: ' breaths per minute',
  PULSE_OXIMETRY: '%',
  TEMPERATURE: ' °F',
  WEIGHT: ' pounds',
  BODY_WEIGHT: ' pounds',
  HEIGHT: ' inches',
  BODY_HEIGHT: ' inches',
  PAIN_SEVERITY: '',
};

export const ALERT_TYPE_ERROR = 'error';
export const ALERT_TYPE_IMAGE_STATUS_ERROR = 'images status error';
export const ALERT_TYPE_SUCCESS = 'success';
export const ALERT_TYPE_BB_ERROR = 'blue button download error';
export const ALERT_TYPE_SEI_ERROR = 'self-entered download error';
export const ALERT_TYPE_CCD_ERROR =
  'continuity of care document download error';

export const pageTitles = {
  MEDICAL_RECORDS_PAGE_TITLE: 'Medical Records | Veterans Affairs',
  LAB_AND_TEST_RESULTS_PAGE_TITLE:
    'Lab And Test Results - Medical Records | Veterans Affairs',
  LAB_AND_TEST_RESULTS_DETAILS_PAGE_TITLE:
    'Lab And Test Results Details - Medical Records | Veterans Affairs',
  LAB_AND_TEST_RESULTS_IMAGES_PAGE_TITLE:
    'Lab And Test Results Images - Medical Records | Veterans Affairs',
  CARE_SUMMARIES_AND_NOTES_PAGE_TITLE:
    'Care Summaries And Notes - Medical Records | Veterans Affairs',
  CARE_SUMMARIES_AND_NOTES_DETAILS_PAGE_TITLE:
    'Care Summaries And Notes Details - Medical Records | Veterans Affairs',
  VACCINES_PAGE_TITLE: 'Vaccines - Medical Records | Veterans Affairs',
  VACCINE_DETAILS_PAGE_TITLE:
    'Vaccine Details - Medical records | Veterans Affairs',
  ALLERGIES_PAGE_TITLE:
    'Allergies and Reactions - Medical Records | Veterans Affairs',
  ALLERGY_DETAILS_PAGE_TITLE:
    'Allergies And Reactions Details - Medical Records | Veterans Affairs',
  HEALTH_CONDITIONS_PAGE_TITLE:
    'Health Conditions - Medical Records | Veterans Affairs',
  HEALTH_CONDITIONS_DETAILS_PAGE_TITLE:
    'Health Condition Details - Medical Records | Veterans Affairs',
  VITALS_PAGE_TITLE: 'Vitals - Medical Records | Veterans Affairs',
  DOWNLOAD_PAGE_TITLE:
    'Download Medical Records Reports - Medical Records | Veterans Affairs',
  DOWNLOAD_FORMS_PAGES_TITLE:
    'Select Records And Download Report - Medical Records | Veterans Affairs',
  SETTINGS_PAGE_TITLE:
    'Medical Records Settings - Medical Records | Veterans Affairs',
};

export const selfEnteredTypes = {
  ACTIVITY_JOURNAL: 'activity journal',
  ALLERGIES: 'allergies',
  DEMOGRAPHICS: 'demographics',
  FAMILY_HISTORY: 'family health history',
  FOOD_JOURNAL: 'food journal',
  HEALTH_PROVIDERS: 'healthcare providers',
  HEALTH_INSURANCE: 'health insurance',
  TEST_ENTRIES: 'lab and test results',
  MEDICAL_EVENTS: 'medical events',
  MEDICATIONS: 'medications and supplements',
  MILITARY_HISTORY: 'military health history',
  TREATMENT_FACILITIES: 'treatment facilities',
  VACCINES: 'vaccines',
  VITALS: 'vitals and readings',
};

// --- Constants and helper functions moved outside the component ---
export const SEI_DOMAIN_DISPLAY_MAP = {
  activityJournal: 'Activity journal',
  allergies: 'Allergies',
  demographics: 'Demographics',
  familyHistory: 'Family health history',
  foodJournal: 'Food journal',
  providers: 'Healthcare providers',
  healthInsurance: 'Health insurance',
  testEntries: 'Lab and test results',
  medicalEvents: 'Medical events',
  medications: 'Medications and supplements',
  militaryHistory: 'Military health history',
  treatmentFacilities: 'Treatment facilities',
  vaccines: 'Vaccines',
  vitals: 'Vitals and readings',
};

export const BB_DOMAIN_DISPLAY_MAP = {
  labsAndTests: 'Lab and test results',
  notes: 'Care summaries and notes',
  vaccines: 'Vaccines',
  allergies: 'Allergies and reactions',
  conditions: 'Health conditions',
  vitals: 'Vitals',
  radiology: 'Radiology results',
  medications: 'Medications',
  appointments: 'VA appointments',
  demographics: 'VA demographics records',
  militaryService: 'DOD military service',
  patient: 'Account summary',
};

// All SEI domains in one place for easy iteration
export const SEI_DOMAINS = [
  'activityJournal',
  'allergies',
  'demographics',
  'familyHistory',
  'foodJournal',
  'providers',
  'healthInsurance',
  'testEntries',
  'medicalEvents',
  'medications',
  'militaryHistory',
  'treatmentFacilities',
  'vaccines',
  'vitals',
];

export const allergyTypes = {
  OBSERVED:
    'Observed (you experienced this allergy or reaction while you were getting care at this VA location)',
  REPORTED:
    'Historical (you experienced this allergy or reaction in the past, before you started getting care at this VA location)',
};

export const studyJobStatus = {
  NONE: 'NONE',
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
};

export const refreshExtractTypes = {
  ALLERGY: 'Allergy',
  IMAGING: 'ImagingStudy',
  VPR: 'VPR',
  CHEM_HEM: 'ChemistryHematology',
};

/** These are the extracts that we are actively using from the status response. */
export const EXTRACT_LIST = [
  refreshExtractTypes.ALLERGY,
  refreshExtractTypes.IMAGING,
  refreshExtractTypes.VPR,
  refreshExtractTypes.CHEM_HEM,
];

export const VALID_REFRESH_DURATION = 3600000; // 1 hour

export const STATUS_POLL_INTERVAL = 2000;

/** How long to poll the backend while it's returning 202 Patient Not Found */
export const INITIAL_FHIR_LOAD_DURATION = 120000; // in milliseconds

export const refreshPhases = {
  STALE: 'stale',
  IN_PROGRESS: 'in_progress',
  CURRENT: 'current',
  FAILED: 'failed',
  CALL_FAILED: 'call_failed',
};

export const loadStates = {
  PRE_FETCH: 'pre-fetch',
  FETCHING: 'fetching',
  FETCHED: 'fetched',
};

export const downtimeNotificationParams = {
  appTitle: 'this medical records tool',
};

export const dischargeSummarySortFields = {
  ADMISSION_DATE: 'admission date',
  DISCHARGE_DATE: 'discharge date',
  DATE_ENTERED: 'date entered',
};

export const Paths = {
  MYHEALTH: '/my-health',
  MR_LANDING_PAGE: '/',
  LABS_AND_TESTS: '/labs-and-tests/',
  CARE_SUMMARIES_AND_NOTES: '/summaries-and-notes/',
  VACCINES: '/vaccines/',
  ALLERGIES: '/allergies/',
  HEALTH_CONDITIONS: '/conditions/',
  VITALS: '/vitals/',
  SETTINGS: '/settings/',
  DOWNLOAD: '/download/',
  BLOOD_OXYGEN_LEVEL: '/vitals/blood-oxygen-level-history',
  BLOOD_PRESSURE: '/vitals/blood-pressure-history',
  BREATHING_RATE: '/vitals/breathing-rate-history',
  HEART_RATE: '/vitals/heart-rate-history',
  HEIGHT: '/vitals/height-history',
  TEMPERATURE: '/vitals/temperature-history',
  WEIGHT: '/vitals/weight-history',
};

export const Breadcrumbs = {
  MYHEALTH: { href: Paths.MYHEALTH, label: 'My HealtheVet' },
  MR_LANDING_PAGE: {
    href: Paths.MR_LANDING_PAGE,
    label: 'Medical records',
    isRouterLink: true,
  },
  LABS_AND_TESTS: {
    href: Paths.LABS_AND_TESTS,
    label: 'Lab and test results',
    isRouterLink: true,
  },
  CARE_SUMMARIES_AND_NOTES: {
    href: Paths.CARE_SUMMARIES_AND_NOTES,
    label: 'Care summaries and notes',
    isRouterLink: true,
  },
  VACCINES: { href: Paths.VACCINES, label: 'Vaccines', isRouterLink: true },
  ALLERGIES: {
    href: Paths.ALLERGIES,
    label: 'Allergies and reactions',
    isRouterLink: true,
  },
  HEALTH_CONDITIONS: {
    href: Paths.HEALTH_CONDITIONS,
    label: 'Health conditions',
    isRouterLink: true,
  },
  VITALS: { href: Paths.VITALS, label: 'Vitals', isRouterLink: true },
  SETTINGS: {
    href: Paths.SETTINGS,
    label: 'Manage your electronic sharing settings',
    isRouterLink: true,
  },
  DOWNLOAD: {
    href: Paths.DOWNLOAD,
    label: 'Download medical records reports',
    isRouterLink: true,
  },
  BLOOD_OXYGEN_LEVEL: {
    href: Paths.BLOOD_OXYGEN_LEVEL,
    label: 'Blood oxygen level',
    isRouterLink: true,
  },
  BLOOD_PRESSURE: {
    href: Paths.BLOOD_PRESSURE,
    label: 'Blood pressure',
    isRouterLink: true,
  },
  BREATHING_RATE: {
    href: Paths.BREATHING_RATE,
    label: 'Breathing rate',
    isRouterLink: true,
  },
  HEART_RATE: {
    href: Paths.HEART_RATE,
    label: 'Heart rate',
    isRouterLink: true,
  },
  HEIGHT: { href: Paths.HEIGHT, label: 'Height', isRouterLink: true },
  TEMPERATURE: {
    href: Paths.TEMPERATURE,
    label: 'Temperature',
    isRouterLink: true,
  },
  WEIGHT: { href: Paths.WEIGHT, label: 'Weight', isRouterLink: true },
};

export const DateRangeValues = {
  ANY: 'any',
  LAST3: 3,
  LAST6: 6,
  LAST12: 12,
  CUSTOM: 'custom',
};

export const DateRangeOptions = [
  { value: DateRangeValues.ANY, label: 'Any' },
  { value: DateRangeValues.LAST3, label: 'Last 3 months' },
  { value: DateRangeValues.LAST6, label: 'Last 6 months' },
  { value: DateRangeValues.LAST12, label: 'Last 12 months' },
  { value: DateRangeValues.CUSTOM, label: 'Custom' },
];

export const CernerAlertContent = {
  MR_LANDING_PAGE: {
    linkPath: '/pages/health_record/comprehensive_record/health_summaries',
    pageName: 'medical records',
  },
  LABS_AND_TESTS: {
    linkPath: '/pages/health_record/comprehensive_record/health_summaries',
    pageName: 'lab and test results',
  },
  CARE_SUMMARIES_AND_NOTES: {
    linkPath: '/pages/health_record/app-views/cerner/reports/documents',
    pageName: 'care summaries and notes',
  },
  VACCINES: {
    linkPath: '/pages/health_record/health-record-immunizations',
    pageName: 'vaccines',
  },
  ALLERGIES: {
    linkPath: '/pages/health_record/health-record-allergies',
    pageName: 'allergies and reactions',
  },
  HEALTH_CONDITIONS: {
    linkPath: '/pages/health_record/conditions',
    pageName: 'health conditions',
  },
  VITALS: {
    linkPath: '/pages/health_record/results',
    pageName: 'vitals',
  },
};

export const SortTypes = {
  ALPHABETICAL: {
    value: 'alphatetically',
    label: 'alphabetically',
  },
  ASC_DATE: {
    value: 'ascDate',
    label: 'newest to oldest',
    labelWithDateEntered: 'newest to oldest (date entered)',
  },
  DSC_DATE: {
    value: 'dscDate',
    label: 'oldest to newest',
    labelWithDateEntered: 'oldest to newest (date entered)',
  },
};
