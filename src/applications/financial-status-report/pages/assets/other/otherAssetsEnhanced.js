import OtherAssetsInputList from '../../../components/otherAssets/OtherAssetsInputList';
import {
  validateCurrencyArray,
  validateOtherAssetsArrayLimits,
} from '../../../utils/validations';

export const otherAssetsValues = {
  uiSchema: {
    'ui:title': '',
    assets: {
      'ui:field': OtherAssetsInputList,
      'ui:options': {
        hideOnReview: true,
      },
      otherAssets: {
        'ui:title': 'otherAssetsValues',
        'ui:validations': [
          validateCurrencyArray,
          validateOtherAssetsArrayLimits,
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
  },
  schema: {
    type: 'object',
    properties: {
      assets: {
        type: 'object',
        properties: {
          otherAssets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
