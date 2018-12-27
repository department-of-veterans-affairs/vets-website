import React from 'react';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

import { isValidYear } from '../validations';

import currencyUI from 'us-forms-system/lib/js/definitions/currency';

const incomeDescription = (
  <div>
    <h3>Income details</h3>
    <p>
      Now we‘re going to ask you about your income history. Please provide your
      gross income, which is all the money you earned through employment for the
      year before taxes. You should include military pay but you don‘t need to
      include Social Security benefits, VA benefits, stock dividends, or
      investment income. If you can‘t remember the exact dollar amount, you can
      give an estimated amount.
    </p>
  </div>
);

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
