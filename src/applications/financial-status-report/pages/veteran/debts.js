import AvailableDebts from '../../components/debtsAndCopays/AvailableDebts';

export const uiSchema = {
  availableDebts: {
    'ui:title': 'What debt do you need help with?',
    'ui:widget': AvailableDebts,
    'ui:required': formData => {
      const { selectedDebts } = formData;
      return !selectedDebts.length;
    },
    'ui:options': {
      hideOnReview: true,
    },
    'ui:errorMessages': {
      required: 'Please select at least one debt.',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    availableDebts: {
      type: 'boolean',
    },
  },
};
