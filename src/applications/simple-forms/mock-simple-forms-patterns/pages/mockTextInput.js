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
      return 'RJSF';
    }),
    simpleOld: {
      'ui:title': 'TextWidget - with string description',
      'ui:description': 'Text description',
    },
    requiredOld: {
      'ui:title': 'TextWidget - with JSX description',
      'ui:description': (
        <va-additional-info trigger="JSX description">
          We need the Veteran’s Social Security number or tax identification
          number to process the application when it’s submitted online, but it’s
          not a requirement to apply for the program.
        </va-additional-info>
      ),
      'ui:errorMessages': {
        required: 'Please enter a value',
      },
    },
    disabledOld: {
      'ui:title': 'TextWidget - disabled',
      'ui:disabled': true,
    },
    'view:wcv3Title': inlineTitleUI('Web component v3'),
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
      title: 'VaTextInputField - with string hint',
      hint: 'This is a hint',
    }),
    wcv3InputmodeDecimalNew: textUI({
      title: 'VaTextInputField - with decimal inputmode',
      inputmode: 'decimal',
    }),
    wcv3TextAreaNew: textareaUI({
      title: 'VaTextareaField (short hint)',
      description: 'Text description',
      hint: 'Normal hint',
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      simpleOld: {
        type: 'string',
      },
      requiredOld: {
        type: 'string',
      },
      disabledOld: {
        type: 'string',
      },
      'view:wcv3Title': inlineTitleSchema,
      wcv3SimpleNew: textSchema,
      wcv3RequiredNew: textSchema,
      wcv3HintNew: textSchema,
      wcv3InputmodeDecimalNew: textSchema,
      wcv3TextAreaNew: {
        type: 'string',
        maxLength: 30,
        minLength: 10,
      },
    },
    required: ['requiredOld', 'wcv3RequiredNew', 'wcv3TextAreaNew'],
  },
};
