import React from 'react';
import { deductionCodes } from '../../../debt-letters/const/deduction-codes';
import { validateCurrency } from '../../utils/validations';

export const uiSchema = {
  selectedDebts: {
    items: {
      'ui:title': formData => {
        const { deductionCode, benefitType } = formData.formData;
        const index = formData.formContext.pagePerItemIndex;
        return (
          <h3>
            Debt {index} of X: {deductionCodes[deductionCode] || benefitType}
          </h3>
        );
      },
      'ui:description': ({ formData }) =>
        formData.resolutionOption === 'compromise'
          ? 'How much can you afford to pay as a one-time payment?'
          : 'How much can you afford to pay monthly on this debt?',
      resolutionComment: {
        'ui:title': ' ',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-3',
        },
        'ui:errorMessages': {
          required: 'Please enter a dollar amount.',
        },
        'ui:validations': [validateCurrency],
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['resolutionComment'],
        properties: {
          resolutionComment: {
            type: 'string',
          },
        },
      },
    },
  },
};
