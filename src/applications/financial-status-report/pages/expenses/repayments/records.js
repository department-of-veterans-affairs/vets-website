import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import ItemLoop from '../../../components/shared/ItemLoop';
import CardDetailsView from '../../../components/shared/CardDetailsView';
import CustomReviewField from '../../../components/shared/CustomReviewField';
import { validateCurrency } from '../../../utils/validations';
import Typeahead from '../../../components/shared/Typeahead';
import {
  formatOptions,
  installmentTypes,
} from '../../../constants/typeaheadOptions';

export const uiSchema = {
  'ui:title': 'Your installment contracts and other debts',
  'ui:description':
    'Enter information for each installment contract or debt separately below.',
  installmentContracts: {
    'ui:field': ItemLoop,
    'ui:options': {
      viewField: CardDetailsView,
      doNotScroll: true,
      itemName: 'installment or other debt',
      keepInPageOnReview: true,
    },
    items: {
      purpose: {
        'ui:title': 'Type of contract or debt',
        'ui:field': Typeahead,
        'ui:reviewField': CustomReviewField,
        'ui:options': {
          idPrefix: 'repayments',
          classNames:
            'input-size-7 vads-u-margin-top--3 vads-u-margin-bottom--3',
          getOptions: () => formatOptions(installmentTypes),
        },
        'ui:errorMessages': {
          required: 'Please provide the purpose of debt.',
        },
      },
      creditorName: {
        'ui:title': 'Name of creditor who holds the contract or debt',
        'ui:options': {
          widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
        },
      },
      originalAmount: {
        'ui:title': 'Original contract or debt amount',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-6 vads-u-margin-bottom--3',
        },
        'ui:validations': [validateCurrency],
      },
      unpaidBalance: {
        'ui:title': 'Unpaid balance',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-6 vads-u-margin-bottom--3',
        },
        'ui:errorMessages': {
          required: 'Please enter the unpaid balance.',
        },
        'ui:validations': [validateCurrency],
      },
      amountDueMonthly: {
        'ui:title': 'Minimum monthly payment amount',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-6',
        },
        'ui:errorMessages': {
          required: 'Please enter the monthly payment amount owed.',
        },
        'ui:validations': [validateCurrency],
      },
      dateStarted: monthYearUI('Date debt began'),
      amountPastDue: {
        'ui:title': 'Amount overdue',
        'ui:options': {
          classNames: 'schemaform-currency-input vads-u-margin-top--2',
          widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
        },
        'ui:errorMessages': {
          required: 'Please enter the amount overdue.',
        },
        'ui:validations': [validateCurrency],
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    installmentContracts: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'purpose',
          'unpaidBalance',
          'amountDueMonthly',
          'dateStarted',
          'amountPastDue',
        ],
        properties: {
          purpose: {
            type: 'string',
          },
          creditorName: {
            type: 'string',
            default: '',
          },
          originalAmount: {
            type: 'string',
          },
          unpaidBalance: {
            type: 'string',
          },
          amountDueMonthly: {
            type: 'string',
          },
          dateStarted: {
            type: 'string',
          },
          amountPastDue: {
            type: 'string',
          },
        },
      },
    },
  },
};
