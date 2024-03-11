import React from 'react';
import {
  ssnUI,
  ssnSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('web component v3'),
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
    wcV3CheckSsn: ssnUI('Social Security number'),
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
      'wcV3CheckSimpleText',
      'wcV3CheckRequiredCheckbox',
      'wcV3CheckSsn',
    ],
  },
};
