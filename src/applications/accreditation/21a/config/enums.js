export const FORM_TYPE_ID = {
  Form: 1,
  Forma: 2,
};

// Chapter 1

// ACCREDITATION_TYPE - GCLAWS Mapping
const ACCREDITATION_TYPE_ID = {
  Agent: 1,
  Attorney: 2,
  'VSO Representative': 3,
  'Authorized Individual': 4,
  VSO: 5,
};
// ACCREDITATION_TYPE - Frontend Options to GCLAWS Mapping
export const ACCREDITATION_TYPE_ENUM = {
  AGENT: ACCREDITATION_TYPE_ID.Agent,
  ATTORNEY: ACCREDITATION_TYPE_ID.Attorney,
};
// PHONE_TYPE - GCLAWS Mapping
const PHONE_TYPE_ID = {
  Fax: 1,
  Home: 2,
  Mobile: 3,
  Other: 4,
  Pager: 5,
  'TTY/TDD()': 6,
  Work: 7,
};
// PHONE_TYPE - Frontend Options to GCLAWS Mapping
export const PHONE_TYPE_ENUM = {
  CELL: PHONE_TYPE_ID.Mobile,
  HOME: PHONE_TYPE_ID.Home,
  WORK: PHONE_TYPE_ID.Work,
};

// Chapter 2

// SERVICE_BRANCH - GCLAWS Mapping
const SERVICE_BRANCH_ID = {
  AIR_FORCE: 1,
  ARMY: 2,
  COAST_GUARD: 3,
  MARINES: 4,
  NAVY: 5,
  NOAA: 6,
  NO_ACTIVE_SERVICE: 7,
  PUBLIC_HEALTH_SERVICE: 8,
  SPACE_FORCE: 9,
  OTHER: 10,
};
// SERVICE_BRANCH - Frontend Options to GCLAWS Mapping
export const SERVICE_BRANCH_ENUM = {
  'Air Force': SERVICE_BRANCH_ID.AIR_FORCE,
  Army: SERVICE_BRANCH_ID.Army,
  'Coast Guard': SERVICE_BRANCH_ID.COAST_GUARD,
  Marines: SERVICE_BRANCH_ID.MARINES,
  Navy: SERVICE_BRANCH_ID.NAVY,
  NOAA: SERVICE_BRANCH_ID.NOAA,
  'No Active Service': SERVICE_BRANCH_ID.NO_ACTIVE_SERVICE,
  'Public Health Service': SERVICE_BRANCH_ID.PUBLIC_HEALTH_SERVICE,
  'Space Force': SERVICE_BRANCH_ID.SPACE_FORCE,
  Other: SERVICE_BRANCH_ID.OTHER,
};

// DISCHARGE_TYPE - GCLAWS Mapping
const DISCHARGE_TYPE_ID = {
  BAD_CONDUCT: 1,
  DISHONORABLE: 2,
  CONVEINIENCE_OF_GOVT: 3,
  ENTRY_LEVEL: 4,
  GENERAL: 5,
  HONORABLE: 6,
  MEDICAL: 7,
  OTHER_THAN_HONORABLE: 8,
};
// DISCHARGE_TYPE - Frontend Options to GCLAWS Mapping
export const DISCHARGE_TYPE_ENUM = {
  'Bad Conduct': DISCHARGE_TYPE_ID.BAD_CONDUCT,
  Dishonorable: DISCHARGE_TYPE_ID.DISHONORABLE,
  'Convenience of Govt': DISCHARGE_TYPE_ID.CONVEINIENCE_OF_GOVT,
  'Entry Level': DISCHARGE_TYPE_ID.ENTRY_LEVEL,
  General: DISCHARGE_TYPE_ID.GENERAL,
  Honorable: DISCHARGE_TYPE_ID.HONORABLE,
  Medical: DISCHARGE_TYPE_ID.MEDICAL,
  'Other Than Honorable': DISCHARGE_TYPE_ID.OTHER_THAN_HONORABLE,
};

export const APPLICATION_STATUS_ID = {
  Pending: 1,
  'Request/Return for information': 2,
  'VA Reference Check': 3,
  'Character References': 4,
  'Background Check': 5,
  'Paralegal Research': 6,
  'Attornet C&F': 7,
  'DCC Review': 8,
  'Complete-Denial Letter': 9,
  'Complete-Accredited': 10,
  'Complete-Withdraw/Abandoned/Other': 11,
  'Exam Invitation': 12,
  'Exam Scheduled': 13,
  'Exam Failed': 14,
};

export const GENDER_ID = {
  unknown: 1,
  male: 2,
  female: 3,
};

export const ADDRESS_TYPE_ID = {
  home: 1,
  business: 2,
  employment: 3,
  institution: 4,
  characterReference: 5,
};

export const EMPLOYMENT_STATUS_ID = {
  Employed: 1,
  Unemployed: 2,
  'Self-employed': 3,
  Student: 4,
};

export const INSTITUTION_TYPE_ID = {
  'High School': 1,
  'Community College': 2,
  'Under Graduate': 3,
  Graduate: 4,
};

export const DEGREE_TYPE_ID = {
  GED: 1,
  'HS Diploma': 2,
  Associates: 3,
  Bachelors: 4,
  Masters: 5,
  Doctorate: 6,
};

export const ADMITTANCE_TYPE_ID = {
  Jurisdiction: 1,
  Agency: 2,
};

export const DOCUMENT_TYPE_ID = {
  Jurisdiction: 1,
  Agency: 2,
  Imprisoned: 3,
  Convicted: 4,
  CurrentlyCharged: 5,
  Suspended: 6,
  Withdrawn: 7,
  Disciplined: 8,
  ResignedRetired: 9,
  AgencyAttorney: 10,
  Reprimanded: 11,
  ResignedToAvoidReprimand: 12,
  AppliedForAccreditation: 13,
  AccreditationTerminated: 14,
  Impairments: 15,
  PhysicalLimitations: 16,
};

export const RELATION_TO_APPLICANT_ID = {
  Classmate: 1,
  Colleague: 2,
  'Customer/Client': 3,
  Friend: 4,
  Neighbor: 5,
  Supervisor: 6,
  Educator: 7,
  Other: 8,
};
