import {
  uiSchema as addressUI,
  schema as addressSchema,
} from '../../../../platform/forms/definitions/address';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { employmentDescription } from '../content/employmentHistory';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': employmentDescription,
  unemployability: {
    employmentHistory: {
      items: {
        emloyersName: {
          'ui:title': 'Employer’s name',
        },
        inBusiness: {
          'ui:title': 'Employer is no longer in business',
        },
        employerAddress: addressUI('', false),
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:unemployabilityUploadChoice'],
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        employmentHistory: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              employersName: {
                type: 'string',
              },
              inBusiness: {
                type: 'boolean',
              },
              employerAddress: {
                type: 'object',
                properties: {
                  ...addressSchema(fullSchema526EZ),
                },
              },
            },
          },
        },
      },
    },
  },
};
