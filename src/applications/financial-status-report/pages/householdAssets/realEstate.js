import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your real estate assets',
  hasRealEstate: {
    'ui:title': 'Do you currently own any real estate?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  realEstateRecords: {
    'ui:description': 'Enter each of your real estate assets below.',
    'ui:field': ItemLoop,
    'ui:options': {
      viewField: CardDetailsView,
      expandUnder: 'hasRealEstate',
      doNotScroll: true,
      showSave: true,
    },
    items: {
      'ui:title': 'Add real estate',
      realEstateType: {
        'ui:title': 'Type of real estate',
      },
      realEstateValue: {
        'ui:title': 'Estimated value',
      },
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
        properties: {
          realEstateType: {
            type: 'string',
          },
          realEstateValue: {
            type: 'string',
          },
        },
      },
    },
  },
};
