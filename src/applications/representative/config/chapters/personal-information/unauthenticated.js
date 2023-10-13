import React from 'react';

import fullNameUI from '@department-of-veterans-affairs/platform-forms-system/fullName';
import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';

export const schema = {
  type: 'object',
  properties: {
    nameAndDobHeaderText: {
      type: 'object',
      properties: {
        'view:nameAndDobText': {
          type: 'object',
          properties: {},
        },
      },
    },
    fullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
        },
        middle: {
          type: 'string',
        },
        last: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
        },
        suffix: {
          type: 'string',
          enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
        },
      },
      required: ['first', 'last'],
    },
    dateOfBirth: {
      type: 'string',
      title: 'Date of birth',
      pattern:
        '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
    },
  },
  required: ['dateOfBirth'],
};

export const uiSchema = {
  nameAndDobHeaderText: {
    'view:nameAndDobText': {
      'ui:description': <h3>Veteran’s Name and Date of Birth</h3>,
    },
  },
  fullName: fullNameUI,
  dateOfBirth: currentOrPastDateUI('Date of birth'),
};
