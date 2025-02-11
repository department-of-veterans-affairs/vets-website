import React from 'react';
import DebtSelection from '../components/DebtSelection';

const debtSelection = {
  uiSchema: {
    'ui:title': () => (
      <>
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">What debt do you need help with?</h3>
        </legend>
      </>
    ),
    selectedDebts: {
      'ui:field': DebtSelection,
      'ui:options': {
        hideOnReview: true,
      },
      'ui:validations': [
        (errors, debts) => {
          if (!debts.length) {
            errors.addError('Please select at least one debt.');
          }
        },
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      selectedDebts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};

export default debtSelection;
