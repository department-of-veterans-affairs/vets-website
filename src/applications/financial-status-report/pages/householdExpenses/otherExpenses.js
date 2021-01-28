import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../components/Typeahead';
import { formatOptions, expenseTypes } from '../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Other living expenses',
  otherExpenses: {
    hasExpenses: {
      'ui:title': 'Do you have any additional living expenses to include?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    expenseRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Enter other living expenses separately below. Other living expenses include cell phone, clothing, and transportation.',
      'ui:options': {
        expandUnder: 'hasExpenses',
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'expense',
      },
      items: {
        expenseType: {
          'ui:title': 'Type of expense',
          'ui:field': Typeahead,
          'ui:options': {
            classNames: 'input-size-3',
            getOptions: () => formatOptions(expenseTypes),
          },
          'ui:required': formData => formData.otherExpenses.hasExpenses,
        },
        expenseAmount: _.merge(currencyUI('Monthly payment amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-1',
          },
          'ui:required': formData => formData.otherExpenses.hasExpenses,
        }),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    otherExpenses: {
      type: 'object',
      properties: {
        hasExpenses: {
          type: 'boolean',
        },
        expenseRecords: {
          type: 'array',
          items: {
            type: 'object',
            required: ['expenseType', 'expenseAmount'],
            properties: {
              expenseType: {
                type: 'string',
              },
              expenseAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
