import React from 'react';
import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Headstone or marker'),
    'ui:description': (
      <p>
        The Veteran&apos;s grave must have a privately purchased, permanent
        crypt, headstone, marker, or mausoleum to attach the medallion to.
      </p>
    ),
    hasHeadstoneOrMarker: radioUI({
      title:
        "Does the Veteran's grave currently have a privately purchased, permanent crypt, headstone, marker, or mausoleum?",
      labels: {
        yes: 'Yes',
        no: 'No',
      },
      required: () => true,
      errorMessages: {
        required: 'You must provide a response',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['hasHeadstoneOrMarker'],
    properties: {
      hasHeadstoneOrMarker: radioSchema(['yes', 'no']),
    },
  },
};
