import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import dateUI from 'platform/forms-system/src/js/definitions/date';
import { validateDate } from 'platform/forms-system/src/js/validation';

import { title10DatesRequired } from '../utils';
import {
  title10BeforeRad,
  isLessThan180DaysInFuture,
  validateTitle10StartDate,
} from '../validations';

const {
  title10Activation,
} = fullSchema.properties.serviceInformation.properties.reservesNationalGuardService.properties;

const activationDate = dateUI('Activation date');

export const uiSchema = {
  'ui:title': 'Federal Orders',
  serviceInformation: {
    'ui:validations': [title10BeforeRad],
    reservesNationalGuardService: {
      'view:isTitle10Activated': {
        'ui:title':
          'Are you currently activated on federal orders in the Reserve or the National Guard?',
        'ui:widget': 'yesNo',
      },
      title10Activation: {
        'ui:options': {
          expandUnder: 'view:isTitle10Activated',
        },
        title10ActivationDate: {
          ...activationDate,
          'ui:validations': [validateDate, validateTitle10StartDate],
          'ui:required': title10DatesRequired,
        },
        anticipatedSeparationDate: {
          ...dateUI('Expected separation date'),
          'ui:validations': [validateDate, isLessThan180DaysInFuture],
          'ui:required': title10DatesRequired,
        },
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
