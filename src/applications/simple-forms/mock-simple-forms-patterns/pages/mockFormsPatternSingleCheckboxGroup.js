import React from 'react';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    formsPatternSingleCheckboxGroup: checkboxGroupUI({
      title: 'Checkbox group',
      required: true,
      useFormsPattern: 'single',
      formHeading: 'Forms pattern - single - checkbox group',
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
      formsPatternSingleCheckboxGroup: checkboxGroupSchema(['1', '2', '3']),
    },
    required: ['formsPatternSingleCheckboxGroup'],
  },
};
