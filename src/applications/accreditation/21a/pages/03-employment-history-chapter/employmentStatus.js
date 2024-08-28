import {
  radioSchema,
  radioUI,
  textareaSchema,
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  descriptionRequired,
  employmentStatusOptions,
} from '../../constants/options';

/** @type {PageSchema} */
export default {
  title: 'Employment status',
  path: 'employment-status',
  uiSchema: {
    ...titleUI('Employment status'),
    employmentStatus: radioUI({
      title: 'Select the status of your employment',
      labels: employmentStatusOptions,
    }),
    describeEmployment: textareaUI({
      title: 'Describe your employment situation',
      expandUnder: 'employmentStatus',
      expandUnderCondition: employmentStatus =>
        descriptionRequired.includes(employmentStatus),
      required: formData =>
        descriptionRequired.includes(formData.employmentStatus),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employmentStatus: radioSchema(Object.keys(employmentStatusOptions)),
      describeEmployment: textareaSchema,
    },
    required: ['employmentStatus'],
  },
};
