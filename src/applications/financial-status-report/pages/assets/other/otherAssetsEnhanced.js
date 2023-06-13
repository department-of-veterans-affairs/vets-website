import OtherAssetsChecklist from '../../../components/otherAssets/OtherAssetsChecklist';
import OtherAssetsInputList from '../../../components/otherAssets/OtherAssetsInputList';
import { validateCurrencyArray } from '../../../utils/validations';

export const otherAssetsChecklist = {
  uiSchema: {
    'ui:title': '',
    'ui:field': OtherAssetsChecklist,
    'ui:options': {
      hideOnReview: true,
    },
    otherAssets: {
      'ui:title': 'otherAssetsChecklist',
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherAssets: {
        type: 'boolean',
      },
    },
  },
};

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
        'ui:validations': [validateCurrencyArray],
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
