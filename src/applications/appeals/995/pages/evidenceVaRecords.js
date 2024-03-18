import { EVIDENCE_VA } from '../constants';

import {
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
  validateVaUnique,
} from '../validations/evidence';

const requiredLocations = {
  type: 'object',
  required: ['locationAndName', 'issues', 'evidenceDates'],
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
    evidenceDates: {
      type: 'object',
      required: ['from', 'to'],
      properties: {
        from: {
          type: 'string',
        },
        to: {
          type: 'string',
        },
      },
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
    evidenceDates: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
        },
        to: {
          type: 'string',
        },
      },
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
          validateVaFromDate,
          validateVaToDate,
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
