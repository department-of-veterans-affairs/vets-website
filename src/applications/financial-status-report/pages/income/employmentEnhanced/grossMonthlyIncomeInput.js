import React from 'react';
import GrossMonthlyIncomeInput from '../../../components/GrossMonthlyIncomeInput';
import { SelectedJobEmployerTitle } from '../../../components/SelectedJobEmployerTitle';

export const uiSchema = {
  'ui:title': SelectedJobEmployerTitle,
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
    'ui:required': formData => {
      const {
        additionalIncome: { addlIncRecords = [] },
      } = formData;

      return !addlIncRecords.length;
    },
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
