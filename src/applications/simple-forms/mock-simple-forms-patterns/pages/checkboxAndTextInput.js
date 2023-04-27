import React from 'react';
import {
  checkboxSchema,
  checkboxUI,
  jsxSchema,
  jsxUI,
  ssnUI as newSsnUI,
  textInputSchema,
  textInputUI,
} from 'platform/forms-system/src/js/web-component-schemas';
import { ssnUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
// import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

export default {
  uiSchema: {
    textInputOld: {
      'ui:title': 'RJSF text input',
    },
    textInputNew: textInputUI('Web component'),
    oldCheckbox: {
      'ui:title': 'RJSF checkbox',
    },
    checkboxWithJsx: checkboxUI({
      'ui:title': 'Web component version',
    }),
    textInputOld2: {
      ...ssnUI('RJSF - Social security number'),
      'ui:title': 'RJSF - Social security number',
      'ui:errorMessages': {
        required: 'Please enter a Social Security number',
      },
    },
    checkboxWithLabelAndLegend: checkboxUI({
      'ui:title': 'Web component',
      'ui:description': 'Web component description (legend)',
    }),
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
      textInputNew: {
        type: 'string',
      },
      oldCheckbox: {
        type: 'boolean',
      },
      checkboxWithJsx: checkboxSchema(),
      textInputOld2: {
        type: 'string',
      },
      checkboxWithLabelAndLegend: checkboxSchema(),
      textInput: textInputSchema(),
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
    ],
  },
};
