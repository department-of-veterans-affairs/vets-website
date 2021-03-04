import ItemLoop from '../../../components/ItemLoop';
import TableDetailsView from '../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  utilityTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  utilityRecords: {
    'ui:field': ItemLoop,
    'ui:description':
      'Enter each type of utility separately below. For each, enter the amount you paid last month.',
    'ui:options': {
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
      monthlyUtilityAmount: _.merge(currencyUI('Monthly payment amount'), {
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
    utilityRecords: {
      type: 'array',
      items: {
        type: 'object',
        title: 'Utility',
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
};
