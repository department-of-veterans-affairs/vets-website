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
    },
    middle: {
      type: 'string',
    },
    last: {
      type: 'string',
      minLength: 1,
      maxLength: 30
    },
    suffix: {
      type: 'string',
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
  type: 'string',
  pattern: '^([0-9]{3}-[0-9]{2}-[0-9]{4}|[0-9]{9})$'
};
