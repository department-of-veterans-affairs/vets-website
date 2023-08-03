export const RecordType = {
  HEALTH_CONDITIONS: 'health conditions',
  LABS_AND_TESTS: 'lab and test results',
  CARE_SUMMARIES_AND_NOTES: 'care summaries and notes',
  VACCINES: 'vaccines',
  VITALS: 'vitals',
  ALLERGIES: 'allergies',
};

export const labTypes = {
  CHEM_HEM: 'chemistry_hematology',
  MICROBIOLOGY: 'microbiology',
  PATHOLOGY: 'pathology',
  EKG: 'electrocardiogram',
  RADIOLOGY: 'radiology',
  OTHER: 'other',
};

export const LoincCodes = {
  // lab and test results
  MICROBIOLOGY: '79381-0',
  PATHOLOGY: '60567-5',
  EKG: '11524-6',
  RADIOLOGY: '18748-4',
  // care summaries and notes
  PHYSICIAN_PROCEDURE_NOTE: '11505-5',
  DISCHARGE_SUMMARY: '18842-5',
};

export const FhirResourceTypes = {
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

export const emptyField = 'None noted';

export const testing = false;

export const vitalTypes = {
  BLOOD_PRESSURE: 'BLOOD_PRESSURE',
  BREATHING_RATE: 'BLOOD_SUGAR',
  HEART_RATE: 'HEART_RATE',
  HEIGHT: 'HEIGHT',
  TEMPERATURE: 'TEMPERATURE',
  WEIGHT: 'WEIGHT',
};

export const vitalTypeDisplayNames = {
  BLOOD_PRESSURE: 'Blood pressure',
  BREATHING_RATE: 'Breathing rate',
  HEART_RATE: 'Heart rate',
  HEIGHT: 'Height',
  TEMPERATURE: 'Temperature',
  WEIGHT: 'Weight',
};
