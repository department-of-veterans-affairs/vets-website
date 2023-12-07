import MonetaryInputList from '../../../components/monetary/MonetaryInputList';
import {
  validateCurrencyArray,
  validateMonetaryAssetCurrencyArrayLimits,
} from '../../../utils/validations';

export const uiSchema = {
  'ui:title': '',
  assets: {
    'ui:title': 'Your household assets',
    'ui:field': MonetaryInputList,
    'ui:options': {
      hideOnReview: true,
    },
    monetaryAssets: {
      'ui:title': 'monetaryAssetValues',
      'ui:validations': [
        validateCurrencyArray,
        validateMonetaryAssetCurrencyArrayLimits,
      ],
      items: {
        name: {
          'ui:title': 'Name of asset',
        },
        amount: {
          'ui:title': 'Asset amount',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    assets: {
      type: 'object',
      properties: {
        monetaryAssets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
