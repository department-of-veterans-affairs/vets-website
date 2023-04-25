import React from 'react';
import {
  textInputSchema,
  textInputUI,
} from 'platform/forms-system/src/js/web-component-schemas';

export default {
  uiSchema: {
    simpleOld: {
      'ui:title': 'TextWidget - with string description',
      'ui:description': 'Text description',
    },
    simpleNew: textInputUI({
      'ui:title': 'VaTextInputField - with string description',
      'ui:description': 'Text description',
    }),
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
    requiredNew: textInputUI({
      'ui:title': 'VaTextInputField - with JSX description',
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
    }),
    hintNew: textInputUI({
      'ui:title': 'VaTextInputField - with string hint',
      'ui:options': {
        hint: 'This is a hint',
      },
    }),
    inputmodeDecimalNew: textInputUI({
      'ui:title': 'VaTextInputField - with decimal inputmode',
      'ui:options': {
        inputmode: 'decimal',
      },
    }),
    disabledOld: {
      'ui:title': 'TextWidget - disabled',
      'ui:disabled': true,
    },
    disabledNew: textInputUI({
      'ui:title': 'VaTextInputField - disabled',
      'ui:disabled': true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      simpleOld: {
        type: 'string',
      },
      simpleNew: textInputSchema(),
      requiredOld: {
        type: 'string',
      },
      requiredNew: textInputSchema(),
      hintNew: textInputSchema(),
      inputmodeDecimalNew: textInputSchema(),
      disabledOld: {
        type: 'string',
      },
      disabledNew: textInputSchema(),
    },
    required: ['requiredOld', 'requiredNew'],
  },
  // initialData: {
  //   requiredOld: 'Test',
  //   requiredNew: 'Test',
  // },
};
