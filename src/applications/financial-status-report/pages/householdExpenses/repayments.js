import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../components/Typeahead';
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
          'ui:required': () => true,
        },
        creditorName: {
          'ui:title': 'Name of creditor',
          'ui:options': {
            widgetClassNames: 'input-size-7',
          },
        },
        originalDebtAmount: _.merge(currencyUI('Original debt amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-5',
          },
        }),
        unpaidBalance: _.merge(currencyUI('Unpaid balance'), {
          'ui:options': {
            widgetClassNames: 'input-size-5',
          },
        }),
        monthlyPaymentAmount: _.merge(currencyUI('Monthly payment amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-5',
          },
          'ui:required': () => true,
        }),
        debtWithinThreeMonths: {
          'ui:title':
            'Did this installment or debt happen within the past 3 months?',
          'ui:widget': 'radio',
          'ui:required': () => true,
        },
        pastDueDebt: {
          'ui:title': 'Are you past due on this installment or debt?',
          'ui:widget': 'radio',
          'ui:required': () => true,
        },
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
            required: [
              'debtType',
              'monthlyPaymentAmount',
              'debtWithinThreeMonths',
              'pastDueDebt',
            ],
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
              debtWithinThreeMonths: {
                type: 'string',
                enum: [
                  'Yes, it’s less than 3 months old.',
                  'No, it’s older than 3 months old.',
                ],
              },
              pastDueDebt: {
                type: 'string',
                enum: [
                  'Yes, I have payments past due.',
                  'No, I don’t have payments past due.',
                ],
              },
            },
          },
        },
      },
    },
  },
};
