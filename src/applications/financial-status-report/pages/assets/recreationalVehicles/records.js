import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  recreationalVehicleTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your trailers, campers, and boats',
  recreationalVehicleRecords: {
    'ui:field': ItemLoop,
    'ui:description':
      'Enter each of your trailers, campers, and boats separately below.',
    'ui:options': {
      viewField: CardDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'trailer, camper, or boat',
    },
    items: {
      recreationalVehicleType: {
        'ui:title': 'Type of vehicle',
        'ui:field': Typeahead,
        'ui:options': {
          classNames:
            'input-size-6 vads-u-margin-top--3 vads-u-margin-bottom--3',
          getOptions: () => formatOptions(recreationalVehicleTypes),
        },
      },
      recreationalVehicleAmount: _.merge(currencyUI('Estimated value'), {
        'ui:options': {
          widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
        },
      }),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
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
