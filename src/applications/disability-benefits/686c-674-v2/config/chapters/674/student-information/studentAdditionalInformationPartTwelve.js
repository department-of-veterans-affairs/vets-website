import {
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { StudentAssetsH3 } from './helpers';
import { generateHelpText } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    studentInformation: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          'view:pensionEarnings': {
            type: 'object',
            properties: {},
          },
          studentNetworthInformation: {
            type: 'object',
            properties: {
              savings: numberSchema,
              securities: numberSchema,
              realEstate: numberSchema,
              otherAssets: numberSchema,
              totalValue: numberSchema,
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': StudentAssetsH3,
      'view:pensionEarnings': {
        'ui:description': generateHelpText(
          'If you’re claiming or you already receive Veterans Pension or Survivors Pension benefits, we need to know the student’s income. If you’re not claiming or receiving pension benefits, skip this question.',
        ),
      },
      studentNetworthInformation: {
        savings: {
          ...numberUI('Savings'),
          'ui:description': generateHelpText('Includes cash'),
        },
        securities: numberUI('Securities, bonds, etc.'),
        realEstate: {
          ...numberUI('Real estate'),
          'ui:description': generateHelpText(
            'Don’t include the value of your primary home',
          ),
        },
        otherAssets: numberUI('All other assets'),
        totalValue: numberUI('All other assets'),
      },
    },
  },
};
