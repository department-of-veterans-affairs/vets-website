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
    ...titleUI('Expenses you paid'),
    'ui:description': (
      <>
        <p>
          List each expense you paid for the deceased's last illness and burial.
        </p>
        <va-alert status="info" uswds>
          <p>
            <strong>Note:</strong> You can only request reimbursement for
            expenses you've already paid. If you have unpaid bills, you'll need
            to use the paper form.
          </p>
        </va-alert>
      </>
    ),
    expenses: {
      'ui:title': 'Expenses',
      'ui:options': {
        itemName: 'Expense',
        viewField: ({ formData }) => {
          const provider = formData.provider || 'Unknown';
          const type = formData.expenseType || 'Not specified';
          const amount = formData.amount
            ? `$${parseFloat(formData.amount).toFixed(2)}`
            : '$0.00';
          return (
            <div>
              <strong>{provider}</strong>
              <br />
              {type} - {amount}
            </div>
          );
        },
        keepInPageOnReview: true,
        confirmRemove: true,
        useDlWrap: true,
        customTitle: ' ', // prevent <dl> around the schemaform-field-container (fixes a11y dl error)
        showSave: true,
      },
      items: {
        provider: textUI('Provider or funeral home name'),
        expenseType: textUI({
          title: 'Type of expense',
          hint: 'For example: doctor, hospital, burial, funeral service',
        }),
        amount: currencyUI({
          title: 'Amount you paid',
          required: () => true,
        }),
        paidBy: textUI({
          title: 'Who paid this expense? (optional)',
          hint:
            'For example: yourself, the estate, another family member. Leave blank if you paid.',
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      expenses: {
        type: 'array',
        minItems: 1,
        maxItems: 4,
        items: {
          type: 'object',
          required: ['provider', 'expenseType', 'amount'],
          properties: {
            provider: textSchema,
            expenseType: textSchema,
            amount: currencySchema,
            paidBy: textSchema,
          },
        },
      },
    },
  },
};
