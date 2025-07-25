import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { isValidYear } from '../validations';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { incomeDescription } from '../content/incomeDetails';

const {
  yearOfMostEarnings,
  occupationDuringMostEarnings,
} = fullSchema.properties.form8940.properties.unemployability.properties;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': incomeDescription,
  unemployability: {
    mostEarningsInAYear: currencyUI(
      'What was the most money you ever earned in one year?',
    ),
    yearOfMostEarnings: {
      'ui:title': 'Year earned',
      'ui:validations': [isValidYear],
      'ui:errorMessages': {
        pattern: 'Please provide a valid year',
      },
    },
    occupationDuringMostEarnings: {
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
        mostEarningsInAYear: {
          type: 'number',
        },
        yearOfMostEarnings,
        occupationDuringMostEarnings,
      },
    },
  },
};
