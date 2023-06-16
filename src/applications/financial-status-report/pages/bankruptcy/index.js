import React from 'react';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your bankruptcy details</h3>
      </legend>
    </>
  ),
  questions: {
    hasBeenAdjudicatedBankrupt: {
      'ui:title': 'Have you ever declared bankruptcy?',
      'ui:required': () => true,
      'ui:widget': 'yesNo',
      'ui:options': {
        showFieldLabel: 'label',
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
        hasBeenAdjudicatedBankrupt: {
          type: 'boolean',
        },
      },
    },
  },
};
