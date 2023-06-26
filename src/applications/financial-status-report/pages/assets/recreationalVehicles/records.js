import React from 'react';
import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import CustomReviewField from '../../../components/CustomReviewField';
import { validateCurrency } from '../../../utils/validations';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  recreationalVehicleTypes,
} from '../../../constants/typeaheadOptions';

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

const combinedFSRRecreationalUIVehicleSchema = {
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
      'ui:validations': [validateCurrency],
    },
  },
  'view:components': {
    'view:recVehicleInfo': {
      'ui:description': RecVehicleInfo,
    },
  },
};

const fSRRecreationalVehicleUISchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        Your trailers, campers, and boats
      </legend>
      <p>Enter each of your trailers, campers, and boats separately below.</p>
    </>
  ),
  assets: {
    recVehicles: {
      'ui:field': ItemLoop,
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
        itemName: 'trailer, camper, or boat',
        keepInPageOnReview: true,
      },
      items: {
        recVehicleType: {
          'ui:title': 'Type of vehicle',
          'ui:field': Typeahead,
          'ui:reviewField': CustomReviewField,
          'ui:options': {
            idPrefix: 'rec_vehicles',
            classNames:
              'input-size-6 vads-u-margin-top--3 vads-u-margin-bottom--3',
            getOptions: () => formatOptions(recreationalVehicleTypes),
          },
          'ui:errorMessages': {
            required: 'Please enter the type of vehicle.',
          },
        },
        recVehicleAmount: {
          'ui:title': 'Estimated value',
          'ui:options': {
            classNames: 'schemaform-currency-input',
            widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
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
    'view:recVehicleInfo': {
      'ui:description': RecVehicleInfo,
    },
  },
};

const combinedFSRRecreationalVehicleSchema = {
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

const fSRRecreationalVehicleSchema = {
  type: 'object',
  properties: {
    assets: {
      type: 'object',
      properties: {
        recVehicles: {
          type: 'array',
          items: {
            type: 'object',
            required: ['recVehicleType', 'recVehicleAmount'],
            properties: {
              recVehicleType: {
                type: 'string',
              },
              recVehicleAmount: {
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
        'view:recVehicleInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};

export {
  fSRRecreationalVehicleUISchema,
  combinedFSRRecreationalUIVehicleSchema,
  fSRRecreationalVehicleSchema,
  combinedFSRRecreationalVehicleSchema,
};
