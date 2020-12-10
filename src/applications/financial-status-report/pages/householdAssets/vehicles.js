import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your vehicles',
  hasVehicle: {
    'ui:title': 'Do you currently own any vehicles?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  vehicleRecords: {
    'ui:description': 'Enter each of your vehicles separately below.',
    'ui:field': ItemLoop,
    'ui:options': {
      viewField: CardDetailsView,
      expandUnder: 'hasVehicle',
      doNotScroll: true,
      showSave: true,
    },
    items: {
      'ui:title': 'Add vehicle',
      vehicleType: {
        'ui:title': 'Type of vehicle',
        'ui:required': () => true,
      },
      vehicleMake: {
        'ui:title': 'Vehicle make',
      },
      vehicleModel: {
        'ui:title': 'Vehicle model',
      },
      vehicleYear: {
        'ui:title': 'Vehicle year',
      },
      vehicleValue: {
        'ui:title': 'Estimated value',
        'ui:required': () => true,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    hasVehicle: {
      type: 'boolean',
    },
    vehicleRecords: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          vehicleType: {
            type: 'string',
          },
          vehicleMake: {
            type: 'string',
          },
          vehicleModel: {
            type: 'string',
          },
          vehicleYear: {
            type: 'string',
          },
          vehicleValue: {
            type: 'string',
          },
        },
      },
    },
  },
};
