import React from 'react';
import YesNoField from 'platform/forms-system/src/js/web-component-fields/YesNoField';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your spouse information</h3>
      </legend>
    </>
  ),
  questions: {
    spouseHasBenefits: {
      'ui:title': 'Does your spouse get VA benefits?',
      'ui:webComponentField': YesNoField,
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your spouse’s VA benefits information.',
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
        spouseHasBenefits: {
          type: 'boolean',
        },
      },
    },
  },
};
