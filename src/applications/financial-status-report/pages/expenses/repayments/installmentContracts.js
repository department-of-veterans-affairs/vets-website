import React from 'react';
import YesNoField from 'platform/forms-system/src/js/web-component-fields/YesNoField';
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
    hasRepayments: {
      'ui:title':
        'Do you make monthly payments on any installments contracts or other debts you make monthly payments on?',
      'ui:webComponentField': YesNoField,
      'ui:required': () => true,
      'ui:errorMessages': {
        required:
          'Please provide your installment contracts or other debts information.',
      },
    },
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
        hasRepayments: {
          type: 'boolean',
        },
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
