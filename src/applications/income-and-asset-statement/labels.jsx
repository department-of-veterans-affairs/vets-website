// Always name keys with uppercase snake_casing
// Always use keys for data storage
export const relationshipLabels = {
  VETERAN: 'Veteran',
  SPOUSE: 'Spouse',
  CHILD: 'Child/children',
  PARENT: 'Parent',
  CUSTODIAN: 'Custodian of child',
  OTHER: 'Another dependent not listed here ',
};

export const relationshipLabelDescriptions = {
  SPOUSE:
    'Unless you’re estranged, live apart, and don’t contribute to their support',
  CHILD: 'Unless you don’t have custody and don’t provide financial support',
};

export const transferMethodLabels = {
  SOLD: 'Sold',
  GIFTED: 'Gifted',
  CONVEYED: 'Conveyed',
  TRADED: 'Traded',
  OTHER: 'Other',
};

export const claimantTypeLabels = {
  VETERAN: "I'm a Veteran submitting this form to support my own claim",
  SPOUSE: "I'm the Veteran's surviving spouse",
  CHILD: "I'm the Veteran's surviving child",
  CUSTODIAN: "I'm the custodian of a Veteran's surviving child",
  PARENT: "I'm the Veteran's surviving parent",
};

export const incomeFrequencyLabels = {
  RECURRING: 'Recurring',
  IRREGULAR: 'Irregular',
  ONE_TIME: 'One time payment',
};

export const incomeTypeLabels = {
  SOCIAL_SECURITY: 'Social Security',
  RETIREMENT_PENSION: 'Pension or retirement income',
  WAGES: 'Wages',
  UNEMPLOYMENT: 'Unemployment',
  CIVIL_SERVICE: 'Civil Service',
  OTHER: 'Other',
};

export const incomeTypeEarnedLabels = {
  INTEREST: 'Interest',
  DIVIDENDS: 'Dividends',
  OTHER: 'Other',
};

export const ownedAssetTypeLabels = {
  BUSINESS: 'Business',
  FARM: 'Farm',
  RENTAL_PROPERTY: 'Rental property',
};

export const generatedIncomeTypeLabels = {
  INTELLECTUAL_PROPERTY: 'Benefits from intellectual property',
  MINERALS_LUMBER: 'Extraction of minerals/lumber',
  USE_OF_LAND: 'Use of land',
  OTHER: 'Other',
};

export const trustTypeLabels = {
  REVOCABLE: 'Revocable',
  IRREVOCABLE: 'Irrevocable',
  BURIAL: 'Burial trust',
};
