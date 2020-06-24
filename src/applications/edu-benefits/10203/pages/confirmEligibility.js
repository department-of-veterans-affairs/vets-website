import ConfirmEligibilityView from '../containers/ConfirmEligibilityView';

export const uiSchema = {
  'view:determineEligibility': {
    'ui:field': ConfirmEligibilityView,
  },
};

export const schema = {
  type: 'object',
  required: ['view:determineEligibility'],
  properties: {
    'view:determineEligibility': {
      type: 'object',
      properties: {
        'view:determineEligibility': {
          type: 'boolean',
        },
      },
    },
  },
};
