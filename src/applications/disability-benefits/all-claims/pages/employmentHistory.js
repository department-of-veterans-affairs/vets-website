import {
  uiSchema as addressUI,
  schema as addressSchema,
} from '../../../../platform/forms/definitions/address';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { employmentDescription } from '../content/employmentHistory';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': employmentDescription,
  'view:unemployabilityUploadChoice': {
    'ui:title': 'Please tell us what you would like to do.',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions:
          'I want to continue online with questions about my unemployability.',
        upload:
          'I already filled out a paper VA Form 21-8940 and want to upload it.',
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
            },
          },
        },
      },
    },
  },
};
