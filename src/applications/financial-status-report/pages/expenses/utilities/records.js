import ItemLoop from '../../../components/shared/ItemLoop';
import TableDetailsView from '../../../components/shared/TableDetailsView';
import CustomReviewField from '../../../components/shared/CustomReviewField';
import { validateCurrency } from '../../../utils/validations';
import Typeahead from '../../../components/shared/Typeahead';
import {
  formatOptions,
  utilityTypes,
} from '../../../constants/typeaheadOptions';

export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  'ui:description':
    'Enter each type of utility separately below. For each, enter the amount you paid last month.',
  utilityRecords: {
    'ui:field': ItemLoop,
    'ui:options': {
      viewType: 'table',
      viewField: TableDetailsView,
      doNotScroll: true,
      itemName: 'utility',
      keepInPageOnReview: true,
    },
    items: {
      'ui:options': {
        classNames: 'horizontal-field-container no-wrap',
      },
      utilityType: {
        'ui:title': 'Type of utility',
        'ui:field': Typeahead,
        'ui:reviewField': CustomReviewField,
        'ui:options': {
          idPrefix: 'utilities',
          widgetClassNames: 'input-size-3',
          getOptions: () => formatOptions(utilityTypes),
        },
        'ui:errorMessages': {
          required: 'Please enter a type of utility.',
        },
      },
      monthlyUtilityAmount: {
        'ui:title': 'Monthly payment amount',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-1',
        },
        'ui:errorMessages': {
          required: 'Please enter the amount you pay monthly.',
        },
        'ui:validations': [validateCurrency],
      },
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
        required: ['utilityType', 'monthlyUtilityAmount'],
        properties: {
          utilityType: {
            type: 'string',
          },
          monthlyUtilityAmount: {
            type: 'string',
          },
        },
      },
    },
  },
};
