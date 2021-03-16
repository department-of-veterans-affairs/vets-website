import React from 'react';
import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import {
  formatOptions,
  vehicleTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

const VehicleInfo = (
  <AdditionalInfo triggerText="What if I don’t know the estimated value of my car or other vehicle?">
    Include the amount of money you think you would get if you sold the vehicle
    in your local community. To get an idea of prices, you can check these
    places:
    <ul>
      <li>Online forums for your community</li>
      <li>Classified ads in local newspapers</li>
      <li>Websites that appraise the value of vehicles</li>
    </ul>
  </AdditionalInfo>
);

export const uiSchema = {
  'ui:title': 'Your cars or other vehicles',
  assets: {
    automobiles: {
      'ui:field': ItemLoop,
      'ui:description': 'Enter information for each vehicle separately below.',
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'vehicle',
      },
      items: {
        type: {
          'ui:title': 'Type of vehicle',
          'ui:field': Typeahead,
          'ui:options': {
            classNames:
              'input-size-7 vads-u-margin-top--3 vads-u-margin-bottom--3',
            getOptions: () => formatOptions(vehicleTypes),
          },
        },
        make: {
          'ui:title': 'Vehicle make',
          'ui:options': {
            widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
          },
        },
        model: {
          'ui:title': 'Vehicle model',
          'ui:options': {
            widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
          },
        },
        year: {
          'ui:title': 'Vehicle year',
          'ui:options': {
            widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
          },
        },
        resaleValue: _.merge(currencyUI('Estimated value'), {
          'ui:options': {
            widgetClassNames: 'input-size-5 vads-u-margin-bottom--3',
          },
        }),
      },
    },
  },
  'view:components': {
    'view:vehicleInfo': {
      'ui:description': VehicleInfo,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    assets: {
      type: 'object',
      properties: {
        automobiles: {
          type: 'array',
          items: {
            type: 'object',
            title: 'Vehicle',
            required: ['type', 'resaleValue'],
            properties: {
              type: {
                type: 'string',
              },
              make: {
                type: 'string',
              },
              model: {
                type: 'string',
              },
              year: {
                type: 'string',
              },
              resaleValue: {
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
        'view:vehicleInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
