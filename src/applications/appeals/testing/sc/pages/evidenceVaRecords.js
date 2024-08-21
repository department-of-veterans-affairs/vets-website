import { EVIDENCE_VA } from '../constants';

import {
  validateVaLocation,
  validateVaIssues,
  validateVaDate,
  validateVaUnique,
} from '../validations/evidence';

const requiredLocations = {
  type: 'object',
  required: ['locationAndName', 'issues'],
  properties: {
    locationAndName: {
      type: 'string',
    },
    issues: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
      },
    },
    treatmentDate: {
      type: 'string',
    },
    noDate: {
      type: 'boolean',
    },
  },
};

const notRequiredLocations = {
  type: 'object',
  required: [],
  properties: {
    locationAndName: {
      type: 'string',
    },
    issues: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    treatmentDate: {
      type: 'string',
    },
    noDate: {
      type: 'boolean',
    },
  },
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
  schema: {
    type: 'object',
    oneOf: [
      {
        properties: {
          [EVIDENCE_VA]: {
            type: 'boolean',
            enum: [true],
          },
          locations: {
            type: 'array',
            items: requiredLocations,
          },
        },
      },
      {
        properties: {
          [EVIDENCE_VA]: {
            type: 'boolean',
            enum: [false],
          },
          locations: {
            type: 'array',
            items: notRequiredLocations,
          },
        },
      },
    ],
    properties: {},
  },
};
