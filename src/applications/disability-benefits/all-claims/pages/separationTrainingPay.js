import dateUI from 'us-forms-system/lib/js/definitions/date';
import fullSchema from '../config/schema';
import merge from 'lodash/merge';
import { hasSeparationPay } from '../validations';
import {
  waiveTrainingPayDescription,
  separationPayDetailsDescription,
} from '../content/separationTrainingPay';

const {
  separationPayDate: separationPayDateSchema,
  separationPayBranch: separationPayBranchSchema,
  waiveTrainingPay: waiveTrainingPaySchema,
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
  'view:hasTrainingPay': {
    'ui:title': 'Did you receive active or inactive training pay?',
    'ui:widget': 'yesNo',
  },
  'view:waiveTrainingPay': {
    'ui:options': {
      expandUnder: 'view:hasTrainingPay',
    },
    'view:waiveTrainingPayDescription': {
      'ui:title': 'Training pay waiver',
      'ui:description': waiveTrainingPayDescription,
    },
    waiveTrainingPay: {
      'ui:title': `I choose to waive VA compensation pay for the days I receive inactive 
      duty training pay, so I can keep my inactive duty training pay.`,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasSeparationPay', 'view:hasTrainingPay'],
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
    'view:hasTrainingPay': {
      type: 'boolean',
    },
    'view:waiveTrainingPay': {
      type: 'object',
      properties: {
        'view:waiveTrainingPayDescription': {
          type: 'object',
          properties: {},
        },
        waiveTrainingPay: waiveTrainingPaySchema,
      },
    },
  },
};
