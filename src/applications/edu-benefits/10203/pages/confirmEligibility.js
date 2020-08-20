import ConfirmEligibilityView from '../containers/ConfirmEligibilityView';

export const uiSchema = {
  'view:confirmEligibility': {
    'ui:field': ConfirmEligibilityView,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:confirmEligibility': {
      type: 'object',
      properties: {
        'view:confirmEligibility': {
          type: 'boolean',
        },
      },
    },
  },
};
