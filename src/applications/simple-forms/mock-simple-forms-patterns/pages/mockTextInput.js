import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  inlineTitleSchema,
  inlineTitleUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('RJSF'),
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
    wc: inlineTitleUI('Web component'),
    simpleNew: {
      'ui:title': 'VaTextInputField - with string description',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'Text description',
      'ui:options': {
        uswds: false,
      },
    },
    requiredNew: {
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
        uswds: false,
      },
    },
    hintNew: {
      'ui:title': 'VaTextInputField - with string hint',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'This is a hint',
        uswds: false,
      },
    },
    inputmodeDecimalNew: {
      'ui:title': 'VaTextInputField - with decimal inputmode',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        inputmode: 'decimal',
        uswds: false,
      },
    },
    disabledNew: {
      'ui:title': 'VaTextInputField - disabled',
      'ui:webComponentField': VaTextInputField,
      'ui:disabled': true,
      'ui:options': {
        uswds: false,
      },
    },
    wcv3: inlineTitleUI('Web component v3'),
    simpleNewV3: {
      'ui:title': 'VaTextInputField - with string description',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'Text description',
    },
    requiredNewV3: {
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
    hintNewV3: {
      'ui:title': 'VaTextInputField - with string hint',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'This is a hint',
      },
    },
    inputmodeDecimalNewV3: {
      'ui:title': 'VaTextInputField - with decimal inputmode',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        inputmode: 'decimal',
      },
    },
    textAreaNewV3: {
      'ui:title': 'VaTextareaField',
      'ui:description': 'Text description',
      'ui:webComponentField': VaTextareaField,
    },
    disabledNewV3: {
      'ui:title': 'VaTextInputField - disabled',
      'ui:webComponentField': VaTextInputField,
      'ui:disabled': true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      simpleOld: {
        type: 'string',
      },
      requiredOld: {
        type: 'string',
      },
      disabledOld: {
        type: 'string',
      },
      wc: inlineTitleSchema,
      simpleNew: {
        type: 'string',
      },
      requiredNew: {
        type: 'string',
      },
      hintNew: {
        type: 'string',
      },
      inputmodeDecimalNew: {
        type: 'string',
      },

      disabledNew: {
        type: 'string',
      },
      wcv3: inlineTitleSchema,
      simpleNewV3: {
        type: 'string',
      },
      requiredNewV3: {
        type: 'string',
      },
      hintNewV3: {
        type: 'string',
      },
      inputmodeDecimalNewV3: {
        type: 'string',
      },
      textAreaNewV3: {
        type: 'string',
      },
      disabledNewV3: {
        type: 'string',
      },
    },
    required: ['requiredOld', 'requiredNew', 'requiredNewV3', 'textAreaNewV3'],
  },
};
