import React from 'react';
import SpouseGrossMonthlyIncomeInput from '../../../components/SpouseGrossMonthlyIncomeInput';

export const uiSchema = {
  grossMonthlyIncome: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        What’s your spouse’s gross <strong>monthly</strong> income at this job?
      </span>
    ),
    'ui:description': (
      <p className="formfield-subtitle">
        You’ll find this in your paycheck. It’s the amount of your pay before
        taxes and deductions.
      </p>
    ),
    'ui:widget': SpouseGrossMonthlyIncomeInput,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    grossMonthlyIncome: {
      type: 'number',
    },
  },
};
