import { separationPayDetailsDescription } from '../content/separationPayDetails';

export const uiSchema = {
  'view:separationPayDescription': {
    'ui:title': 'Separation or Severance Pay',
    'ui:description': separationPayDetailsDescription
  }
};

export const schema = {
  type: 'object',
  properties: {
    'view:separationPayDescription': {
      type: 'object',
      properties: {}
    },
    separationPayDate: {
      type: 'string'
    },
    separationBranch: {
      type: 'string'
    }
  }
};
