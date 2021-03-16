import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  realEstateTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your real estate assets',
  realEstateRecords: {
    'ui:field': ItemLoop,
    'ui:description': 'Enter each of your real estate assets below.',
    'ui:options': {
      viewField: CardDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'real estate',
    },
    items: {
      realEstateType: {
        'ui:title': 'Type of real estate',
        'ui:field': Typeahead,
        'ui:options': {
          classNames:
            'input-size-6 vads-u-margin-top--3 vads-u-margin-bottom--3',
          getOptions: () => formatOptions(realEstateTypes),
        },
      },
      realEstateAmount: _.merge(currencyUI('Estimated value'), {
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
    realEstateRecords: {
      type: 'array',
      items: {
        type: 'object',
        title: 'Real estate',
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
