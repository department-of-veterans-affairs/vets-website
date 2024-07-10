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
  BLUE_BUTTON_REPORT: 'Blue Button report',
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
  PULSE: 'PULSE',
  RESPIRATION: 'RESPIRATION',
  PULSE_OXIMETRY: 'PULSE_OXIMETRY',
  TEMPERATURE: 'TEMPERATURE',
  WEIGHT: 'WEIGHT',
  HEIGHT: 'HEIGHT',
};

export const vitalTypeDisplayNames = {
  BLOOD_PRESSURE: 'Blood pressure',
  PULSE: 'Heart rate',
  RESPIRATION: 'Breathing rate',
  PULSE_OXIMETRY: 'Blood oxygen level (pulse oximetry)',
  TEMPERATURE: 'Temperature',
  WEIGHT: 'Weight',
  HEIGHT: 'Height',
};

export const vitalUnitCodes = {
  BLOOD_PRESSURE: '',
  PULSE: '/min',
  RESPIRATION: '/min',
  PULSE_OXIMETRY: '%',
  TEMPERATURE: '[degF]',
  WEIGHT: '[lb_av]',
  HEIGHT: '[in_i]',
};

export const vitalUnitDisplayText = {
  BLOOD_PRESSURE: '',
  PULSE: ' beats per minute',
  RESPIRATION: ' breaths per minute',
  PULSE_OXIMETRY: '%',
  TEMPERATURE: ' °F',
  WEIGHT: ' pounds',
  HEIGHT: ' inches',
};

export const ALERT_TYPE_ERROR = 'error';
export const ALERT_TYPE_SUCCESS = 'success';

export const pageTitles = {
  MEDICAL_RECORDS_PAGE_TITLE: 'Medical Records | Veterans Affairs',
  LAB_AND_TEST_RESULTS_PAGE_TITLE:
    'Lab And Test Results - Medical Records | Veterans Affairs',
  CARE_SUMMARIES_AND_NOTES_PAGE_TITLE:
    'Care Summaries And Notes - Medical Records | Veterans Affairs',
  VACCINES_PAGE_TITLE: 'Vaccines - Medical Records | Veterans Affairs',
  ALLERGIES_PAGE_TITLE:
    'Allergies and Reactions - Medical Records | Veterans Affairs',
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

export const downtimeNotificationParams = {
  appTitle: 'this medical records tool',
};

export const dischargeSummarySortFields = {
  ADMISSION_DATE: 'admission date',
  DISCHARGE_DATE: 'discharge date',
  DATE_ENTERED: 'date entered',
};
