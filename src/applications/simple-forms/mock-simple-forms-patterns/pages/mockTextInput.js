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
    rjsfTitle: titleUI('RJSF'),
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
    wcTitle: inlineTitleUI('Web component'),
    wcOldSimple: {
      'ui:title': 'VaTextInputField - with string description',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'Text description',
      'ui:options': {
        uswds: false,
      },
    },
    wcOldRequired: {
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
    wcOldHint: {
      'ui:title': 'VaTextInputField - with string hint',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'This is a hint',
        uswds: false,
      },
    },
    wcOldInputmodeDecimal: {
      'ui:title': 'VaTextInputField - with decimal inputmode',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        inputmode: 'decimal',
        uswds: false,
      },
    },
    wcOldDisabled: {
      'ui:title': 'VaTextInputField - disabled',
      'ui:webComponentField': VaTextInputField,
      'ui:disabled': true,
      'ui:options': {
        uswds: false,
      },
    },
    wcv3Title: inlineTitleUI('Web component v3'),
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
      'ui:title': 'VaTextareaField',
      'ui:description': 'Text description',
      'ui:webComponentField': VaTextareaField,
    },
    wcv3DisabledNew: {
      'ui:title': 'VaTextInputField - disabled',
      'ui:webComponentField': VaTextInputField,
      'ui:disabled': true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      rjsfTitle: titleSchema,
      simpleOld: {
        type: 'string',
      },
      requiredOld: {
        type: 'string',
      },
      disabledOld: {
        type: 'string',
      },
      wcTitle: inlineTitleSchema,
      wcOldSimple: {
        type: 'string',
      },
      wcOldRequired: {
        type: 'string',
      },
      wcOldHint: {
        type: 'string',
      },
      wcOldInputmodeDecimal: {
        type: 'string',
      },
      wcOldDisabled: {
        type: 'string',
      },
      wcv3Title: inlineTitleSchema,
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
      },
      wcv3DisabledNew: {
        type: 'string',
      },
    },
    required: [
      'requiredOld',
      'wcOldRequired',
      'wcv3RequiredNew',
      'wcv3TextAreaNew',
    ],
  },
};
