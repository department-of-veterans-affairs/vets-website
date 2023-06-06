import AvailableDebtsAndCopays from '../../components/AvailableDebtsAndCopays';

export const uiSchema = {
  'ui:title': 'What debt do you need help with?',
  selectedDebtsAndCopays: {
    'ui:field': AvailableDebtsAndCopays,
    'ui:options': {
      hideOnReview: true,
    },
    'ui:validations': [
      (errors, debts) => {
        if (!debts.length) {
          errors.addError('Please select at least one debt.');
        }
      },
    ],
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebtsAndCopays: {
      type: 'array',
      items: {
        type: 'object',
        properties: {},
      },
    },
  },
};
