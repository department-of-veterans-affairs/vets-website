// Always name keys with uppercase snake_casing
// Always use keys for data storage

import constants from 'vets-json-schema/dist/constants.json';

export const dicOptions = {
  DIC: 'DIC',
  '1151DIC': 'DIC under U.S.C. 1151',
  pactActDIC: 'DIC re-evaluation based on the PACT Act',
};

export const servicesOptions = {
  army: {
    label: 'Army',
  },
  navy: {
    label: 'Navy',
  },
  airForce: {
    label: 'Air Force',
  },
  coastGuard: {
    label: 'Coast Guard',
  },
  marineCorps: {
    label: 'Marine Corps',
  },
  spaceForce: {
    label: 'Space Force',
  },
  usphs: {
    label: 'USPHS',
  },
  noaa: {
    label: 'NOAA',
  },
};

export const claimantRelationshipOptions = {
  SURVIVING_SPOUSE: 'Surviving spouse',
  CUSTODIAN_FILING_FOR_CHILD_UNDER_18: 'Custodian filing for child under 18',
  'CHILD_18-23_IN_SCHOOL':
    'Adult child who is 18-23 years old and still in school',
  HELPLESS_ADULT_CHILD: 'Adult child who is seriously disabled',
  OTHER: 'Other',
};

export const marriageEndOptions = {
  death: "Spouse's death",
  divorce: 'Divorce',
  other: 'Other',
};

export const marriageTypeOptions = {
  ceremonial:
    'In a civil or religious ceremony with an officiant who signed my marriage license',
  other: 'Some other way',
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
  didNotEnd: 'Did not end',
  death: "Spouse's death",
  divorce: 'Divorce',
  other: 'Other',
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

export const incomeRecipientTypeLabels = {
  SURVIVING_SPOUSE: 'Surviving spouse',
  CHILD: 'Veteran’s child',
  CUSTODIAN: 'Custodian',
  CUSTODIAN_SPOUSE: 'Custodian’s spouse',
};

export const medicalExpenseRecipientLabels = {
  VETERAN: 'Veteran (only select if a last or burial expense)',
  SURVIVING_SPOUSE: 'Surviving spouse',
  VETERANS_CHILD: 'Veteran’s child',
};

export const careTypeLabels = {
  CARE_FACILITY: 'Residential care facility',
  IN_HOME_CARE_ATTENDANT: 'In-home care attendant',
  NURSING_HOME: 'Nursing home',
  ADULT_DAYCARE: 'Adult daycare',
};

export const frequencyLabels = {
  MONTHLY: 'Once a month',
  YEARLY: 'Once a year',
  ONE_TIME: 'One-time',
};

export const careFrequencyLabels = {
  MONTHLY: 'Once a month',
  ANNUALLY: 'Once a year',
};

export const typeOfIncomeLabels = {
  SOCIAL_SECURITY: 'Social Security',
  INTEREST_DIVIDENDS: 'Interest or dividend income',
  CIVIL_SERVICE: 'Civil Service',
  PENSION_RETIREMENT: 'Pension or retirement income',
  OTHER: 'Other income',
};

export const careRecipientLabels = {
  SURVIVING_SPOUSE: 'Surviving spouse',
  OTHER: 'Other',
};

// Get military states to filter them out
// Marriage-specific state list: filter out military state codes so the
// marriage pages always render the US states/territories dropdown instead
// of the military AA/AE/AP radio. We do this here at the page level so we
// don't change global address behavior.
export const MARRIAGE_MILITARY_STATE_VALUES = constants.militaryStates
  ? constants.militaryStates.map(state => state.value)
  : ['AA', 'AE', 'AP'];

export const MARRIAGE_FILTERED_STATES = constants.states.USA.filter(
  state => !MARRIAGE_MILITARY_STATE_VALUES.includes(state.value),
);
export const STATE_VALUES = MARRIAGE_FILTERED_STATES.map(s => s.value);
export const STATE_NAMES = MARRIAGE_FILTERED_STATES.map(s => s.label);

export const COUNTRY_VALUES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.value);
export const COUNTRY_NAMES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.label);

export const filteredStatesForEnd = constants.states.USA.filter(
  s => !MARRIAGE_MILITARY_STATE_VALUES.includes(s.value),
);
