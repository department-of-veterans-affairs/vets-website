import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import ItemLoop from '../../../components/ItemLoop';
import TableDetailsView from '../../../components/TableDetailsView';
import CustomReviewField from '../../../components/CustomReviewField';
import { validateCurrency } from '../../../utils/validations';
import Typeahead from '../../../components/Typeahead';
import { formatOptions, assetTypes } from '../../../constants/typeaheadOptions';

const AssetInfo = (
  <AdditionalInfo triggerText="What if I don’t know the estimated value of an asset?">
    Don’t worry. We just want to get an idea of items of value you may own so we
    can better understand your financial situation. Include the amount of money
    you think you would get if you sold the asset. To get an idea of prices, you
    can check these places:
    <ul>
      <li>Online forums for your community</li>
      <li>Classified ads in local newspapers</li>
      <li>
        Websites or forums that appraise the value of items like jewelry and art
      </li>
    </ul>
  </AdditionalInfo>
);

export const uiSchema = {
  'view:otherAssets': {
    'ui:title': 'Your other assets',
    'ui:description':
      'Enter each type of asset separately below. For each, include an estimated value.',
  },
  assets: {
    otherAssets: {
      'ui:field': ItemLoop,
      'ui:options': {
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'asset',
        keepInPageOnReview: true,
      },
      items: {
        'ui:options': {
          classNames: 'horizontal-field-container no-wrap',
        },
        name: {
          'ui:title': 'Type of asset',
          'ui:field': Typeahead,
          'ui:reviewField': CustomReviewField,
          'ui:options': {
            idPrefix: 'other_assets',
            widgetClassNames: 'input-size-3',
            getOptions: () => formatOptions(assetTypes),
          },
          'ui:errorMessages': {
            required: 'Please enter the type of asset.',
          },
        },
        amount: {
          'ui:title': 'Estimated value',
          'ui:options': {
            classNames: 'schemaform-currency-input',
            widgetClassNames: 'input-size-1',
          },
          'ui:errorMessages': {
            required: 'Please enter the estimated value.',
          },
          'ui:validations': [validateCurrency],
        },
      },
    },
  },
  'view:components': {
    'view:assetInfo': {
      'ui:description': AssetInfo,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    'view:otherAssets': {
      type: 'object',
      properties: {},
    },
    assets: {
      type: 'object',
      properties: {
        otherAssets: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'amount'],
            properties: {
              name: {
                type: 'string',
              },
              amount: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:assetInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
