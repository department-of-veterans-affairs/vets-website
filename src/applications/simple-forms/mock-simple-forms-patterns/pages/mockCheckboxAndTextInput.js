import React from 'react';
import {
  inlineTitleSchema,
  inlineTitleUI,
  ssnUI as newSsnUI,
  ssnSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF / Widget'),
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
    'view:wcV3Title': inlineTitleUI('web component v3'),
    wcV3CheckSimpleText: {
      'ui:title': 'text input',
      'ui:webComponentField': VaTextInputField,
    },
    wcV3CheckRequiredCheckbox: {
      'ui:title': 'required checkbox',
      'ui:description': 'This is a checkbox with a description',
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
      'view:wcV3Title': inlineTitleSchema,
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
      'wcV3CheckSimpleText',
      'wcV3CheckRequiredCheckbox',
      'wcV3CheckSsn',
    ],
  },
};
