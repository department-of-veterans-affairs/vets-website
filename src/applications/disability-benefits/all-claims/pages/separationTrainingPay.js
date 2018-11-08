import dateUI from 'us-forms-system/lib/js/definitions/date';
import fullSchema from '../config/schema';
import merge from 'lodash/merge';
import { hasSeparationPay } from '../validations';
import { separationPayDetailsDescription } from '../content/separationTrainingPay';

const {
  separationPayDate: separationPayDateSchema,
  separationPayBranch: separationPayBranchSchema,
  hasTrainingPay,
} = fullSchema.properties;

export const uiSchema = {
  'view:hasSeparationPay': {
    'ui:title': 'Did you receive separation pay or severance pay?',
    'ui:widget': 'yesNo',
  },
  'view:separationPayDetails': {
    'ui:options': {
      expandUnder: 'view:hasSeparationPay',
    },
    'view:separationPayDetailsDescription': {
      'ui:title': 'Separation or Severance Pay',
      'ui:description': separationPayDetailsDescription,
    },
    separationPayDate: merge(
      {},
      dateUI('When did you get a separation or severance payment?'),
      { 'ui:required': hasSeparationPay },
    ),
    separationPayBranch: {
      'ui:title':
        'Please choose the branch of service that gave you separation or severance pay',
      'ui:required': hasSeparationPay,
    },
  },
  hasTrainingPay: {
    'ui:title':
      'Do you expect to receive active or inactive duty training pay?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasSeparationPay', 'hasTrainingPay'],
  properties: {
    'view:hasSeparationPay': {
      type: 'boolean',
    },
    'view:separationPayDetails': {
      type: 'object',
      properties: {
        'view:separationPayDetailsDescription': {
          type: 'object',
          properties: {},
        },
        separationPayDate: separationPayDateSchema,
        separationPayBranch: separationPayBranchSchema,
      },
    },
    hasTrainingPay,
  },
};
