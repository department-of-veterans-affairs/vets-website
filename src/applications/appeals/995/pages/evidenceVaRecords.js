import { EVIDENCE_VA } from '../constants';

import {
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
  validateVaUnique,
} from '../validations/evidence';

import { showScNewForm } from '../utils/toggle';

const requiredLocations = newForm => {
  const dates = newForm
    ? {
        treatmentDate: { type: 'string' },
        noDate: { type: 'boolean' },
      }
    : {
        evidenceDates: {
          type: 'object',
          required: ['from', 'to'],
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
          },
        },
      };

  return {
    type: 'object',
    required: newForm
      ? ['locationAndName', 'issues']
      : ['locationAndName', 'issues', 'evidenceDates'],
    properties: {
      locationAndName: { type: 'string' },
      issues: { type: 'array', minItems: 1, items: { type: 'string' } },
      ...dates,
    },
  };
};

const notRequiredLocations = newForm => {
  const dates = newForm
    ? {
        treatmentDate: { type: 'string' },
        noDate: { type: 'boolean' },
      }
    : {
        evidenceDates: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
          },
        },
      };
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

const newSchema = {
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
          items: requiredLocations(true),
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
          items: notRequiredLocations(true),
        },
      },
    },
  ],
  properties: {},
};

const oldSchema = {
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
          items: requiredLocations(),
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
          validateVaFromDate,
          validateVaToDate,
          validateVaUnique,
        ],
        'ui:options': {
          updateSchema: (formData = {}) =>
            showScNewForm(formData) ? newSchema : oldSchema,
        },
      },
    },
  },
  schema: oldSchema,
};
