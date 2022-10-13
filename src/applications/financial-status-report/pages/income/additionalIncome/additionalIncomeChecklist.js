import React from 'react';
import AdditionalIncomeCheckList from '../../../components/AdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncomeChecklist: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Select any additional income you receive:
      </span>
    ),
    'ui:widget': AdditionalIncomeCheckList,
    'ui:required': formData => {
      const {
        additionalIncome: { addlIncRecords = [] },
      } = formData;

      return !addlIncRecords.length;
    },
    'ui:errorMessages': {
      required: 'Please select at least one additional income.',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalIncomeChecklist: {
      type: 'boolean',
    },
  },
};
