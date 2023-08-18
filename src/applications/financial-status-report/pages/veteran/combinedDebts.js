import React from 'react';
import AvailableDebtsAndCopays from '../../components/debtsAndCopays/AvailableDebtsAndCopays';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">What debt do you need help with?</h3>
        <p className="vads-u-margin-bottom--neg1 vads--u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
          Select one or more debts you want to request relief for:{' '}
          <span className="required-text">(*Required)</span>
        </p>
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
