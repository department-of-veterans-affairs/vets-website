import React from 'react';
import OtherAssetsChecklist from '../../../components/otherAssets/OtherAssetsChecklist';
import OtherAssetsInputList from '../../../components/otherAssets/OtherAssetsInputList';
import { validateCurrencyArray } from '../../../utils/validations';

export const otherAssetsChecklist = {
  uiSchema: {
    'ui:title': 'Your other assets',
    otherAssetsEnhanced: {
      'ui:title': (
        <span className="vads-u-font-size--h4 vads-u-font-family--sans">
          Select any of these financial assets you have:
        </span>
      ),
      'ui:widget': OtherAssetsChecklist,
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherAssetsEnhanced: {
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
      otherAssetsEnhanced: {
        'ui:title': 'otherAssetsEnhancedValues',
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
          otherAssetsEnhanced: {
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
