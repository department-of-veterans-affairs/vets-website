export const recordType = {
  ALLERGIES: 'allergies or reactions',
  VACCINES: 'vaccines',
  CARE_SUMMARIES_AND_NOTES: 'care summaries and notes',
  LABS_AND_TESTS: 'lab and test results',
  VITALS: 'vitals',
  HEALTH_CONDITIONS: 'health conditions',
  RADIOLOGY: 'radiology',
};

/** for use in Datadog RUM IDs, e.g. 'allergies-list-spinner' */
export const recordTypeKeyNames = {
  [recordType.ALLERGIES]: 'allergies',
  [recordType.VACCINES]: 'vaccines',
  [recordType.CARE_SUMMARIES_AND_NOTES]: 'care-summaries',
  [recordType.LABS_AND_TESTS]: 'labs-and-tests',
  [recordType.VITALS]: 'vitals',
  [recordType.HEALTH_CONDITIONS]: 'health-conditions',
  [recordType.RADIOLOGY]: 'radiology',
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
  RADIOLOGY: 'radiology',
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
  SURGICAL_PATHOLOGY: '27898-6',
  ELECTRON_MICROSCOPY: '50668-3',
  CYTOPATHOLOGY: '26438-2',
  RADIOLOGY: '18748-4',
  // care summaries and notes
  PHYSICIAN_PROCEDURE_NOTE: '11506-3',
  CONSULT_RESULT: '11488-4',
  DISCHARGE_SUMMARY: '18842-5',
  // vitals
  BLOOD_PRESSURE: '85354-9',
  BREATHING_RATE: '9279-1',
  HEIGHT: '8302-2',
  TEMPERATURE: '8310-5',
  WEIGHT_1: '29463-7',
  WEIGHT_2: '3141-9', // common alternate weight LOINC
  SYSTOLIC: '8480-6',
  DIASTOLIC: '8462-4',
  HEART_RATE: '8867-4',
  PULSE_OXIMETRY_1: '59408-5',
  PULSE_OXIMETRY_2: '2708-6',
  UHD_RADIOLOGY: 'LP29684-5',
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

export const EMPTY_FIELD = 'None recorded';
export const NONE_RECORDED = 'None recorded';
export const NO_INFO_REPORTED = 'No information reported';
export const NO_INFO_PROVIDED = 'No information provided';
export const NA = 'N/A';
export const UNKNOWN = 'Unknown';

export const IS_TESTING = false;

// would need to add here
export const vitalTypes = {
  BLOOD_PRESSURE: ['BLOOD_PRESSURE'],
  PULSE: ['PULSE', 'HEART_RATE'],
  RESPIRATION: ['RESPIRATION', 'RESPIRATORY_RATE'],
  PULSE_OXIMETRY: ['PULSE_OXIMETRY', 'OXYGEN_SATURATION_IN_ARTERIAL_BLOOD'],
  TEMPERATURE: ['TEMPERATURE', 'BODY_TEMPERATURE'],
  WEIGHT: ['WEIGHT', 'BODY_WEIGHT'],
  HEIGHT: ['HEIGHT', 'BODY_HEIGHT'],
};

// Grouped LOINC codes for each canonical vital type. This is the single source of truth.
// Any additions (new LOINC variants) only need to be appended here and will automatically
// be reflected in loincToVitalType and allowedVitalLoincs.
export const vitalLoincGroups = {
  BLOOD_PRESSURE: [loincCodes.BLOOD_PRESSURE],
  PULSE: [loincCodes.HEART_RATE],
  RESPIRATION: [loincCodes.BREATHING_RATE],
  PULSE_OXIMETRY: [loincCodes.PULSE_OXIMETRY_1, loincCodes.PULSE_OXIMETRY_2],
  TEMPERATURE: [loincCodes.TEMPERATURE],
  WEIGHT: [loincCodes.WEIGHT_1, loincCodes.WEIGHT_2], // include alternate weight LOINC
  HEIGHT: [loincCodes.HEIGHT],
};

// Canonical vital type mapping driven directly by grouped LOINC codes.
export const loincToVitalType = Object.entries(vitalLoincGroups).reduce(
  (acc, [type, codes]) => {
    codes.forEach(code => {
      acc[code] = type; // map each LOINC variant to its canonical vital type
    });
    return acc;
  },
  {},
);

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
  HEIGHT_FT: ' feet',
  HEIGHT_IN: ' inches',
  BODY_HEIGHT: ' inches',
  PAIN_SEVERITY: '',
};

export const ALERT_TYPE_ERROR = 'error';
export const ALERT_TYPE_IMAGE_STATUS_ERROR = 'images status error';
export const ALERT_TYPE_SUCCESS = 'success';
export const ALERT_TYPE_BB_ERROR = 'blue button download error';
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
  RADIOLOGY_PAGE_TITLE: 'Radiology - Medical Records | Veterans Affairs',
  RADIOLOGY_DETAILS_PAGE_TITLE:
    'Radiology Details - Medical Records | Veterans Affairs',
  RADIOLOGY_IMAGES_PAGE_TITLE:
    'Radiology Images - Medical Records | Veterans Affairs',
  DOWNLOAD_PAGE_TITLE:
    'Download Medical Records Reports - Medical Records | Veterans Affairs',
  DOWNLOAD_FORMS_PAGES_TITLE:
    'Select Records And Download Report - Medical Records | Veterans Affairs',
  SETTINGS_PAGE_TITLE:
    'Medical Records Settings - Medical Records | Veterans Affairs',
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

export const allergyTypes = {
  OBSERVED:
    'Observed (you experienced this allergy or reaction while you were getting care at this VA location)',
  REPORTED:
    'Historical (you experienced this allergy or reaction in the past, before you started getting care at this VA location)',
};

export const studyJobStatus = {
  NEW: 'NEW', // has been requested but not yet processing (very short-lived)
  QUEUED: 'QUEUED', // has been requested but not yet processing (also very short-lived)
  PROCESSING: 'PROCESSING', // has been requested
  COMPLETE: 'COMPLETE', // request complete
  ERROR: 'ERROR', // error
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
  IMAGING_RESULTS: '/imaging-results/',
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
  IMAGING_RESULTS: {
    href: Paths.IMAGING_RESULTS,
    label: 'Medical imaging results',
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

export const DEFAULT_DATE_RANGE = '3'; // last 3 months
export const MONTH_BASED_OPTIONS = ['3', '6'];

export const CernerAlertContent = {
  MR_LANDING_PAGE: {
    linkPath: '/pages/health_record/comprehensive_record/health_summaries',
    pageName: 'medical records',
  },
  LABS_AND_TESTS: {
    linkPath: '/pages/health_record/comprehensive_record/health_summaries',
    pageName: 'lab and test results',
  },
  RADIOLOGY: {
    linkPath: '/pages/health_record/comprehensive_record/health_summaries',
    pageName: 'radiology',
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
  DOWNLOAD: {
    linkPath: '/pages/health_record/comprehensive_record/health_summaries',
    pageName: 'medical records reports',
  },
};

export const LABS_AND_TESTS_DISPLAY_LABELS = {
  DATE: 'Date and time collected',
  TEST_CODE: 'Type of test',
  SAMPLE_TESTED: 'Site or sample tested',
  BODY_SITE: 'Body site tested',
  ORDERED_BY: 'Ordered by',
  LOCATION: 'Location',
  COMMENTS: 'Lab comments',
  RESULTS: 'Results',
};

export const LABS_AND_TESTS_DISPLAY_DISPLAY_MAP = {
  date: LABS_AND_TESTS_DISPLAY_LABELS.DATE,
  testCode: LABS_AND_TESTS_DISPLAY_LABELS.TEST_CODE,
  sampleTested: LABS_AND_TESTS_DISPLAY_LABELS.SAMPLE_TESTED,
  bodySite: LABS_AND_TESTS_DISPLAY_LABELS.BODY_SITE,
  orderedBy: LABS_AND_TESTS_DISPLAY_LABELS.ORDERED_BY,
  location: LABS_AND_TESTS_DISPLAY_LABELS.LOCATION,
  comments: LABS_AND_TESTS_DISPLAY_LABELS.COMMENTS,
  result: LABS_AND_TESTS_DISPLAY_LABELS.RESULTS,
};

export const OBSERVATION_DISPLAY_LABELS = {
  TEST_CODE: 'Type of test',
  SAMPLE_TESTED: 'Site or sample tested',
  BODY_SITE: 'Body site tested',
  STATUS: 'Status',
  COMMENTS: 'Lab comments',
  REFERENCE_RANGE: 'Reference range',
  VALUE: 'Result',
};
export const OBSERVATION_DISPLAY_DISPLAY_MAP = {
  testCode: OBSERVATION_DISPLAY_LABELS.TEST_CODE,
  sampleTested: OBSERVATION_DISPLAY_LABELS.SAMPLE_TESTED,
  bodySite: OBSERVATION_DISPLAY_LABELS.BODY_SITE,
  status: OBSERVATION_DISPLAY_LABELS.STATUS,
  comments: OBSERVATION_DISPLAY_LABELS.COMMENTS,
  referenceRange: OBSERVATION_DISPLAY_LABELS.REFERENCE_RANGE,
  value: OBSERVATION_DISPLAY_LABELS.VALUE,
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
export const radiologyErrors = {
  ERROR_REQUEST_AGAIN:
    'We’re sorry. There was a problem with our system. Try requesting your images again.',
  ERROR_TRY_LATER:
    'We’re sorry. There was a problem with our system. Try again later.',
};

export const allowedVitalLoincs = [
  // ...existing code removed in favor of dynamic generation below...
  ...new Set(Object.values(vitalLoincGroups).flat()),
];

export const statsdFrontEndActions = {
  // list calls
  LABS_AND_TESTS_LIST: 'labs_and_tests_list',
  IMAGING_RESULTS_LIST: 'imaging_results_list',
  CARE_SUMMARIES_AND_NOTES_LIST: 'care_summaries_and_notes_list',
  VACCINES_LIST: 'vaccines_list',
  ALLERGIES_LIST: 'allergies_list',
  HEALTH_CONDITIONS_LIST: 'health_conditions_list',
  VITALS_LIST: 'vitals_list',
  // detail calls
  LABS_AND_TESTS_DETAILS: 'labs_and_tests_details',
  IMAGING_RESULTS_DETAILS: 'imaging_results_details',
  RADIOLOGY_IMAGES_LIST: 'radiology_images_list',
  CARE_SUMMARIES_AND_NOTES_DETAILS: 'care_summaries_and_notes_details',
  VACCINES_DETAILS: 'vaccines_details',
  ALLERGIES_DETAILS: 'allergies_details',
  HEALTH_CONDITIONS_DETAILS: 'health_conditions_details',
  VITALS_DETAILS: 'vitals_details',
  // download calls
  DOWNLOAD_BLUE_BUTTON: 'download_blue_button',
  DOWNLOAD_CCD: 'download_ccd',
  DOWNLOAD_SEI: 'download_sei',
};

/**
 * Facility ID for Meds by Mail users (primarily CHAMPVA beneficiaries)
 * Used to conditionally display content specific to Meds by Mail servicing
 */
export const MEDS_BY_MAIL_FACILITY_ID = '741MM';

export const uhdRecordSource = {
  VISTA: 'vista',
  ORACLE_HEALTH: 'oracle-health',
};
