import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your trailers, campers, and boats',
  hasRecreationalVehicle: {
    'ui:title': 'Do you currently own any trailers, campers, or boats?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  recreationalVehicleRecords: {
    'ui:description':
      'Enter each of your trailers, campers, and boats separately below.',
    'ui:field': ItemLoop,
    'ui:options': {
      viewField: CardDetailsView,
      expandUnder: 'hasRecreationalVehicle',
      doNotScroll: true,
      showSave: true,
    },
    items: {
      'ui:title': 'Add trailer, camper, or boat',
      recreationalVehicleType: {
        'ui:title': 'Type of vehicle',
        'ui:required': () => true,
      },
      recreationalVehicleValue: {
        'ui:title': 'Estimated value',
        'ui:required': () => true,
      },
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
            type: 'string',
          },
        },
      },
    },
  },
};
