// Chapter 1

export const roleOptions = Object.freeze({
  attorney: 'Attorney',
  claimsAgent: 'Claims agent (non-attorney representative)',
});

export const typeOfPhoneOptions = Object.freeze({
  cell: 'Cell',
  home: 'Home',
  work: 'Work',
});

export const employmentStatusOptions = Object.freeze({
  employed: 'Employed',
  unemployed: 'Unemployed',
  selfEmployed: 'Self-employed',
  student: 'Student',
  retired: 'Retired',
  other: 'Other',
});

export const descriptionRequired = Object.freeze([
  'unemployed',
  'selfEmployed',
  'other',
]);

export const primaryMailingAddressOptions = Object.freeze({
  home: 'Home',
  work: 'Work',
  other: 'Other',
});

export const primaryMailingAddressOptionsNoWork = Object.freeze({
  home: 'Home',
  other: 'Other',
});

// Chapter 2

export const branchOptions = Object.freeze([
  'Air Force',
  'Army',
  'Coast Guard',
  'Marine Corps',
  'Navy',
  'NOAAA',
  'Space Force',
  'USPHS',
]);

export const characterOfDischargeOptions = Object.freeze([
  'Honorable',
  'General',
  'Other Than Honorable',
  'Bad Conduct',
  'Dishonorable',
  'Other',
]);

export const explanationRequired = Object.freeze([
  'Other Than Honorable',
  'Bad Conduct',
  'Dishonorable',
  'Other',
]);

// Chapter 3

export const employmentActivitiesOptions = Object.freeze({
  business: 'Business or service that advertises predominately to Veterans',
  consulting: 'Consulting or referral services for Veterans',
  financial: 'Financial planning',
  funeral: 'Funeral industry',
  home: 'Home care',
  medical: 'Medical services',
  nursing: 'Nursing care',
});

// Chapter 4

export const degreeOptions = Object.freeze([
  'Did not receive a degree',
  'Associate of Arts',
  'Bachelor of Arts',
  'Bachelor of Science',
  'Master of Arts',
  'Master of Science',
  'Juris Doctor',
  'Other',
]);
