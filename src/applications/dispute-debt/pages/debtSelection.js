import React from 'react';
import DebtSelection from '../components/DebtSelection';
import ConfirmationDisputeInformation from '../components/confirmationFields/ConfirmationDisputeInformation';

const debtSelection = {
  uiSchema: {
    'ui:title': () => (
      <>
        <h3 className="vads-u-margin--0 vads-u-font-size--h2">
          Which debt are you disputing?
        </h3>
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
    'ui:confirmationField': ConfirmationDisputeInformation,
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
