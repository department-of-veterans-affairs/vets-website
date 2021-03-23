import React from 'react';

export const schema = {
  personalInformation: {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      birthDate: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      },
      ssn: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      phone: {
        type: 'string',
        pattern: '\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$',
      },
    },
  },
};

export const uiSchema = {
  personalInformation: {
    firstName: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter your first name.',
      },
      // 'ui:disabled': true,
    },
    lastName: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter your last name.',
      },
      // 'ui:disabled': true,
    },
    birthDate: {
      'ui:title': 'Date of birth',

      'ui:widget': 'date',
      // 'ui:disabled': true,
    },
    ssn: {
      'ui:title': 'Social Security number (SSN)',

      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        // hideIf: formData => formData.isIdentityVerified,
      },
      'ui:errorMessages': {
        pattern: 'Please enter a valid 9 digit SSN (dashes allowed)',
        required: 'Please enter a SSN',
      },
    },
    email: {
      'ui:title': 'Email address',
      'ui:widget': 'email',
      'ui:errorMessages': {
        required: 'Please enter your email address, using this format: X@X.com',
        pattern:
          'Please enter your email address again, using this format: X@X.com',
      },
    },
    phone: {
      'ui:title': 'Phone',
      'ui:errorMessages': {
        required: 'Please enter your phone number',
        pattern: 'Please enter a valid phone number',
      },
    },
  },
};
