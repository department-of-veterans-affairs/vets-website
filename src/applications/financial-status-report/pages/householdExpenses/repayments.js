import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../components/Typeahead';
import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import {
  formatOptions,
  installmentTypes,
} from '../../constants/typeaheadOptions';
import _ from 'lodash/fp';

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
        itemName: 'installment or other debt',
        expandUnder: 'hasRepayments',
        expandUnderCondition:
          'Yes, I have installment contracts or other debts.',
      },
      items: {
        debtType: {
          'ui:title': 'Purpose of debt',
          'ui:field': Typeahead,
          'ui:options': {
            classNames: 'input-size-7',
            getOptions: () => formatOptions(installmentTypes),
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
            widgetClassNames: 'input-size-6',
          },
        }),
        unpaidBalance: _.merge(currencyUI('Unpaid balance'), {
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
        }),
        monthlyPaymentAmount: _.merge(currencyUI('Monthly payment amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
        }),
        debtDate: monthYearUI('Date debt began'),
        amountOverdue: _.merge(currencyUI('Amount overdue'), {
          'ui:options': {
            widgetClassNames: 'input-size-6',
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
          enum: [
            'Yes, I have installment contracts or other debts.',
            "No, I don't have installment contracts or other debts.",
          ],
        },
        repaymentRecords: {
          type: 'array',
          items: {
            type: 'object',
            required: ['debtType', 'monthlyPaymentAmount', 'debtDate'],
            properties: {
              debtType: {
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
              debtDate: {
                type: 'string',
              },
              amountOverdue: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
