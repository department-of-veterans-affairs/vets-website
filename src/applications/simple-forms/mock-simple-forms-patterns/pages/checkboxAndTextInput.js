import React from 'react';
import {
  jsxSchema,
  jsxUI,
  ssnUI as newSsnUI,
} from 'platform/forms-system/src/js/web-component-schemas';
import { ssnUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    textInputOld: {
      'ui:title': 'RJSF text input',
    },
    textInputNewUswds: {
      'ui:title': 'USWDS Web component text input',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        uswds: true,
      },
    },
    textInputNew: {
      'ui:title': 'Web component text input',
      'ui:webComponentField': VaTextInputField,
    },
    oldCheckbox: {
      'ui:title': 'RJSF checkbox',
    },
    checkboxWithJsx: {
      'ui:title': 'Web component checkbox',
      'ui:webComponentField': VaCheckboxField,
    },
    checkboxWithJsxUsdws: {
      'ui:title': 'USWDS Web component checkbox',
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        uswds: true,
      },
    },
    textInputOld2: {
      ...ssnUI('RJSF - Social security number'),
      'ui:title': 'RJSF - Social security number',
      'ui:errorMessages': {
        required: 'Please enter a Social Security number',
      },
    },
    checkboxWithLabelAndLegend: {
      'ui:title': 'Web component',
      'ui:webComponentField': VaCheckboxField,
      'ui:description': 'Web component description (legend)',
      'ui:options': {
        uswds: true,
      },
    },
    textInput: newSsnUI('Web component - Social Security number'),
    checkboxWithLabel: jsxUI(
      <div className="vads-u-background-color--gray-light-alt">
        <va-checkbox label="Web component" />
      </div>,
    ),
    oldCheckboxExample: {
      'ui:title': 'Old checkbox example',
      'ui:description': 'Old checkbox description',
    },
  },
  schema: {
    type: 'object',
    properties: {
      textInputOld: {
        type: 'string',
      },
      textInputNewUswds: {
        type: 'string',
      },
      textInputNew: {
        type: 'string',
      },
      oldCheckbox: {
        type: 'boolean',
      },
      checkboxWithJsx: {
        type: 'boolean',
      },
      checkboxWithJsxUsdws: {
        type: 'boolean',
      },
      textInputOld2: {
        type: 'string',
      },
      checkboxWithLabelAndLegend: {
        type: 'boolean',
      },
      textInput: {
        type: 'string',
      },
      checkboxWithLabel: jsxSchema(),
      oldCheckboxExample: {
        type: 'boolean',
      },
    },
    required: [
      'textInput',
      'checkboxWithLabel',
      'textInputOld2',
      'textInputOld',
      'textInputNew',
      'textInputNewUswds',
    ],
  },
};
