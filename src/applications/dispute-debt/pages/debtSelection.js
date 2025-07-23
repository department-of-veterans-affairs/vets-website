import React from 'react';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import DebtSelection from '../components/DebtSelection';

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
    'ui:confirmationField': ({ formData }) => {
      const { selectedDebts } = formData;

      return selectedDebts.map(debt => (
        <div key={debt.selectedDebtId}>
          <h4>{debt.label}</h4>
          {reviewEntry(
            null,
            `dispute-reason-${debt.selectedDebtId}`,
            {},
            'Dispute reason',
            debt.disputeReason,
          )}
          {reviewEntry(
            null,
            `dispute-support-statement-${debt.selectedDebtId}`,
            {},
            'Dispute statement',
            debt.supportStatement,
          )}
        </div>
      ));
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
