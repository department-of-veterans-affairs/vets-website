import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { isValidYear } from '../validations';
import {
  separationPayDetailsDescription,
  hasSeparationPayTitle,
} from '../content/separationTrainingPay';

const {
  separationPayDate: separationPayDateSchema,
  separationPayBranch: separationPayBranchSchema,
  hasSeparationPay,
} = fullSchema.properties;

export const uiSchema = {
  hasSeparationPay: {
    'ui:title': hasSeparationPayTitle,
    'ui:widget': 'yesNo',
  },
  'view:separationPayDetails': {
    'ui:options': {
      expandUnder: 'hasSeparationPay',
    },
    'view:separationPayDetailsDescription': {
      'ui:title': 'Separation or Severance Pay',
      'ui:description': separationPayDetailsDescription,
    },
    separationPayDate: {
      'ui:title': 'Please tell us the year you received a payment',
      // TODO: Change this to a number field to mimic the regular date field
      'ui:validations': [isValidYear],
      'ui:errorMessages': {
        pattern: 'Please provide a valid year',
      },
      'ui:options': {
        widgetClassNames: 'year-input',
      },
    },
    separationPayBranch: {
      'ui:title':
        'Please choose the branch of service that gave you separation or severance pay',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    hasSeparationPay,
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
  },
};
