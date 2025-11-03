// Always name keys with uppercase snake_casing
// Always use keys for data storage

export const dicOptions = {
  DIC: 'D.I.C.',
  DIC_1151:
    'D.I.C. under U.S.C. 1151 (Note: D.I.C. under 38 U.S.C. is a rare benefit. Please refer to the Instructions page 5 for guidance on 38 U.S.C. 1151)',
  DIC_REEVALUATION:
    'D.I.C. due to claimant election of a re-evaluation of a previously denied claim based on expanded eligibility under PL 117-168 (PACT Act)',
};

export const servicesOptions = {
  ARMY: 'Army',
  NAVY: 'Navy',
  AIR_FORCE: 'Air Force',
  COAST_GUARD: 'Coast Guard',
  MARINE_CORPS: 'Marine Corps',
  SPACE_FORCE: 'Space Force',
  USPHS: 'USPHS',
  NOAA: 'NOAA',
};

export const claimantRelationshipOptions = {
  SPOUSE: 'Surviving spouse',
  CUSTODIAN: 'Custodian filing for child under 18',
  ADULT_CHILD_STILL_IN_SCHOOL:
    'Adult child who is 18-23 years old and still in school',
  ADULT_CHILD_SERIOUSLY_DISABLED: 'Adult child who is seriously disabled',
};

export const marriageEndOptions = {
  SPOUSE_DEATH: "Spouse's death",
  DIVORCE: 'Divorce',
  OTHER: 'Other',
};

export const marriageTypeOptions = {
  CIVIL_RELIGIOUS:
    'In a civil or religious ceremony with an officiant who signed me marriage license',
  OTHER_WAY: 'Some other way',
};

export const separationReasonOptions = {
  MEDICAL_FINANCIAL: 'Medical or financial reasons',
  RELATIONSHIP_DIFFERENCES: 'Relationship differences or problems',
  OTHER: 'Other',
};

export const previousMarriageEndOptions = {
  DEATH: 'Death',
  DIVORCE: 'Divorce',
  OTHER: 'Other',
};

export const remarriageEndOptions = {
  DID_NOT_END: 'Did not end',
  SPOUSE_DEATH: "Spouse's death",
  DIVORCE: 'Divorce',
  OTHER: 'Other',
};

export const bankAccountTypeOptions = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
};

export const recipientTypeLabels = {
  VETERAN: 'Veteran (only select if a last or burial expense)',
  SURVIVING_SPOUSE: 'Surviving spouse',
  VETERANS_CHILD: 'Veteran’s child',
  OTHER: 'Other',
  CUSTODIAN: 'Custodian',
  CUSTODIAN_SPOUSE: 'Custodian’s spouse',
};

export const careTypeLabels = {
  RESIDENTIAL_CARE_FACILITY: 'Residential care facility',
  IN_HOME_CARE_ATTENDANT: 'In-home care attendant',
  NURSING_HOME: 'Nursing home',
  ADULT_DAYCARE: 'Adult daycare',
};

export const frequencyLabels = {
  MONTHLY: 'Once a month',
  YEARLY: 'Once a year',
  ONE_TIME: 'One-time',
};

export const typeOfIncomeLabels = {
  SOCIAL_SECURITY: 'Social Security',
  INTEREST_DIVIDEND: 'Interest or dividend income',
  CIVIL_SERVICE: 'Civil Service',
  PENSION_RETIREMENT: 'Pension or retirement income',
  OTHER: 'Other income',
};
