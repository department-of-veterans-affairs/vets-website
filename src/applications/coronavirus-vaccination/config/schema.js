export default {
  type: 'object',
  required: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'birthDate',
    'vaccineInterest',
    'contactPreference',
  ],
  properties: {
    isIdentityVerified: {
      type: 'boolean',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    birthDate: {
      type: 'string',
    },
    ssn: {
      type: 'string',
      pattern: '^\\d{3}-?\\d{2}-?\\d{4}$',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
      pattern: '\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$',
    },
    contactPreference: {
      type: 'boolean',
    },
    contactMethod: {
      type: 'string',
      enum: ['phone', 'email'],
    },
    vaccineInterest: {
      type: 'string',
      enum: ['INTERESTED', 'NOT_INTERESTED', 'UNDECIDED', 'ALREADY_VACCINATED'],
    },
    // preferredFacility: {
    //   type: 'string',
    // },
  },
};
