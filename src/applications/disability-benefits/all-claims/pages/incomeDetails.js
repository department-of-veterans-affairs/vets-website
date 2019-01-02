import { isValidYear } from '../validations';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { incomeDescription } from '../content/incomeDetails';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': incomeDescription,
  unemployability: {
    mostIncome: currencyUI(
      'What was the most money you ever earned in one year?',
    ),
    yearEarned: {
      'ui:title': 'Year earned',
      'ui:validations': [isValidYear],
      'ui:errorMessages': {
        pattern: 'Please provide a valid year',
      },
    },
    job: {
      'ui:title': 'What was your job that year?',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        mostIncome: {
          type: 'number',
        },
        yearEarned: {
          type: 'string',
        },
        job: {
          type: 'string',
        },
      },
    },
  },
};
