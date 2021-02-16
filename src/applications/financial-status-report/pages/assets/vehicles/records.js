import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  vehicleTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your vehicles',
  vehicleRecords: {
    'ui:field': ItemLoop,
    'ui:description': 'Enter each of your vehicles separately below.',
    'ui:options': {
      viewField: CardDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'a vehicle',
    },
    items: {
      vehicleType: {
        'ui:title': 'Type of vehicle',
        'ui:field': Typeahead,
        'ui:options': {
          classNames:
            'input-size-7 vads-u-margin-top--3 vads-u-margin-bottom--3',
          getOptions: () => formatOptions(vehicleTypes),
        },
      },
      vehicleMake: {
        'ui:title': 'Vehicle make',
        'ui:options': {
          widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
        },
      },
      vehicleModel: {
        'ui:title': 'Vehicle model',
        'ui:options': {
          widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
        },
      },
      vehicleYear: {
        'ui:title': 'Vehicle year',
        'ui:options': {
          widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
        },
      },
      vehicleAmount: _.merge(currencyUI('Estimated value'), {
        'ui:options': {
          widgetClassNames: 'input-size-5 vads-u-margin-bottom--3',
        },
      }),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
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
