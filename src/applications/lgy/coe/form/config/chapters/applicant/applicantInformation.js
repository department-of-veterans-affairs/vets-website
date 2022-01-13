import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

export const schema = {
  type: 'object',
  properties: {
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
  fullName: fullNameUI,
  dateOfBirth: currentOrPastDateUI('Date of birth'),
};
