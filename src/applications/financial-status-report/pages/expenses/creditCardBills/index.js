import React from 'react';
import YesNoField from 'platform/forms-system/src/js/web-component-fields/YesNoField';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Credit card bills</h3>
      </legend>
    </>
  ),
  questions: {
    hasCreditCardBills: {
      'ui:title': 'Do you have any past-due credit card bills?',
      'ui:webComponentField': YesNoField,

      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your credit card bill information.',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasCreditCardBills: {
          type: 'boolean',
        },
      },
    },
  },
};
