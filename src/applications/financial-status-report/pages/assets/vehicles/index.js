import React from 'react';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

const title = 'Do you own any cars or other vehicles?';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">{title}</h3>
      </legend>
    </>
  ),
  questions: {
    hasVehicle: yesNoUI({
      title,
      enableAnalytics: true,
      uswds: true,
      errorMessages: {
        required: 'Please enter your vehicle information.',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      required: ['hasVehicle'],
      properties: {
        hasVehicle: {
          type: 'boolean',
        },
      },
    },
  },
};
