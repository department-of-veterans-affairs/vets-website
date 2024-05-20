import React from 'react';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

export const title = 'Do you own any trailers, campers, or boats?';
export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your trailers, campers, and boats</h3>
      </legend>
    </>
  ),
  questions: {
    hasRecreationalVehicle: yesNoUI({
      title,
      enableAnalytics: true,
      uswds: true,
      errorMessages: {
        required: 'Please enter your trailers, campers, and boats information.',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      required: ['hasRecreationalVehicle'],
      properties: {
        hasRecreationalVehicle: {
          type: 'boolean',
        },
      },
    },
  },
};
