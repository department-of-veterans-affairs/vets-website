import ItemLoop from '../../../components/ItemLoop';
import TableDetailsView from '../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  expenseTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Other living expenses',
  otherExpenses: {
    'ui:field': ItemLoop,
    'ui:description':
      'Enter other living expenses separately below. Other living expenses include cell phone, clothing, and transportation.',
    'ui:options': {
      viewType: 'table',
      viewField: TableDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'expense',
    },
    items: {
      'ui:options': {
        classNames: 'horizonal-field-container no-wrap',
      },
      expenseType: {
        'ui:title': 'Type of expense',
        'ui:field': Typeahead,
        'ui:options': {
          classNames: 'input-size-3',
          getOptions: () => formatOptions(expenseTypes),
        },
      },
      expenseAmount: _.merge(currencyUI('Monthly amount'), {
        'ui:options': {
          widgetClassNames: 'input-size-1',
        },
      }),
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    otherExpenses: {
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
};
