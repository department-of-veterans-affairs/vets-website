export default {
  type: 'object',
  required: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'zipCode',
    'birthDate',
    'vaccineInterest',
    'zipCodeDetails',
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
    zipCode: {
      type: 'string',
      pattern: '^\\d{5}(-\\d{4})?$',
    },
    zipCodeDetails: {
      type: 'string',
      enum: ['Yes', 'No', 'Unsure'],
    },
    vaccineInterest: {
      type: 'string',
      enum: ['INTERESTED', 'NOT_INTERESTED', 'UNDECIDED', 'PREFER_NO_ANSWER'],
    },
  },
};
