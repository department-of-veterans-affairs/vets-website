import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  emailUI,
  ssnUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

export default {
  uiSchema: {
    simpleOld: {
      'ui:title': '1. TextWidget - with string description',
      'ui:description': 'Text description',
    },
    simpleNew: {
      'ui:title': '1. VaTextInputField - with string description',
      'ui:description': 'Text description',
      'ui:webComponentField': VaTextInputField,
    },
    requiredOld: {
      'ui:title': '2. TextWidget - with JSX description',
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
      'ui:title': '2. VaTextInputField - with JSX description',
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
    emailOld: {
      ...emailUI(),
      'ui:title': '3. TextWidget - emailUI',
    },
    emailNew: {
      ...emailUI(),
      'ui:title': '3. VaTextInputField - emailUI',
      'ui:webComponentField': VaTextInputField,
    },
    phoneOld: phoneUI('4. TextWidget - phoneUI'),
    phoneNew: {
      ...phoneUI('4. VaTextInputField - phoneUI'),
      'ui:webComponentField': VaTextInputField,
    },
    ssnOld: {
      ...ssnUI(),
      'ui:title': '5. TextWidget - ssnUI',
    },
    ssnNew: {
      ...ssnUI(),
      'ui:title': '5. VaTextInputField - ssnUI',
      'ui:webComponentField': VaTextInputField,
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
      emailOld: {
        type: 'string',
        pattern: '^\\S+@\\S+$',
        minLength: 3,
        maxLength: 10,
      },
      emailNew: {
        type: 'string',
        pattern: '^\\S+@\\S+$',
        minLength: 3,
        maxLength: 10,
      },
      phoneOld: {
        type: 'string',
        minLength: 10,
      },
      phoneNew: {
        type: 'string',
        minLength: 10,
      },
      ssnOld: {
        type: 'string',
        pattern: '^[0-9]{9}$',
      },
      ssnNew: {
        type: 'string',
        pattern: '^[0-9]{9}$',
      },
    },
    required: ['requiredOld', 'requiredNew'],
  },
};
