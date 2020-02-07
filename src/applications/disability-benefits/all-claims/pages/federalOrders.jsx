import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import merge from 'lodash/merge';

import dateUI from 'platform/forms-system/src/js/definitions/date';
import { title10DatesRequired, isInFuture } from '../utils';

const {
  title10Activation,
} = fullSchema.properties.serviceInformation.properties.reservesNationalGuardService.properties;

export const uiSchema = {
  'ui:title': 'Federal Orders',
  serviceInformation: {
    reservesNationalGuardService: {
      'view:isTitle10Activated': {
        'ui:title':
          'Are you currently activated on federal orders in the Reserves or the National Guard?',
        'ui:widget': 'yesNo',
      },
      title10Activation: {
        'ui:options': {
          expandUnder: 'view:isTitle10Activated',
        },
        title10ActivationDate: merge(
          {
            'ui:required': title10DatesRequired,
          },
          dateUI('Activation date'),
        ),
        anticipatedSeparationDate: merge(
          {
            'ui:validations': [isInFuture],
            'ui:required': title10DatesRequired,
          },
          dateUI('Expected separation date'),
        ),
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    serviceInformation: {
      type: 'object',
      properties: {
        reservesNationalGuardService: {
          type: 'object',
          required: ['view:isTitle10Activated'],
          properties: {
            'view:isTitle10Activated': {
              type: 'boolean',
            },
            title10Activation,
          },
        },
      },
    },
  },
};
