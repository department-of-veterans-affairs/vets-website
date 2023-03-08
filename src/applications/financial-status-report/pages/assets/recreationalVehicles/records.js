import React from 'react';
import { validateCurrency } from '../../../utils/validations';

const RecVehicleInfo = (
  <va-additional-info trigger="What if I don’t know the estimated value of my trailer, camper, or boat?">
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
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        Your trailers, campers, and boats
      </legend>
    </>
  ),
  assets: {
    recVehicleAmount: {
      'ui:title':
        'What is the estimated value of all of your trailers, campers, and boats?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
      },
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter the estimated value.',
      },
      'ui:validations': [validateCurrency],
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
        recVehicleAmount: { type: 'string' },
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
