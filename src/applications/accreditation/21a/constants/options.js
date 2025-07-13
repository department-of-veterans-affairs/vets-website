// Chapter 1

export const roleOptions = Object.freeze({
  ATTORNEY: 'Attorney',
  CLAIMS_AGENT: 'Claims agent (non-attorney representative)',
});

export const typeOfPhoneOptions = Object.freeze({
  CELL: 'Cell',
  HOME: 'Home',
  WORK: 'Work',
});

export const primaryMailingAddressOptions = Object.freeze({
  HOME: 'Home',
  WORK: 'Work',
  OTHER: 'Other',
});

export const primaryMailingAddressOptionsNoWork = Object.freeze({
  HOME: 'Home',
  OTHER: 'Other',
});

// Chapter 2

export const branchOptions = Object.freeze([
  'Air Force',
  'Army',
  'Coast Guard',
  'Marines',
  'Navy',
  'NOAA',
  'No Active Service',
  'Public Health Service',
  'Space Force',
  'Other',
]);

export const characterOfDischargeOptions = Object.freeze([
  'Bad Conduct',
  'Dishonorable',
  'Convenience of Govt',
  'Entry Level',
  'General',
  'Honorable',
  'Medical',
  'Other Than Honorable',
]);

export const explanationRequired = Object.freeze([
  'Other Than Honorable',
  'Bad Conduct',
  'Dishonorable',
]);

// Chapter 3

export const employmentStatusOptions = Object.freeze({
  EMPLOYED: 'Employed',
  UNEMPLOYED: 'Unemployed',
  SELF_EMPLOYED: 'Self-employed',
  STUDENT: 'Student',
});

export const employmentActivitiesOptions = Object.freeze({
  BUSINESS: 'Business or service that advertises predominately to Veterans',
  CONSULTING: 'Consulting or referral services for Veterans',
  FINANCIAL: 'Financial planning',
  HOME_OR_NURSING: 'Home care or nursing care',
  MEDICAL: 'Medical services',
  SOCIAL_WORK: 'Social work',
  VOCATIONAL_REHABILITATION: 'Vocational rehabilitation',
});

export const descriptionRequired = Object.freeze([
  'UNEMPLOYED',
  'SELF_EMPLOYED',
]);

// Chapter 4

export const degreeOptions = Object.freeze([
  'GED',
  'High school diploma',
  'Associate degree',
  "Bachelor's degree",
  "Master's degree",
  'Doctoral degree',
]);

// Chapter 7

export const characterReferencesRelationship = Object.freeze([
  'Classmate',
  'Colleague',
  'Customer/Client',
  'Friend',
  'Neighbor',
  'Supervisor',
  'Educator',
  'Other',
]);
