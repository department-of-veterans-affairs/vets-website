export const DownloadTags = {
  // RECORD TYPE
  recordTypeSelectAll: 'Select All VA records - Record type',
  recordTypeOptions: {
    labTests: 'Lab and test results - Record type',
    careSummaries: 'Care summaries and notes - Record type',
    vaccines: 'Vaccines - Record type',
    allergies: 'Allergies and reactions - Record type',
    conditions: 'Health conditions - Record type',
    vitals: 'Vitals - Record type',
    medications: 'Medications - Record type',
    upcomingAppts: 'Upcoming VA appointments - Record type',
    pastAppts: 'Past VA appointments - Record type',
    demographics: 'VA demographics records - Record type',
    militaryService: 'DOD military service information records - Record type',
  },
  recordTypeBack: 'Record type - Back - Record type',
  recordTypeContinue: 'Record type - Continue - Record type',
  // DATE RANGE
  dateOptions: {
    any: 'Date range option - All time',
    '3': 'Date range option - Last 3 months',
    '6': 'Date range option - Last 6 months',
    '12': 'Date range option - Last 12 months',
    custom: 'Date range option - Custom',
  },
  dateRangeBack: 'Date range - Back',
  dateRangeContinue: 'Date range - Continue',
  // FILE TYPE
  fileTypeBack: 'File type - Back - Record type',
  downloadReport: 'Download report',
  fileTypeOptions: {
    pdf: 'PDF - File type',
    txt: 'Text file - File type',
  },
  // Other
  ccdXml: 'Download Continuity of Care Document xml Link',
  selfEnteredPDF: 'Download self-entered health information PDF link',
  selectRecords: 'Select records and download',
};

export const RadiologyTags = {
  back: 'Go back to MHV - Radiology',
  viewAll: 'View all images',
  downloadDicom: 'Download DICOM files',
};

export const ListTags = {
  pagination: {
    'allergies or reactions': 'Pagination - allergies or reactions',
    vaccines: 'Pagination - vaccines',
    'care summaries and notes': 'Pagination - care summaries and notes',
    'lab and test results': 'Pagination - lab and test results',
    vitals: 'Pagination - vitals',
    'health conditions': 'Pagination - health conditions',
  },
  vitalsPagination: {
    BLOOD_PRESSURE: 'Pagination - Blood pressure',
    PULSE: 'Pagination - Heart rate',
    HEART_RATE: 'Pagination - Heart rate',
    RESPIRATION: 'Pagination - Breathing rate',
    RESPIRATORY_RATE: 'Pagination - Breathing rate',
    PULSE_OXIMETRY: 'Pagination - Blood oxygen level (pulse oximetry)',
    OXYGEN_SATURATION_IN_ARTERIAL_BLOOD:
      'Pagination - Blood oxygen level (pulse oximetry)',
    TEMPERATURE: 'Pagination - Temperature',
    BODY_TEMPERATURE: 'Pagination - Temperature',
    BODY_WEIGHT: 'Pagination - Weight',
    WEIGHT: 'Pagination - Weight',
    BODY_HEIGHT: 'Pagination - Height',
    HEIGHT: 'Pagination - Height',
  },
  allergies: 'Allergies Detail Link',
  careSummaries: 'Care Summaries & Notes Detail Link',
  conditions: 'Health Conditions Detail Link',
  labTests: 'Lab and Test Results Detail Link',
  vaccines: 'Vaccines Detail Link',
};

export const VitalTags = {
  listLinks: {
    BLOOD_PRESSURE: 'Blood pressure over time Link',
    PULSE: 'Heart rate over time Link',
    HEART_RATE: 'Heart rate over time Link',
    RESPIRATION: 'Breathing rate over time Link',
    RESPIRATORY_RATE: 'Breathing rate over time Link',
    PULSE_OXIMETRY: 'Blood oxygen over time Link',
    OXYGEN_SATURATION_IN_ARTERIAL_BLOOD: 'Blood oxygen over time Link',
    TEMPERATURE: 'Temperature over time Link',
    BODY_TEMPERATURE: 'Temperature over time Link',
    BODY_WEIGHT: 'Weight over time Link',
    WEIGHT: 'Weight over time Link',
    BODY_HEIGHT: 'Height over time Link',
    HEIGHT: 'Height over time Link',
  },
};

export const LinkTags = {
  labTestNewMessage: 'Start a new message - L&TR Details info',
  vaccinesToAllergies: 'Go to your allergy records - Vaccines',
  reviewRecords: 'Learn more about medical records',
  landingPageNewMessage: 'Start a new message - MR help',
  faqNewMessage: 'Start a new message - FAQ',
  faqCrisisLine: 'VCL Button  - FAQ',
};

export const SettingsTags = {
  sharingOptIn: 'Opt in - Settings page',
  sharingOptOut: 'Opt out - Settings page',
  closeOptInModal: 'Close opt in modal',
  closeOptOutModal: 'Close opt out modal',
  primaryOptIn: 'Opt in - Modal',
  primaryOptOut: 'Opt out - Modal',
  secondaryOptIn: "Don't opt in - Modal",
  secondaryOptOut: "Don't opt out - Modal",
};

export const LandingTags = {
  accordionExpand: 'Accordion Expand button',
  labTestsResultsLabel: 'Go to your lab and test results',
  careSummariesNotesLabel: 'Go to your care summaries and notes',
  vaccinesLabel: 'Go to your vaccines',
  allergiesLabel: 'Go to your allergies and reactions',
  conditionsLabel: 'Go to your health conditions',
  vitalsLabel: 'Go to your vitals',
  downloadLabel: 'Go to download your medical records reports',
  settingsLabel: 'Go to manage your electronic sharing settings',
  shareDataCareTeam: 'Go to the Share My Health Data website',
};
