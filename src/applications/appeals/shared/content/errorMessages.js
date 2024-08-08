const errorMessages = {
  contestedIssue: 'You must select an eligible issue',
  missingIssue: 'You must add an issue',
  uniqueIssue: 'You must enter a condition you haven’t already entered',
  maxLength: max => `You can enter a maximum of ${max} characters`,
  requiredYesNo: 'You must answer yes or no',

  maxSelected: 'You’ve reached the maximum number of allowed selected issues',

  invalidDate: 'You must provide a date that includes a month, day, and year',

  endDateBeforeStart: 'The end date must be after the start date',
  cardInvalidDate: 'Invalid decision date',

  upload: 'You must provide a password to decrypt this file',

  decisions: {
    blankDate: 'You must enter a decision date',
    pastDate: 'You must add a decision date that’s in the past',
    recentDate:
      'You must add an issue with a decision date that’s less than a year old',
    newerDate:
      'You must add an issue with a decision date that’s less than 100 years old',
  },

  country: 'You must choose a country',
  street: 'You must enter a street address',
  city: 'You must enter a city name',
  state: 'You must choose a state',
  postal: 'You must enter a postal code',
  zip: 'You must enter a valid 5- or 9-digit postal code (dashes allowed)',
};

export default errorMessages;
