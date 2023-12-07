import React from 'react';
import {
  validateCurrency,
  validateRealEstateRecordAssetsLimits,
} from '../../../utils/validations';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your real estate assets</h3>
      </legend>
    </>
  ),
  assets: {
    realEstateValue: {
      'ui:title': 'What is the estimated value of all your properties?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter the value of all your properties.',
      },
      'ui:validations': [
        validateCurrency,
        validateRealEstateRecordAssetsLimits,
      ],
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    assets: {
      type: 'object',
      required: ['realEstateValue'],
      properties: {
        realEstateValue: {
          type: 'string',
        },
      },
    },
  },
};
