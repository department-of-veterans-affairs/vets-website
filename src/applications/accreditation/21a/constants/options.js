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

export const employmentStatusOptions = Object.freeze({
  EMPLOYED: 'Employed',
  UNEMPLOYED: 'Unemployed',
  SELF_EMPLOYED: 'Self-employed',
  STUDENT: 'Student',
  RETIRED: 'Retired',
  OTHER: 'Other',
});

export const descriptionRequired = Object.freeze([
  'UNEMPLOYED',
  'SELF_EMPLOYED',
  'OTHER',
]);

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
  'Marine Corps',
  'Navy',
  'NOAA',
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
  BUSINESS: 'Business or service that advertises predominately to Veterans',
  CONSULTING: 'Consulting or referral services for Veterans',
  FINANCIAL: 'Financial planning',
  HOME_OR_NURSING: 'Home care or nursing care',
  MEDICAL: 'Medical services',
  SOCIAL_WORK: 'Social work',
  VOCATIONAL_REHABILITATION: 'Vocational rehabilitation',
  NONE: 'None of these apply',
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
