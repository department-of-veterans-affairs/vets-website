import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export default {
  uiSchema: {
    simpleOld: {
      'ui:title': 'TextWidget - with string description',
      'ui:description': 'Text description',
    },
    simpleNew: {
      'ui:title': 'VaTextInputField - with string description',
      'ui:description': 'Text description',
      'ui:webComponentField': VaTextInputField,
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
    requiredNew: {
      'ui:title': 'VaTextInputField - with JSX description',
      'ui:description': (
        <va-additional-info trigger="JSX description">
          We need the Veteran’s Social Security number or tax identification
          number to process the application when it’s submitted online, but it’s
          not a requirement to apply for the program.
        </va-additional-info>
      ),
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Please enter a value',
      },
      'ui:options': {
        hideIf: formData => formData.hide,
        hideOnReview: true,
      },
    },
    hintNew: {
      'ui:title': 'VaTextInputField - with string hint',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'This is a hint',
      },
    },
    inputmodeDecimalNew: {
      'ui:title': 'VaTextInputField - with decimal inputmode',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        inputmode: 'decimal',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      simpleOld: {
        type: 'string',
      },
      simpleNew: {
        type: 'string',
      },
      requiredOld: {
        type: 'string',
      },
      requiredNew: {
        type: 'string',
      },
      hintNew: {
        type: 'string',
      },
      inputmodeDecimalNew: {
        type: 'number',
      },
    },
    required: ['requiredOld', 'requiredNew'],
  },
  // initialData: {
  //   requiredOld: 'Test',
  //   requiredNew: 'Test',
  // },
};
