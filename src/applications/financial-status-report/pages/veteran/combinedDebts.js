import React from 'react';
import AvailableDebtsAndCopays from '../../components/debtsAndCopays/AvailableDebtsAndCopays';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">What debt do you need help with?</h3>
      </legend>
    </>
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
