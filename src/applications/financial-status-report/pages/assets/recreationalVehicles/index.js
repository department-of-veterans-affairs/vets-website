import React from 'react';
import YesNoField from 'platform/forms-system/src/js/web-component-fields/YesNoField';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your trailers, campers, and boats</h3>
      </legend>
    </>
  ),
  questions: {
    hasRecreationalVehicle: {
      'ui:title': 'Do you own any trailers, campers, or boats?',
      'ui:webComponentField': YesNoField,
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your trailer, camper, or boat information.',
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
        hasRecreationalVehicle: {
          type: 'boolean',
        },
      },
    },
  },
};
