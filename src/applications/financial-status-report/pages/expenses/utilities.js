import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../components/Typeahead';
import { formatOptions, utilityTypes } from '../../constants/typeaheadOptions';
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
      'ui:options': {
        classNames: 'no-wrap',
      },
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
        'ui:options': {
          classNames: 'horizonal-field-container no-wrap',
        },
        utilityType: {
          'ui:title': 'Type of utility',
          'ui:field': Typeahead,
          'ui:options': {
            classNames: 'input-size-3',
            getOptions: () => formatOptions(utilityTypes),
          },
        },
        monthlyUtilityAmount: _.merge(currencyUI('Monthly amount'), {
          'ui:options': {
            widgetClassNames: 'input-size-1',
          },
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
