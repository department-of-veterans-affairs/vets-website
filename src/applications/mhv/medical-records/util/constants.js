export const recordType = {
  ALLERGIES: 'allergies',
  VACCINES: 'vaccines',
  CARE_SUMMARIES_AND_NOTES: 'care summaries and notes',
  LABS_AND_TESTS: 'lab and test results',
  VITALS: 'vitals',
  HEALTH_CONDITIONS: 'health conditions',
};

export const accessAlertTypes = {
  ALLERGY: 'allergy',
  VACCINE: 'vaccine',
  CARE_SUMMARIES_AND_NOTES: 'care summaries and notes',
  VITALS: 'vitals',
  LABS_AND_TESTS: 'labs and tests',
  HEALTH_CONDITIONS: 'health conditions',
};

export const labTypes = {
  CHEM_HEM: 'chemistry_hematology',
  MICROBIOLOGY: 'microbiology',
  PATHOLOGY: 'pathology',
  EKG: 'electrocardiogram',
  RADIOLOGY: 'radiology',
  OTHER: 'other',
};

export const noteTypes = {
  PHYSICIAN_PROCEDURE_NOTE: 'physician_procedure_note',
  DISCHARGE_SUMMARY: 'discharge_summary',
  OTHER: 'other',
};

export const loincCodes = {
  // lab and test results
  MICROBIOLOGY: '79381-0',
  PATHOLOGY: '60567-5',
  EKG: '11524-6',
  RADIOLOGY: '18748-4',
  // care summaries and notes
  PHYSICIAN_PROCEDURE_NOTE: '11506-3',
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

export const IS_TESTING = false;

export const vitalTypes = {
  BLOOD_PRESSURE: 'BLOOD_PRESSURE',
  BREATHING_RATE: 'BREATHING_RATE',
  PULSE: 'PULSE',
  HEIGHT: 'HEIGHT',
  TEMPERATURE: 'TEMPERATURE',
  WEIGHT: 'WEIGHT',
  PAIN: 'PAIN',
};

export const vitalTypeDisplayNames = {
  BLOOD_PRESSURE: 'Blood pressure',
  BREATHING_RATE: 'Breathing rate',
  PULSE: 'Heart rate',
  HEIGHT: 'Height',
  TEMPERATURE: 'Temperature',
  WEIGHT: 'Weight',
  PAIN: 'Pain',
};

export const ALERT_TYPE_ERROR = 'error';

export const pageTitles = {
  MEDICAL_RECORDS_PAGE_TITLE: 'Medical Records | Veterans Affairs',
  LAB_AND_TEST_RESULTS_PAGE_TITLE:
    'Lab And Test Results - Medical Records | Veterans Affairs',
  CARE_SUMMARIES_AND_NOTES_PAGE_TITLE:
    'Care Summaries And Notes - Medical Records | Veterans Affairs',
  VACCINES_PAGE_TITLE: 'Vaccines - Medical Records | Veterans Affairs',
  ALLERGIES_PAGE_TITLE: 'Allergies and Reactions',
  HEALTH_CONDITIONS_PAGE_TITLE:
    'Health Conditions - Medical Records | Veterans Affairs',
  VITALS_PAGE_TITLE: 'Vitals - Medical Records | Veterans Affairs',
  DOWNLOAD_PAGE_TITLE:
    'Download All Medical Records - Medical Records | Veterans Affairs',
  SETTINGS_PAGE_TITLE:
    'Medical Records Settings - Medical Records | Veterans Affairs',
};

export const allergyTypes = {
  OBSERVED:
    'Observed (you experienced this allergy or reaction while you were getting care at this VA location)',
  REPORTED:
    'Historical (you experienced this allergy or reaction in the past, before you started getting care at this VA location)',
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

export const refreshPhases = {
  STALE: 'stale',
  IN_PROGRESS: 'in_progress',
  CURRENT: 'current',
  FAILED: 'failed',
};

export const loadStates = {
  PRE_FETCH: 'pre-fetch',
  FETCHING: 'fetching',
  FETCHED: 'fetched',
};
