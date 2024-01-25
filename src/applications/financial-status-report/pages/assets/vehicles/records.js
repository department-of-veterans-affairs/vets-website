import React from 'react';
import ItemLoop from '../../../components/shared/ItemLoop';
import CardDetailsView from '../../../components/shared/CardDetailsView';
import { validateCurrency } from '../../../utils/validations';

const VehicleInfo = (
  <va-additional-info
    trigger="What if I don’t know the estimated value of my car or other vehicle?"
    uswds
  >
    Include the amount of money you think you would get if you sold the vehicle
    in your local community. To get an idea of prices, you can check these
    places:
    <ul>
      <li>Online forums for your community</li>
      <li>Classified ads in local newspapers</li>
      <li>Websites that appraise the value of vehicles</li>
    </ul>
  </va-additional-info>
);

export const uiSchema = {
  'ui:title': 'Your cars or other vehicles',
  'ui:description': 'Enter information for each vehicle separately below.',
  assets: {
    automobiles: {
      'ui:field': ItemLoop,
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
        itemName: 'vehicle',
        keepInPageOnReview: true,
      },
      items: {
        make: {
          'ui:title': 'Vehicle make',
          'ui:options': {
            widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
          },
          'ui:errorMessages': {
            required: 'Please enter the type of vehicle.',
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
        resaleValue: {
          'ui:title': 'Estimated value',
          'ui:options': {
            classNames: 'schemaform-currency-input',
            widgetClassNames: 'input-size-5 vads-u-margin-bottom--3',
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
            required: ['make', 'resaleValue'],
            properties: {
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
        'view:vehicleInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
