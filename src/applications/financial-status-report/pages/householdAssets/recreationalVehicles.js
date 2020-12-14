import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Your trailers, campers, and boats',
  hasRecreationalVehicle: {
    'ui:title': 'Do you currently own any trailers, campers, or boats?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  recreationalVehicleRecords: {
    'ui:field': ItemLoop,
    'ui:description':
      'Enter each of your trailers, campers, and boats separately below.',
    'ui:options': {
      viewField: CardDetailsView,
      expandUnder: 'hasRecreationalVehicle',
      doNotScroll: true,
      showSave: true,
      itemName: 'Add trailer, camper, or boat',
    },
    items: {
      recreationalVehicleType: {
        'ui:title': 'Type of vehicle',
        'ui:required': () => true,
      },
      recreationalVehicleValue: currencyUI('Estimated value'),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    hasRecreationalVehicle: {
      type: 'boolean',
    },
    recreationalVehicleRecords: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          recreationalVehicleType: {
            type: 'string',
          },
          recreationalVehicleValue: {
            type: 'number',
          },
        },
      },
    },
  },
};
