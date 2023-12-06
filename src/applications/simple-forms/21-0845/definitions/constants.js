export const AUTHORIZER_TYPES = Object.freeze({
  VETERAN: 'veteran',
  NON_VETERAN: 'nonVeteran',
});

export const AUTHORIZER_TYPE_ITEMS = Object.freeze({
  VETERAN: 'I’m a Veteran with an existing claim',
  NON_VETERAN:
    'I’m the spouse, dependent, survivor, or caregiver of a Veteran, and I have an existing claim',
});

export const THIRD_PARTY_TYPES = Object.freeze({
  PERSON: 'person',
  ORGANIZATION: 'organization',
});

export const INFORMATION_SCOPES = Object.freeze({
  LIMITED: 'limited',
  ANY: 'any',
});

export const LIMITED_INFORMATION_ITEMS = Object.freeze({
  CLAIM_STATUS: { title: 'Status of pending claim or appeal' },
  BENEFIT: { title: 'Current benefit and rate' },
  PAYMENT_HISTORY: { title: 'Payment history' },
  MONEY_OWED: { title: 'Amount of money owed to VA' },
  PAYMENT_LETTER: {
    title: 'Request a benefit payment letter',
    description: '',
  },
  ADDRESS_CHANGE: {
    title: 'Change of address or direct deposit',
    description: '',
  },
});

export const RELEASE_DURATIONS = Object.freeze({
  ONCE_ONLY: 'Only release my information this 1 time',
  UNTIL_DATE: 'Release my information until a specific date that I’ll choose',
  UNTIL_NOTICE:
    'Continue to release my information until I send written notice to stop (or until I confirm with a VA representative by phone)',
});

export const SECURITY_QUESTIONS = Object.freeze({
  MOTHER_BIRTHPLACE:
    'What’s the city and state or city and country your mother was born in?',
  HIGH_SCHOOL_NAME: 'What’s the name of the last high school you attended?',
  FIRST_PET_NAME: 'What’s the name of your first pet?',
  FAVORITE_TEACHER_NAME: 'What’s the name of your favorite teacher?',
  FATHER_MIDDLE_NAME: 'What’s your father’s middle name?',
});

export const workInProgressContent = Object.freeze({
  description:
    'We’re rolling out the Third-Party Authorization (VA Form 21-0845) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
});
