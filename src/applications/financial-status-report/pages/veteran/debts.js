import React from 'react';
import AvailableDebts from '../../components/AvailableDebts';

export const uiSchema = {
  availableDebts: {
    'ui:title': (
      <span
        className="vads-u-font-size--h4 vads-u-font-weight--bold vads-u-font-family--sans"
        data-testid="debt-title"
      >
        What debt do you need help with?
      </span>
    ),
    'ui:widget': AvailableDebts,
    'ui:required': ({ selectedDebts }) => !selectedDebts.length,
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
