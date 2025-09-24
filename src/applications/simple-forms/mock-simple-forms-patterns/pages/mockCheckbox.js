import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  checkboxRequiredSchema,
  checkboxSchema,
  checkboxUI,
} from 'platform/forms-system/src/js/web-component-patterns/checkboxPattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Checkbox'),
    wcV3SimpleCheckbox: checkboxUI('simple checkbox'),
    wcV3SimpleCheckboxRequired: checkboxUI({
      title: 'simple checkbox',
      description: 'Checkbox header description',
    }),
    wcV3DynamicRequiredCheckbox: checkboxUI({
      title: 'title',
      description: 'description',
      checkboxDescription: 'checkboxDescription',
      internalDescription: <>internalDescription JSX</>,
      required: formData => formData.wcV3SimpleCheckbox,
      hint: 'hint',
      tile: true,
      errorMessages: {
        enum: 'Select the checkbox',
        required: 'Select the checkbox',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcV3SimpleCheckbox: checkboxSchema,
      wcV3SimpleCheckboxRequired: checkboxRequiredSchema,
      wcV3DynamicRequiredCheckbox: checkboxRequiredSchema,
    },
    required: ['wcV3SimpleCheckboxRequired'],
  },
};
