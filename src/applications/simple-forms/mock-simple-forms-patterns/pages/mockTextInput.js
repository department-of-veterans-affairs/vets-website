/* eslint-disable no-unused-vars */
import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  inlineTitleSchema,
  inlineTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

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
    wcv3SimpleNew: {
      'ui:title': 'VaTextInputField - with string description',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'Text description',
    },
    wcv3RequiredNew: {
      'ui:title': 'VaTextInputField - with JSX description',
      'ui:webComponentField': VaTextInputField,
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
      'ui:options': {
        hideIf: formData => formData.hide,
        hideOnReview: true,
      },
    },
    wcv3HintNew: {
      'ui:title': 'VaTextInputField - with string hint',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'This is a hint',
      },
    },
    wcv3InputmodeDecimalNew: {
      'ui:title': 'VaTextInputField - with decimal inputmode',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        inputmode: 'decimal',
      },
    },
    wcv3TextAreaNew: {
      'ui:title': 'VaTextareaField (short hint)',
      'ui:description': 'Text description',
      'ui:webComponentField': VaTextareaField,
      'ui:options': {
        charcount: true,
        hint: 'Normal hint',
      },
    },
    wcv3DisabledNew: {
      'ui:title': 'VaTextInputField - disabled',
      'ui:description': (
        <va-additional-info trigger="Disabled not supported for v3">
          v3 does not support disabled fields. Solve with better pattern
          instead, for example one question per page.
        </va-additional-info>
      ),
      'ui:webComponentField': VaTextInputField,
      'ui:disabled': true, // not supported for v3
    },
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
      wcv3SimpleNew: {
        type: 'string',
      },
      wcv3RequiredNew: {
        type: 'string',
      },
      wcv3HintNew: {
        type: 'string',
      },
      wcv3InputmodeDecimalNew: {
        type: 'string',
      },
      wcv3TextAreaNew: {
        type: 'string',
        maxLength: 30,
        minLength: 10,
      },
      wcv3DisabledNew: {
        type: 'string',
      },
    },
    required: ['requiredOld', 'wcv3RequiredNew', 'wcv3TextAreaNew'],
  },
};
