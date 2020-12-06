export default {
  type: 'object',
  required: [
    'firstName',
    'lastName',
    'emailAddress',
    'phone',
    'dateOfBirth',
    'vaxPreference',
  ],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    dateOfBirth: {
      type: 'string',
    },
    ssn: {
      type: 'string',
      pattern: '^\\d{3}-?\\d{2}-?\\d{4}$',
    },
    emailAddress: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
      pattern: '\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$',
    },
    vaxPreference: {
      type: 'string',
      enum: ['INTERESTED', 'NOT_INTERESTED', 'UNDECIDED', 'ALREADY_VACCINATED'],
    },
    facility: {
      type: 'string',
    },
  },
};
