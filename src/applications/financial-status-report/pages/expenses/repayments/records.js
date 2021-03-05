import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import {
  formatOptions,
  installmentTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your installment contracts and other debts',
  'ui:description':
    'Enter information for each installment contract or debt separately below.',
  repayments: {
    'ui:field': ItemLoop,
    'ui:options': {
      viewField: CardDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'installment or other debt',
    },
    items: {
      debtType: {
        'ui:title': 'Type of contract or debt',
        'ui:field': Typeahead,
        'ui:options': {
          classNames:
            'input-size-7 vads-u-margin-top--3 vads-u-margin-bottom--3',
          getOptions: () => formatOptions(installmentTypes),
        },
      },
      creditorName: {
        'ui:title': 'Name of creditor who holds the contract or debt',
        'ui:options': {
          widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
        },
      },
      originalDebtAmount: _.merge(
        currencyUI('Original contract or debt amount'),
        {
          'ui:options': {
            widgetClassNames: 'input-size-6 vads-u-margin-bottom--3',
          },
        },
      ),
      unpaidBalance: _.merge(currencyUI('Unpaid balance'), {
        'ui:options': {
          widgetClassNames: 'input-size-6 vads-u-margin-bottom--3',
        },
      }),
      monthlyPaymentAmount: _.merge(
        currencyUI('Minimum monthly payment amount'),
        {
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
        },
      ),
      debtDate: monthYearUI('Date debt began'),
      amountOverdue: _.merge(currencyUI('Amount overdue'), {
        'ui:options': {
          classNames: 'vads-u-margin-top--2',
          widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
        },
      }),
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    repayments: {
      type: 'array',
      items: {
        type: 'object',
        title: 'Repayment',
        required: [
          'debtType',
          'monthlyPaymentAmount',
          'debtDate',
          'amountOverdue',
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
};
