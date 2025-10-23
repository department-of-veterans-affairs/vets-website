import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ContractsExplainer from '../../../components/householdExpenses/ContractsExplainer';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">
          Your installment contracts and other debts
        </h3>
      </legend>
    </>
  ),
  questions: {
    hasRepayments: yesNoUI({
      title:
        'Do you make monthly payments on any installment contracts or other debts?',
      enableAnalytics: true,
      uswds: true,
      required: () => true,
      errorMessages: {
        required:
          'Please provide your installment contracts or other debts information.',
      },
    }),
  },
  'view:components': {
    'view:contractsAdditionalInfo': {
      'ui:description': ContractsExplainer,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasRepayments: yesNoSchema,
      },
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:contractsAdditionalInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
