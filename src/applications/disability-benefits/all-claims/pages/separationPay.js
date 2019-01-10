import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { hasSeparationPay, isValidYear } from '../validations';
import { separationPayDetailsDescription } from '../content/separationTrainingPay';

const {
  separationPayDate: separationPayDateSchema,
  separationPayBranch: separationPayBranchSchema,
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
      'ui:required': hasSeparationPay,
    },
    separationPayBranch: {
      'ui:title':
        'Please choose the branch of service that gave you separation or severance pay',
      'ui:required': hasSeparationPay,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasSeparationPay'],
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
  },
};
