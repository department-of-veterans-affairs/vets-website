import React from 'react';

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
      'ui:widget': 'yesNo',
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
