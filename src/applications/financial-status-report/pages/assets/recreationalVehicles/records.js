import React from 'react';
import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import {
  formatOptions,
  recreationalVehicleTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

const RecVehicleInfo = (
  <AdditionalInfo triggerText="What if I don’t know the estimated value of my trailer, camper, or boat?">
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
  'ui:title': 'Your trailers, campers, and boats',
  assets: {
    trailersBoatsCampers: {
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
  },
  'view:components': {
    'view:recVehicleInfo': {
      'ui:description': RecVehicleInfo,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    assets: {
      type: 'object',
      properties: {
        trailersBoatsCampers: {
          type: 'array',
          items: {
            type: 'object',
            title: 'Recreational vehicle',
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
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:recVehicleInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
