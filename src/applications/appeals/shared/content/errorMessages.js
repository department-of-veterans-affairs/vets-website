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
    pastDate: cutoffDate => `The date must be before ${cutoffDate}.`,
    recentDate:
      'You must add an issue with a decision date that’s less than a year old',
    newerDate:
      'You must add an issue with a decision date that’s less than 100 years old',
  },

  country: 'Choose a country',
  street: 'Enter a street address',
  city: 'Enter a city name',
  state: 'Choose a state',
  postal: 'Enter a postal code',
  zip: 'You must enter a valid 5- or 9-digit postal code (dashes allowed)',
};

export default errorMessages;
