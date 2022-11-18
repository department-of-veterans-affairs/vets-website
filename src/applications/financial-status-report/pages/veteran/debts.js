import React from 'react';
import AvailableDebts from '../../components/AvailableDebts';

export const uiSchema = {
  'ui:title': (
    <span
      className="vads-u-font-size--h4 vads-u-font-weight--bold vads-u-font-family--sans"
      data-testid="debt-title"
    >
      What debt do you need help with?
    </span>
  ),
  'ui:required': () => true,
  'ui:errorMessages': {
    required: 'Please select at least one debt.',
  },
  selectedDebtsAndCopays: {
    'ui:title': 'inner title',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please select at least one debt. messages',
    },
    'ui:field': AvailableDebts,
    'ui:options': {
      hideOnReview: true,
    },
    'ui:validations': [
      (errors, testVal) => {
        if (!testVal.length) {
          errors.addError('Please select a debt silly');
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
