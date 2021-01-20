import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../components/Typeahead';
import {
  formatOptions,
  recreationalVehicleTypes,
} from '../../constants/typeaheadOptions';
import _ from 'lodash/fp';

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
        'ui:field': Typeahead,
        'ui:options': {
          classNames: 'input-size-6',
          getOptions: () => formatOptions(recreationalVehicleTypes),
        },
        'ui:required': () => true,
      },
      recreationalVehicleAmount: _.merge(currencyUI('Estimated value'), {
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
    hasRecreationalVehicle: {
      type: 'boolean',
    },
    recreationalVehicleRecords: {
      type: 'array',
      items: {
        type: 'object',
        required: ['recreationalVehicleType', 'recreationalVehicleAmount'],
        properties: {
          recreationalVehicleType: {
            type: 'string',
          },
          recreationalVehicleAmount: {
            type: 'number',
          },
        },
      },
    },
  },
};
