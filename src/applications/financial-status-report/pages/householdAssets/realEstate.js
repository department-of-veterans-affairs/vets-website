import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your real estate assets',
  hasRealEstate: {
    'ui:title': 'Do you currently own any real estate?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  realEstateRecords: {
    'ui:field': ItemLoop,
    'ui:description': 'Enter each of your real estate assets below.',
    'ui:options': {
      viewField: CardDetailsView,
      expandUnder: 'hasRealEstate',
      doNotScroll: true,
      showSave: true,
      itemName: 'Add real estate',
    },
    items: {
      realEstateType: {
        'ui:title': 'Type of real estate',
        'ui:options': {
          widgetClassNames: 'input-size-6',
        },
        'ui:required': () => true,
      },
      realEstateAmount: _.merge(currencyUI('Estimated value'), {
        'ui:options': {
          widgetClassNames: 'input-size-4',
        },
        'ui:required': () => true,
      }),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    hasRealEstate: {
      type: 'boolean',
    },
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
            type: 'number',
          },
        },
      },
    },
  },
};
