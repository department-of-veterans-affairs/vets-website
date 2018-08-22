import dateUI from 'us-forms-system/lib/js/definitions/date';
import merge from 'lodash/merge';
import { separationPayDetailsDescription } from '../content/separationPayDetails';
import fullSchema from '../config/schema';

const { separationPayDetails: separationPayDetailsSchema } = fullSchema.properties;

export const uiSchema = {
  'ui:order': [
    'view:separationPayDescription',
    'separationPayDate',
    'separationBranch'
  ],
  'view:separationPayDescription': {
    'ui:title': 'Separation or Severance Pay',
    'ui:description': separationPayDetailsDescription
  },
  separationPayDate: dateUI('When did you get a separation or severance payment?'),
  separationBranch: {
    'ui:title': 'Please choose the branch of service that gave you separation or severance pay'
  }
};

export const schema = merge(
  {},
  {
    properties: {
      'view:separationPayDescription': {
        type: 'object',
        properties: {}
      }
    }
  },
  separationPayDetailsSchema
);
