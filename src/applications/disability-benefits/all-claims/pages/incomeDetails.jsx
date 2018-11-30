import React from 'react';
import { PtsdNameTitle } from '../content/ptsdClassification';

import { isValidYear } from '../validations';

const incomeDescription = (
  <div>
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
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': incomeDescription,
  mostIncome: {
    'ui:title': 'What was the most money you ever earned in one year?',
    'ui:errorMessages': {
      pattern: 'Sorry, you must enter all digits',
    },
  },
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
};

export const schema = {
  type: 'object',
  properties: {
    mostIncome: {
      type: 'string',
      pattern: '^[0-9]*$',
    },
    yearEarned: {
      type: 'string',
    },
    job: {
      type: 'string',
    },
  },
};
