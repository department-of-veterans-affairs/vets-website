import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

const repaymentOptions = [
  'Yes, I have installment contracts or other debts.',
  "No, I don't have installment contracts or other debts.",
];

export const uiSchema = {
  'ui:title': 'Your installment contracts and other debts',
  repayments: {
    hasRepayments: {
      'ui:title':
        'Do you pay monthly for any installment contracts or other debts, such as recurring payments for purchases or loan repayment plans?',
      'ui:required': () => true,
      'ui:widget': 'radio',
    },
    repaymentRecords: {
      'ui:field': ItemLoop,
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
        hideTitle: true,
        itemName: 'Add installment or other debt',
        expandUnder: 'hasRepayments',
        expandUnderCondition:
          'Yes, I have installment contracts or other debts.',
      },
      items: {
        debtPurpose: {
          'ui:title': 'Purpose of debt',
          'ui:required': () => true,
          'ui:options': {
            widgetClassNames: 'input-size-7',
          },
        },
        creditorName: {
          'ui:title': 'Name of creditor',
          'ui:options': {
            widgetClassNames: 'input-size-7',
          },
        },
        originalDebtAmount: _.merge(currencyUI('Original debt amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-4',
          },
        }),
        unpaidBalance: _.merge(currencyUI('Unpaid balance'), {
          'ui:options': {
            widgetClassNames: 'input-size-4',
          },
        }),
        monthlyPaymentAmount: _.merge(currencyUI('Monthly payment amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-4',
          },
        }),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    repayments: {
      type: 'object',
      properties: {
        hasRepayments: {
          type: 'string',
          enum: repaymentOptions,
        },
        repaymentRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              debtPurpose: {
                type: 'string',
              },
              creditorName: {
                type: 'string',
              },
              originalDebtAmount: {
                type: 'number',
              },
              unpaidBalance: {
                type: 'number',
              },
              monthlyPaymentAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
