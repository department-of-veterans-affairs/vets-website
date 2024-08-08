import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your spouse information</h3>
      </legend>
    </>
  ),
  personalData: {
    spouseFullName: {
      first: {
        'ui:title': 'What’s your spouse’s first name?',
        'ui:required': () => true,
        'ui:errorMessages': {
          required: "Please enter your spouse's first name.",
        },
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          width: 'xl',
        },
      },
      last: {
        'ui:title': 'What’s your spouse’s last name?',
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          width: 'xl',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        spouseFullName: {
          type: 'object',
          properties: {
            first: {
              type: 'string',
            },
            last: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
