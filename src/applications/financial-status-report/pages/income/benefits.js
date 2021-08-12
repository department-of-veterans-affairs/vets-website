import Benefits from '../../components/Benefits';

export const uiSchema = {
  'ui:title': 'Your VA benefits',
  'view:components': {
    'view:vaBenefitsOnFile': {
      'ui:field': Benefits,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    'view:components': {
      type: 'object',
      properties: {
        'view:vaBenefitsOnFile': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
