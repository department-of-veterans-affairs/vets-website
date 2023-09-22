export const AUTHORIZER_TYPES = {
  VETERAN: 'veteran',
  NON_VETERAN: 'nonVeteran',
};

export const AUTHORIZER_TYPE_ITEMS = {
  VETERAN: 'I’m a Veteran with an existing claim',
  NON_VETERAN:
    'I’m the spouse, dependent, survivor, or caregiver of a Veteran, and I have an existing claim',
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

export const SECURITY_QUESTIONS = {
  MOTHER_BIRTHPLACE: 'What’s the city and state your mother was born in?',
  HIGH_SCHOOL_NAME: 'What’s the name of the high school you attended?',
  FIRST_PET_NAME: 'What’s the name of your first pet?',
  FAVORITE_TEACHER_NAME: 'What’s the name of your favorite teacher?',
  FATHER_MIDDLE_NAME: 'What’s your father’s middle name?',
};
