import Benefits from '../../components/Benefits';
import EnhancedBenefits from '../../components/EnhancedBenefits';

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

export const enhancedUiSchema = {
  'ui:title': 'Your VA benefits',
  'view:components': {
    'view:vaBenefitsOnFile': {
      'ui:field': EnhancedBenefits,
    },
  },
};

export const enhancedSchema = {
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
