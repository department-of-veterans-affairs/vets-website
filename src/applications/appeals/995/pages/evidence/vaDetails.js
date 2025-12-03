import { HAS_VA_EVIDENCE } from '../../constants';

import {
  validateVaLocation,
  validateVaIssues,
  validateVaDate,
  validateVaUnique,
} from '../../validations/evidence';

const dates = {
  treatmentDate: { type: 'string' },
  noDate: { type: 'boolean' },
};

const requiredLocations = () => {
  return {
    type: 'object',
    required: ['locationAndName', 'issues'],
    properties: {
      locationAndName: { type: 'string' },
      issues: { type: 'array', minItems: 1, items: { type: 'string' } },
      ...dates,
    },
  };
};

const notRequiredLocations = () => {
  return {
    type: 'object',
    required: [],
    properties: {
      locationAndName: { type: 'string' },
      issues: { type: 'array', items: { type: 'string' } },
      ...dates,
    },
  };
};

const schema = {
  type: 'object',
  oneOf: [
    {
      properties: {
        [HAS_VA_EVIDENCE]: {
          type: 'boolean',
          enum: [true],
        },
        locations: {
          type: 'array',
          items: requiredLocations(),
        },
      },
    },
    {
      properties: {
        [HAS_VA_EVIDENCE]: {
          type: 'boolean',
          enum: [false],
        },
        locations: {
          type: 'array',
          items: notRequiredLocations(),
        },
      },
    },
  ],
  properties: {},
};

export default {
  uiSchema: {
    locations: {
      items: {
        'ui:validations': [
          validateVaLocation,
          validateVaIssues,
          validateVaDate,
          validateVaUnique,
        ],
      },
    },
  },
  schema,
};
