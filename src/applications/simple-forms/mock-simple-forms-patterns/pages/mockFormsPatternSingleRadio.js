import React from 'react';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    formsPatternSingleRadio: radioUI({
      title: 'Radio',
      useFormsPattern: 'single',
      formHeading: 'Forms pattern - single - radio',
      formDescription: (
        <>
          <p>
            Use this when you want the title and description to be attached to
            the first field, which can include JSX elements, and still be read
            out by screen readers (for a single field on the page)
          </p>
          <p>The error will show on the entire block</p>
        </>
      ),
      formHeadingLevel: 3,
      labels: {
        '1': 'One',
        '2': 'Two',
        '3': 'Three',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      formsPatternSingleRadio: radioSchema(['1', '2', '3']),
    },
    required: ['formsPatternSingleRadio'],
  },
};
