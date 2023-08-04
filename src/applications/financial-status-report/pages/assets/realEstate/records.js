import ItemLoop from '../../../components/shared/ItemLoop';
import CardDetailsView from '../../../components/shared/CardDetailsView';
import CustomReviewField from '../../../components/shared/CustomReviewField';
import { validateCurrency } from '../../../utils/validations';
import Typeahead from '../../../components/shared/Typeahead';
import {
  formatOptions,
  realEstateTypes,
} from '../../../constants/typeaheadOptions';

export const uiSchema = {
  'ui:title': 'Your real estate assets',
  'ui:description': 'Enter each of your real estate assets below.',
  realEstateRecords: {
    'ui:field': ItemLoop,
    'ui:options': {
      viewField: CardDetailsView,
      doNotScroll: true,
      itemName: 'real estate',
      keepInPageOnReview: true,
    },
    items: {
      realEstateType: {
        'ui:title': 'Type of real estate',
        'ui:field': Typeahead,
        'ui:reviewField': CustomReviewField,
        'ui:options': {
          idPrefix: 'realestate',
          classNames:
            'input-size-6 vads-u-margin-top--3 vads-u-margin-bottom--3',
          getOptions: () => formatOptions(realEstateTypes),
        },
        'ui:errorMessages': {
          required: 'Please enter the type of real estate owned.',
        },
      },
      realEstateAmount: {
        'ui:title': 'Estimated value',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
        },
        'ui:errorMessages': {
          required: 'Please enter the estimated value.',
        },
        'ui:validations': [validateCurrency],
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    realEstateRecords: {
      type: 'array',
      items: {
        type: 'object',
        required: ['realEstateType', 'realEstateAmount'],
        properties: {
          realEstateType: {
            type: 'string',
          },
          realEstateAmount: {
            type: 'string',
          },
        },
      },
    },
  },
};
