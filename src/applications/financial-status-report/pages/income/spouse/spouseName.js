import React from 'react';

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
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
        'ui:required': () => true,
        'ui:errorMessages': {
          required: "Please enter your spouse's first name.",
        },
      },
      last: {
        'ui:title': 'What’s your spouse’s last name?',
        'ui:options': {
          widgetClassNames: 'input-size-3',
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
