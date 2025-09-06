import React from 'react';
import {
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    'ui:description': (
      <>
        <h3 className="vads-u-margin-top--0">Your details</h3>
        <p>
          Since you’re filling out this application, you’ll need to provide your
          details in case we need to contact you.
        </p>
      </>
    ),
    preparerName: {
      first: textUI({
        title: 'Your first name',
        errorMessages: { required: 'Enter your first name' },
      }),
      last: textUI({
        title: 'Your last name',
        errorMessages: { required: 'Enter your last name' },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['preparerName'],
    properties: {
      preparerName: {
        type: 'object',
        required: ['first', 'last'],
        properties: {
          first: textSchema,
          last: textSchema,
          middle: textSchema, // keep optional if you want (can omit)
          suffix: textSchema, // optional
        },
      },
    },
  },
};
