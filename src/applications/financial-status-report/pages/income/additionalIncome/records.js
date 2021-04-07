import ItemLoop from '../../../components/ItemLoop';
import TableDetailsView from '../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  incomeTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncome: {
    additionalIncomeRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Tell us how much you get each month for each type of income.',
      'ui:options': {
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'income',
      },
      items: {
        'ui:options': {
          classNames: 'horizonal-field-container no-wrap',
        },
        name: {
          'ui:title': 'Type of income',
          'ui:field': Typeahead,
          'ui:options': {
            idPrefix: 'other_income',
            classNames: 'input-size-4',
            getOptions: () => formatOptions(incomeTypes),
          },
        },
        amount: _.merge(currencyUI('Monthly income amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-2',
          },
        }),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        additionalIncomeRecords: {
          type: 'array',
          items: {
            type: 'object',
            title: 'Additional income',
            required: ['name', 'amount'],
            properties: {
              name: {
                type: 'string',
              },
              amount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
