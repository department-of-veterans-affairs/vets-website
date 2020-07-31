import ConfirmEligibilityView from '../containers/ConfirmEligibilityView';

const confirmEligibilityIsNotChecked = formData =>
  formData['view:confirmEligibility']['view:confirmEligibility'] === undefined;

export const uiSchema = {
  'view:confirmEligibility': {
    'ui:field': ConfirmEligibilityView,
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
