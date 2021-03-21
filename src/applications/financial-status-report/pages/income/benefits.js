import BenefitsCard from '../../components/BenefitsCard';

export const uiSchema = {
  'ui:title': 'Your VA benefits',
  'ui:description':
    'This is the VA benefit information we have on file for you.',
  'view:components': {
    'view:vaBenefitsOnFile': {
      'ui:field': BenefitsCard,
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
