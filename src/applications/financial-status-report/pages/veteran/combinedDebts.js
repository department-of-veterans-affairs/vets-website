import React from 'react';
import AvailableDebtsAndCopays from '../../components/AvailableDebtsAndCopays';

export const uiSchema = {
  'ui:title': (
    <span
      className="vads-u-font-size--h4 vads-u-font-weight--bold vads-u-font-family--sans"
      data-testid="debt-title"
    >
      What debt do you need help with?
    </span>
  ),
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
