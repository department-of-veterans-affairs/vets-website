import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    formsPatternMultiple: {
      'ui:title': 'Text input',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        useFormsPattern: 'multiple',
        formHeadingLevel: 3,
        formHeading: 'Forms pattern - multiple',
        formDescription: (
          <>
            <p>
              Use this when you want the title and description to be attached to
              the first field, which can include JSX elements, and still be read
              out by screen readers (for the top field of multiple fields on a
              page)
            </p>
            <p>The error will show only on the field</p>
          </>
        ),
      },
    },
    formsPatternOtherField: {
      'ui:title': 'Other field',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      formsPatternMultiple: {
        type: 'string',
      },
      formsPatternOtherField: {
        type: 'string',
      },
    },
    required: ['formsPatternMultiple', 'formsPatternOtherField'],
  },
};
