import React from 'react';
import ItemLoop from '../../../components/ItemLoop';
import TableDetailsView from '../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import { formatOptions, assetTypes } from '../../../constants/typeaheadOptions';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import _ from 'lodash/fp';

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
  'ui:title': 'Your other assets',
  assets: {
    otherAssets: {
      'ui:field': ItemLoop,
      'ui:description':
        'Enter each type of asset separately below. For each, include an estimated value.',
      'ui:options': {
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'asset',
      },
      items: {
        'ui:options': {
          classNames: 'horizonal-field-container no-wrap',
        },
        name: {
          'ui:title': 'Type of asset',
          'ui:field': Typeahead,
          'ui:options': {
            classNames: 'input-size-3',
            getOptions: () => formatOptions(assetTypes),
          },
        },
        amount: _.merge(currencyUI('Estimated value'), {
          'ui:options': {
            widgetClassNames: 'input-size-1',
          },
        }),
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
    assets: {
      type: 'object',
      properties: {
        otherAssets: {
          type: 'array',
          items: {
            type: 'object',
            title: 'Record',
            required: ['name', 'amount'],
            properties: {
              name: {
                type: 'string',
              },
              amount: {
                type: 'number',
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
