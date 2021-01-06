import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseAdditionalIncome: {
    'ui:title': 'Does your spouse currently receive any additional income?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  hasAdditionalIncome: {
    'ui:options': {
      expandUnder: 'spouseAdditionalIncome',
    },
    spouseAdditionalIncome: {
      'ui:description':
        'Please provide information about additional income your spouse currently receives.',
      'ui:field': ItemLoop,
      'ui:options': {
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'Add income',
      },
      items: {
        incomeType: {
          'ui:title': 'Type of income',
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
          'ui:required': formData => formData.spouseAdditionalIncome,
        },
        incomeAmount: _.merge(currencyUI('Monthly income amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-1',
          },
          'ui:required': formData => formData.spouseAdditionalIncome,
        }),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    spouseAdditionalIncome: {
      type: 'boolean',
    },
    hasAdditionalIncome: {
      type: 'object',
      properties: {
        spouseAdditionalIncome: {
          type: 'array',
          items: {
            type: 'object',
            required: ['incomeType', 'incomeAmount'],
            properties: {
              incomeType: {
                type: 'string',
              },
              incomeAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
