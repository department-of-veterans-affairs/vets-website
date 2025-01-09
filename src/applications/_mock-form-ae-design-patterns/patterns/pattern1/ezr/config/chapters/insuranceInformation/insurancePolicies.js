import { INSURANCE_VIEW_FIELDS } from '../../../../../../utils/constants';

export default {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      [INSURANCE_VIEW_FIELDS.add]: { type: 'boolean' },
      providers: {
        default: [],
        type: 'array',
        items: {
          type: 'object',
          properties: {
            insuranceName: {
              type: 'string',
              maxLength: 100,
            },
            insurancePolicyHolderName: {
              type: 'string',
              maxLength: 50,
            },
          },
        },
        anyOf: [
          {
            properties: {
              insurancePolicyNumber: {
                type: 'string',
                maxLength: 30,
                pattern: '^.*\\S.*',
              },
            },
            required: ['insurancePolicyNumber'],
          },
          {
            properties: {
              insuranceGroupCode: {
                type: 'string',
                maxLength: 30,
                pattern: '^.*\\S.*',
              },
            },
            required: ['insuranceGroupCode'],
          },
        ],
      },
    },
  },
};
