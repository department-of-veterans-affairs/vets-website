import React from 'react';
import {
  validateCurrency,
  validateRecreationalVechicleAssetsLimits,
} from '../../../utils/validations';

const RecVehicleInfo = (
  <va-additional-info
    trigger="What if I don’t know the estimated value of my trailer, camper, or boat?"
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

const recreationalVehicleUISchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your trailers, campers, and boats</h3>
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
      'ui:validations': [
        validateCurrency,
        validateRecreationalVechicleAssetsLimits,
      ],
    },
  },
  'view:components': {
    'view:recVehicleInfo': {
      'ui:description': RecVehicleInfo,
    },
  },
};

const recreationalVehicleSchema = {
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
export { recreationalVehicleUISchema, recreationalVehicleSchema };
