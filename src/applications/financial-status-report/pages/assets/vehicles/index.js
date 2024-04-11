import React from 'react';
import YesNoField from 'platform/forms-system/src/js/web-component-fields/YesNoField';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your cars or other vehicles</h3>
      </legend>
    </>
  ),
  questions: {
    hasVehicle: {
      'ui:title': 'Do you own any cars or other vehicles?',
      'ui:webComponentField': YesNoField,
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your vehicle information.',
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
        hasVehicle: {
          type: 'boolean',
        },
      },
    },
  },
};
