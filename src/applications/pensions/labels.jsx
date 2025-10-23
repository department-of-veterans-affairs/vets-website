// Always name keys with uppercase snake_casing
// Always use keys for data storage
export const relationshipLabels = {
  CHILD: 'Child',
  PARENT: 'Parent',
};

export const childRelationshipLabels = {
  BIOLOGICAL: "They're my biological child",
  ADOPTED: "They're my adopted child",
  STEP_CHILD: "They're my stepchild",
};

export const marriageTypeLabels = {
  CEREMONY:
    'In a civil or religious ceremony with an officiant who signed my marriage license',
  OTHER: 'Some other way',
};

export const recipientTypeLabels = {
  VETERAN: 'Veteran',
  SPOUSE: 'Veteran’s spouse',
  DEPENDENT: 'Veteran’s child',
};

export const separationTypeLabels = {
  DEATH: 'Spouse’s death',
  DIVORCE: 'Divorce',
  OTHER: 'Other',
};

export const serviceBranchLabels = {
  army: 'Army',
  navy: 'Navy',
  airForce: 'Air Force',
  coastGuard: 'Coast Guard',
  marineCorps: 'Marine Corps',
  spaceForce: 'Space Force',
  usphs: 'USPHS',
  noaa: 'NOAA',
};

export const typeOfIncomeLabels = {
  SOCIAL_SECURITY: 'Social Security',
  INTEREST_DIVIDEND: 'Interest or dividend income',
  CIVIL_SERVICE: 'Civil Service',
  PENSION_RETIREMENT: 'Pension or retirement income',
  OTHER: 'Other income',
};

export const careTypeLabelsOld = {
  CARE_FACILITY: 'Care facility',
  IN_HOME_CARE_PROVIDER: 'In-home care provider',
};

export const careTypeLabels = {
  NURSING_HOME: 'Nursing home',
  CARE_FACILITY: 'Residential care facility',
  ADULT_DAYCARE: 'Adult daycare',
  IN_HOME_CARE_PROVIDER: 'In-home care attendant',
};

export const careFrequencyLabels = {
  ONCE_MONTH: 'Once a month',
  ONCE_YEAR: 'Once a year',
  ONE_TIME: 'One-time',
};
