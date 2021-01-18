import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

const utilityOptions = [
  'Yes, I pay utility bills.',
  "No, I don't pay utility bills.",
];

export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  utilities: {
    hasUtilities: {
      'ui:title':
        'Do you pay any utility bills, such as electricity, water, or gas?',
      'ui:required': () => true,
      'ui:widget': 'radio',
    },
    utilityRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Enter each type of monthly utility bill separately below.',
      'ui:options': {
        expandUnder: 'hasUtilities',
        expandUnderCondition: 'Yes, I pay utility bills.',
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'utility',
      },
      items: {
        utilityType: {
          'ui:title': 'Type of utility',
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
          'ui:required': formData => formData.utilities.hasUtilities,
        },
        monthlyUtilityAmount: _.merge(currencyUI('Monthly payment amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-1',
          },
          'ui:required': formData => formData.utilities.hasUtilities,
        }),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    utilities: {
      type: 'object',
      properties: {
        hasUtilities: {
          type: 'string',
          enum: utilityOptions,
        },
        utilityRecords: {
          type: 'array',
          items: {
            type: 'object',
            required: ['utilityType', 'monthlyUtilityAmount'],
            properties: {
              utilityType: {
                type: 'string',
              },
              monthlyUtilityAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
