/*
 * These are schema definitions for some common form fields
 */

export const fullName = {
  type: 'object',
  title: '',
  required: ['first', 'last'],
  properties: {
    first: {
      type: 'string',
      title: 'First name'
    },
    middle: {
      type: 'string',
      title: 'Middle name'
    },
    last: {
      type: 'string',
      title: 'Last name',
      minLength: 1,
      maxLength: 30
    },
    suffix: {
      type: 'string',
      title: 'Suffix',
      'enum': [
        '',
        'Jr.',
        'Sr.',
        'II',
        'III',
        'IV'
      ]
    }
  }
};

export const ssn = {
  title: 'Social security number',
  type: 'string',
  pattern: '^([0-9]{3}-[0-9]{2}-[0-9]{4}|[0-9]{9})$'
};
