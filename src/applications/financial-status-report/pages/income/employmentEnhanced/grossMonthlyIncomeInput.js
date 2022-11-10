import React from 'react';
import GrossMonthlyIncomeInput from '../../../components/GrossMonthlyIncomeInput';

export const uiSchema = {
  grossMonthlyIncomeInput: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        What’s your gross monthly income at this job?
      </span>
    ),
    'ui:description': (
      <p className="formfield-subtitle">
        You’ll find this in your paycheck. It’s the amount of your pay before
        taxes and deductions.
      </p>
    ),
    'ui:widget': GrossMonthlyIncomeInput,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    grossMonthlyIncomeInput: {
      type: 'boolean',
    },
  },
};
