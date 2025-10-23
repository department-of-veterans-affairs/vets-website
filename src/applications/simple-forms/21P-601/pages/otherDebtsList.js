import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Other debts the deceased owed'),
    'ui:description':
      'List any other debts the deceased owed at the time of death (not related to medical care or burial).',
    otherDebts: {
      'ui:title': 'Other debts',
      'ui:options': {
        itemName: 'Debt',
        viewField: ({ formData }) => {
          const type = formData.debtType || 'Unknown';
          const amount = formData.debtAmount
            ? `$${parseFloat(formData.debtAmount).toFixed(2)}`
            : '$0.00';
          return (
            <div>
              <strong>{type}</strong>
              <br />
              Amount: {amount}
            </div>
          );
        },
        keepInPageOnReview: true,
        confirmRemove: true,
        useDlWrap: true,
        showSave: true,
      },
      items: {
        debtType: textUI({
          title: 'Type of debt',
          hint: 'For example: credit card, personal loan, car loan',
        }),
        debtAmount: currencyUI({
          title: 'Amount owed',
          required: () => true,
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherDebts: {
        type: 'array',
        minItems: 1,
        maxItems: 4,
        items: {
          type: 'object',
          required: ['debtType', 'debtAmount'],
          properties: {
            debtType: textSchema,
            debtAmount: currencySchema,
          },
        },
      },
    },
  },
};
