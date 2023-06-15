export const AUTHORIZER_TYPES = {
  VETERAN: 'veteran',
  NON_VETERAN: 'non-veteran',
};

export const THIRD_PARTY_TYPES = {
  PERSON: 'person',
  ORGANIZATION: 'organization',
};

export const INFORMATION_SCOPES = {
  LIMITED: 'limited',
  ANY: 'any',
};

export const LIMITED_INFORMATION_ITEMS = {
  CLAIM_STATUS: 'Status of pending claim or appeal',
  BENEFIT: 'Current benefit and rate',
  PAYMENT_HISTORY: 'Payment history',
  MONEY_OWED: 'Amount of money owed to VA',
  PAYMENT_LETTER: 'Request a benefit payment letter',
  ADDRESS_CHANGE: 'Change of address or direct deposit',
};

export const RELEASE_DURATIONS = {
  ONCE_ONLY: 'Only release my information this 1 time',
  UNTIL_DATE: 'Release my information until a specific date that I’ll choose',
  UNTIL_NOTICE: 'Release my information until I send written notice to stop',
};
