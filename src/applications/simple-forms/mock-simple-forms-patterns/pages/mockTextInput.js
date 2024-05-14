/* eslint-disable no-unused-vars */
import React from 'react';
import {
  inlineTitleSchema,
  inlineTitleUI,
  titleUI,
  textUI,
  textSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // Example of using a function:
    // Only use this if you need it because it will rerender every time (only on this page)
    ...titleUI(({ formData, formContext }) => {
      return 'Web component v3 text fields';
    }),
    wcv3SimpleNew: textUI({
      title: 'VaTextInputField - with string description',
      description: 'Text description',
    }),
    wcv3RequiredNew: textUI({
      title: 'VaTextInputField - with JSX description',
      description: (
        <va-additional-info trigger="JSX description">
          We need the Veteran’s Social Security number or tax identification
          number to process the application when it’s submitted online, but it’s
          not a requirement to apply for the program.
        </va-additional-info>
      ),
      errorMessages: {
        required: 'Please enter a value',
      },
      hideIf: formData => formData.hide,
      hideOnReview: true,
    }),
    wcv3HintNew: textUI({
      title: 'VaTextInputField with charcount',
      hint: 'This is a hint',
      width: 'md',
      charcount: true,
    }),
    wcv3TextAreaNew: textareaUI({
      title: 'VaTextareaField',
      description: 'Text description',
      hint: 'Normal hint',
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3SimpleNew: textSchema,
      wcv3RequiredNew: textSchema,
      wcv3HintNew: {
        type: 'string',
        maxLength: 24,
      },
      wcv3TextAreaNew: {
        type: 'string',
        maxLength: 30,
        minLength: 10,
      },
    },
    required: ['wcv3RequiredNew', 'wcv3TextAreaNew'],
  },
};
