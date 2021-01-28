import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../components/Typeahead';
import { formatOptions, incomeTypes } from '../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncome: {
    hasAdditionalIncome: {
      'ui:title': 'Do you currently receive any additional income?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    additionalIncomeRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Please provide information about additional income you currently receive.',
      'ui:options': {
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        expandUnder: 'hasAdditionalIncome',
        itemName: 'income',
      },
      items: {
        incomeType: {
          'ui:title': 'Type of income',
          'ui:field': Typeahead,
          'ui:options': {
            classNames: 'input-size-3',
            getOptions: () => formatOptions(incomeTypes),
          },
          'ui:required': formData =>
            formData.additionalIncome.hasAdditionalIncome,
        },
        monthlyAmount: _.merge(currencyUI('Monthly income amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-2',
          },
          'ui:required': formData =>
            formData.additionalIncome.hasAdditionalIncome,
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
        hasAdditionalIncome: {
          type: 'boolean',
        },
        additionalIncomeRecords: {
          type: 'array',
          items: {
            type: 'object',
            required: ['incomeType', 'monthlyAmount'],
            properties: {
              incomeType: {
                type: 'string',
              },
              monthlyAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
