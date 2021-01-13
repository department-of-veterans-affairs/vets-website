import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your vehicles',
  hasVehicle: {
    'ui:title': 'Do you currently own any vehicles?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  vehicleRecords: {
    'ui:field': ItemLoop,
    'ui:description': 'Enter each of your vehicles separately below.',
    'ui:options': {
      viewField: CardDetailsView,
      expandUnder: 'hasVehicle',
      doNotScroll: true,
      showSave: true,
      itemName: 'a vehicle',
    },
    items: {
      vehicleType: {
        'ui:title': 'Type of vehicle',
        'ui:options': {
          widgetClassNames: 'input-size-7',
        },
        'ui:required': () => true,
      },
      vehicleMake: {
        'ui:title': 'Vehicle make',
        'ui:options': {
          widgetClassNames: 'input-size-7',
        },
      },
      vehicleModel: {
        'ui:title': 'Vehicle model',
        'ui:options': {
          widgetClassNames: 'input-size-7',
        },
      },
      vehicleYear: {
        'ui:title': 'Vehicle year',
        'ui:options': {
          widgetClassNames: 'input-size-4',
        },
      },
      vehicleAmount: _.merge(currencyUI('Estimated value'), {
        'ui:options': {
          widgetClassNames: 'input-size-5',
        },
        'ui:required': () => true,
      }),
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
        required: ['vehicleType', 'vehicleAmount'],
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
          vehicleAmount: {
            type: 'number',
          },
        },
      },
    },
  },
};
