const errorMessages = {
  contestedIssue: 'You must select an eligible issue',
  missingIssue: 'You must add an issue',
  uniqueIssue: 'You must enter a condition you haven’t already entered',
  maxLength: max => `You can enter a maximum of ${max} characters`,
  requiredYesNo: 'You must answer yes or no',

  maxSelected: 'You’ve reached the maximum number of allowed selected issues',

  invalidDate: 'You must provide a date that includes a month, day, and year',
  // startDateInPast: 'The start date must be in the future',
  // endDateInPast: 'The end date must be in the future',
  endDateBeforeStart: 'The end date must be after the start date',
  cardInvalidDate: 'Invalid decision date',

  decisions: {
    blankDate: 'You must enter a decision date',
    pastDate: 'You must add a decision date that’s in the past',
    newerDate:
      'You must add an issue with a decision date that’s less than 100 years old',
  },

  invalidZip:
    'You must enter a valid 5- or 9-digit postal code (dashes allowed)',
};

export default errorMessages;
