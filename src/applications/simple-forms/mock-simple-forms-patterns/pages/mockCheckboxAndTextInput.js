import React from 'react';
import {
  inlineTitleSchema,
  inlineTitleUI,
  ssnUI as newSsnUI,
  ssnSchema,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsfTitle: titleUI('RJSF / Widget'),
    rjsfCheckSimpleTextInput: {
      'ui:title': 'text input',
    },
    rjsfCheckRequiredCheckbox: {
      'ui:title': 'required checkbox',
      'ui:widget': 'checkbox',
      'ui:options': {
        hideLabelText: true,
      },
      'ui:errorMessages': {
        enum: 'Please select a checkbox',
        required: 'Checkbox required error',
      },
    },
    rjsfCheckSsn: {
      ...ssnUI('Social security number'),
      'ui:title': 'Social security number',
      'ui:errorMessages': {
        required: 'Please enter a Social Security number',
      },
    },
    rjsfCheckboxWithBackground: {
      'ui:title': '',
      'ui:description': (
        <div className="vads-u-background-color--gray-light-alt">
          <input type="checkbox" id="checkbox1" />
          <label htmlFor="checkbox1">checkbox with background</label>
        </div>
      ),
    },
    wcTitle: inlineTitleUI('web component'),
    wcOldCheckSimpleText: {
      'ui:title': 'text input',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        uswds: false,
      },
    },
    wcOldCheckRequiredCheckbox: {
      'ui:title': 'required checkbox',
      'ui:webComponentField': VaCheckboxField,
      'ui:errorMessages': {
        enum: 'Please select a checkbox',
        required: 'Checkbox required error',
      },
      'ui:options': {
        uswds: false,
      },
    },
    wcOldCheckSsn: {
      ...newSsnUI('Social Security number'),
      'ui:options': {
        uswds: false,
      },
    },
    wcOldCheckboxWithBackground: {
      'ui:title': '',
      'ui:description': (
        <div className="vads-u-background-color--gray-light-alt">
          <va-checkbox label="checkbox with background" />
        </div>
      ),
    },
    wcV3Title: inlineTitleUI('web component v3'),
    wcV3CheckSimpleText: {
      'ui:title': 'text input',
      'ui:webComponentField': VaTextInputField,
    },
    wcV3CheckRequiredCheckbox: {
      'ui:title': 'required checkbox',
      'ui:webComponentField': VaCheckboxField,
      'ui:errorMessages': {
        enum: 'Please select a checkbox',
        required: 'Checkbox required error',
      },
    },
    wcV3CheckSsn: newSsnUI('Social Security number'),
    wcV3CheckboxWithBackground: {
      'ui:title': '',
      'ui:description': (
        <div className="vads-u-background-color--gray-light-alt">
          <va-checkbox label="checkbox with background" uswds />
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      rjsfTitle: titleSchema,
      rjsfCheckSimpleTextInput: {
        type: 'string',
      },
      rjsfCheckRequiredCheckbox: {
        type: 'boolean',
        enum: [true],
      },
      rjsfCheckSsn: {
        type: 'string',
      },
      rjsfCheckboxWithBackground: {
        type: 'object',
        properties: {},
      },
      wcTitle: inlineTitleSchema,
      wcOldCheckSimpleText: {
        type: 'string',
      },
      wcOldCheckRequiredCheckbox: {
        type: 'boolean',
        enum: [true],
      },
      wcOldCheckSsn: ssnSchema,
      wcOldCheckboxWithBackground: {
        type: 'object',
        properties: {},
      },
      wcV3Title: inlineTitleSchema,
      wcV3CheckSimpleText: {
        type: 'string',
      },
      wcV3CheckRequiredCheckbox: {
        type: 'boolean',
        enum: [true],
      },
      wcV3CheckSsn: ssnSchema,
      wcV3CheckboxWithBackground: {
        type: 'object',
        properties: {},
      },
    },
    required: [
      'rjsfCheckSimpleTextInput',
      'rjsfCheckRequiredCheckbox',
      'rjsfCheckSsn',
      'wcOldCheckSimpleText',
      'wcOldCheckRequiredCheckbox',
      'wcOldCheckSsn',
      'wcV3CheckSimpleText',
      'wcV3CheckRequiredCheckbox',
      'wcV3CheckSsn',
    ],
  },
};
