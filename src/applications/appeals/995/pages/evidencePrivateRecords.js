import { EVIDENCE_PRIVATE } from '../constants';

import {
  validatePrivateName,
  validateCountry,
  validateStreet,
  validateCity,
  validateState,
  validatePostal,
  validatePrivateIssues,
  validatePrivateFromDate,
  validatePrivateToDate,
  validatePrivateUnique,
} from '../validations/evidence';

const requiredPrivateEvidence = {
  type: 'object',
  required: [
    'providerFacilityName',
    'issues',
    'providerFacilityAddress',
    'treatmentDateRange',
  ],
  properties: {
    providerFacilityName: {
      type: 'string',
    },
    issues: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
      },
    },
    providerFacilityAddress: {
      type: 'object',
      required: ['street', 'city', 'country', 'state', 'postalCode'],
      properties: {
        street: {
          type: 'string',
        },
        street2: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        state: {
          type: 'string',
        },
        postalCode: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
      },
    },
    treatmentDateRange: {
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

const notRequiredPrivateEvidence = {
  type: 'object',
  required: [],
  properties: {
    providerFacilityName: {
      type: 'string',
    },
    issues: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    providerFacilityAddress: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
        },
        street2: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        state: {
          type: 'string',
        },
        postalCode: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
      },
    },
    treatmentDateRange: {
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
    providerFacility: {
      items: {
        'ui:validations': [
          validatePrivateName,
          validateCountry,
          validateStreet,
          validateCity,
          validateState,
          validatePostal,
          validatePrivateIssues,
          validatePrivateFromDate,
          validatePrivateToDate,
          validatePrivateUnique,
        ],
      },
    },
  },
  schema: {
    type: 'object',
    oneOf: [
      {
        properties: {
          [EVIDENCE_PRIVATE]: {
            type: 'boolean',
            enum: [true],
          },
          providerFacility: {
            type: 'array',
            items: requiredPrivateEvidence,
          },
        },
      },
      {
        properties: {
          [EVIDENCE_PRIVATE]: {
            type: 'boolean',
            enum: [false],
          },
          providerFacility: {
            type: 'array',
            items: notRequiredPrivateEvidence,
          },
        },
      },
    ],
    properties: {},
  },
};
