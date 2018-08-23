import fullSchema from '../config/schema';
import _ from 'lodash/fp';

import dateUI from 'us-forms-system/lib/js/definitions/date';
import {
  title10DatesRequired,
  isInFuture
} from '../utils';

const {
  title10Activation,
  receivingTrainingPay
} = fullSchema.properties.serviceInformation.properties.reservesNationalGuardService.properties;

export const uiSchema = {
  'ui:title': 'Federal Orders and Training Pay',
  'view:isTitle10Activated': {
    'ui:title': 'Are you currently activated on federal orders in the Reserves or the National Guard?',
    'ui:widget': 'yesNo'
  },
  title10Activation: {
    'ui:options': {
      expandUnder: 'view:isTitle10Activated',
    },
    title10ActivationDate: _.merge(
      dateUI('Activation date'),
      { 'ui:required': title10DatesRequired }
    ),
    anticipatedSeparationDate: _.merge(
      dateUI('Expected separation date'),
      {
        'ui:validations': [isInFuture],
        'ui:required': title10DatesRequired
      },
    ),
  },
  receivingTrainingPay: {
    'ui:title': 'Are you currently receiving inactive-duty training pay?',
    'ui:widget': 'yesNo'
  }
};

export const schema = {
  type: 'object',
  properties: {
    'view:isTitle10Activated': {
      type: 'boolean'
    },
    title10Activation,
    receivingTrainingPay
  }
};

