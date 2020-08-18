import { isDependent } from '../../helpers';

export const schema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      maxLength: 100,
    },
    middleName: {
      type: 'string',
      maxLength: 100,
    },
    lastName: {
      type: 'string',
      maxLength: 100,
    },
    suffix: {
      type: 'string',
      enum: ['Jr', 'Sr'],
    },
    ssn: {
      type: 'string',
    },
    dateOfBirth: {
      pattern:
        '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
      type: 'string',
    },
  },
};

export const uiSchema = {
  firstName: {
    'ui:required': formData => isDependent(formData),
  },
  middleName: {},
  lastName: {
    'ui:required': formData => isDependent(formData),
  },
  suffix: {},
  ssn: {
    'ui:required': formData => isDependent(formData),
  },
};
