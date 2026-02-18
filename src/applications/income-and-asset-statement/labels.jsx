// Always name keys with uppercase snake_casing
// Always use keys for data storage
export const relationshipLabels = {
  VETERAN: 'Veteran',
  SPOUSE: 'Spouse',
  CHILD: 'Child/children',
  PARENT: 'Parent',
  CUSTODIAN: 'Custodian of child',
  OTHER: 'Another dependent not listed here',
};

export const parentRelationshipLabels = {
  PARENT: 'Me',
  SPOUSE: 'My spouse',
  OTHER: 'Another dependent not listed here',
};

export const spouseRelationshipLabels = {
  SPOUSE: 'Surviving spouse',
  CHILD: 'Child/children',
  OTHER: 'Another dependent not listed here',
};

export const custodianRelationshipLabels = {
  CUSTODIAN: 'Child’s custodian',
  SPOUSE: 'Custodian’s spouse',
  CHILD: 'Veteran’s surviving child',
  OTHER: 'Another dependent not listed here',
};

export const custodianRelationshipLabelDescriptions = {
  CUSTODIAN: 'Unless the child’s custodian is an institution',
  SPOUSE:
    'Unless you’re estranged, live apart, and don’t contribute to their support',
};

export const spouseRelationshipLabelDescriptions = {
  CHILD: 'Unless you don’t have custody and don’t provide financial support',
};

export const relationshipLabelDescriptions = {
  SPOUSE:
    'Unless you’re estranged, live apart, and don’t contribute to their support',
  CHILD: 'Unless you don’t have custody and don’t provide financial support',
  CUSTODIAN: 'Unless the child’s custodian is an institution',
};

export const parentRelationshipLabelDescriptions = {
  SPOUSE: 'The Veteran’s other parent should file a separate claim',
};

export const transferMethodLabels = {
  SOLD: 'Sold',
  TRADED: 'Traded',
  GIFTED: 'Gifted',
  CONVEYED: 'Conveyed',
  OTHER: 'Another way',
};

export const transferMethodDescriptions = {
  SOLD: 'Original owner received money for the asset',
  TRADED: 'Original owner swapped the asset for other property',
  GIFTED: 'Original owner gave away the asset',
  CONVEYED:
    'The title or ownership of an asset was legally transferred to someone else by using contracts, leases, titles, or deeds.',
};

export const claimantTypeLabels = {
  VETERAN: 'I’m a Veteran submitting this form to support my own claim',
  SPOUSE: 'I’m the Veteran’s surviving spouse',
  CHILD: 'I’m the Veteran’s surviving child',
  CUSTODIAN: 'I’m the custodian of a Veteran’s surviving child',
  PARENT: 'I’m the Veteran’s surviving parent',
};

export const incomeFrequencyLabels = {
  RECURRING: 'Recurring',
  IRREGULAR: 'Irregular',
  ONE_TIME: 'One time payment',
};

export const updatedIncomeFrequencyLabels = {
  RECURRING: 'Regularly (monthly or weekly)',
  IRREGULAR: 'Irregular (like every month or week)',
  ONE_TIME: 'Once',
};

export const incomeTypeLabels = {
  SOCIAL_SECURITY: 'Social Security',
  RETIREMENT_PENSION: 'Pension or retirement income',
  WAGES: 'Wages',
  UNEMPLOYMENT: 'Unemployment',
  CIVIL_SERVICE: 'Civil Service',
  OTHER: 'Other',
};

export const updatedIncomeTypeLabels = {
  WAGES: 'Wage from a job',
  RETIREMENT_PENSION: 'Pension or retirement',
  SOCIAL_SECURITY: 'Social Security',
  UNEMPLOYMENT: 'Unemployment',
  OTHER: 'Another type of income',
};

export const incomeTypeEarnedLabels = {
  INTEREST: 'Interest',
  DIVIDENDS: 'Dividends',
  OTHER: 'Other financial asset income',
};

export const generatedIncomeTypeLabels = {
  INTELLECTUAL_PROPERTY: 'Intellectual property rights',
  MINERALS_LUMBER: 'Mineral or lumber extraction',
  USE_OF_LAND: 'Land usage fees',
  OTHER: 'Another way',
};

export const discontinuedIncomeTypeLabels = {
  WAGES: 'Wages',
  INTEREST: 'Interest',
  UNEMPLOYMENT_BENEFITS: 'Unemployment benefits',
  LOTTERY_WINNINGS: 'Lottery winnings',
  OTHER: 'Another type of income',
};

export const ownedAssetTypeLabels = {
  BUSINESS: 'Business',
  FARM: 'Farm',
  RENTAL_PROPERTY: 'Rental property',
};

export const trustTypeLabels = {
  REVOCABLE: 'Revocable',
  IRREVOCABLE: 'Irrevocable',
  BURIAL: 'Burial trust',
};
