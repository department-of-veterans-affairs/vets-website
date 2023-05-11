import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

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
    wc: titleUI('Web component', {
      classNames: 'vads-u-margin-top--4',
    }),
    simpleNew: {
      'ui:title': 'VaTextInputField - with string description',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'Text description',
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
    disabledNew: {
      'ui:title': 'VaTextInputField - disabled',
      'ui:webComponentField': VaTextInputField,
      'ui:disabled': true,
    },
    wcv3: titleUI('Web component v3', {
      classNames: 'vads-u-margin-top--4',
    }),
    simpleNewV3: {
      'ui:title': 'VaTextInputField - with string description',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'Text description',
      'ui:options': {
        uswds: true,
      },
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
        uswds: true,
      },
    },
    hintNewV3: {
      'ui:title': 'VaTextInputField - with string hint',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'This is a hint',
        uswds: true,
      },
    },
    inputmodeDecimalNewV3: {
      'ui:title': 'VaTextInputField - with decimal inputmode',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        inputmode: 'decimal',
        uswds: true,
      },
    },
    disabledNewV3: {
      'ui:title': 'VaTextInputField - disabled',
      'ui:webComponentField': VaTextInputField,
      'ui:disabled': true,
      'ui:options': {
        uswds: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema(),
      simpleOld: {
        type: 'string',
      },
      requiredOld: {
        type: 'string',
      },
      disabledOld: {
        type: 'string',
      },
      wc: titleSchema(),
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
      wcv3: titleSchema(),
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
      disabledNewV3: {
        type: 'string',
      },
    },
    required: ['requiredOld', 'requiredNew', 'requiredNewV3'],
  },
};
