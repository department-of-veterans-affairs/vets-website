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
  homeOrNursing: 'Home care or nursing care',
  medical: 'Medical services',
  socialWork: 'Social work',
  vocationalRehabilitation: 'Vocational rehabilitation',
  none: 'None of these apply',
});

// Chapter 4

export const degreeOptions = Object.freeze([
  'High school diploma or equivalent',
  'Associate degree',
  "Bachelor's degree",
  "Master's degree",
  'Doctoral degree',
  'Other',
]);
