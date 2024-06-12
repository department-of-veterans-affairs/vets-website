import {
  radioSchema,
  radioUI,
  textareaSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const employmentStatusOptions = {
  EMPLOYED: 'Employed',
  UNEMPLOYED: 'Unemployed',
  SELF_EMPLOYED: 'Self-employed',
  STUDENT: 'Student',
  RETIRED: 'Retired',
  OTHER: 'Other',
};

/** @type {PageSchema} */
export default {
  title: 'Employment status',
  path: 'employment-status',
  uiSchema: {
    employmentStatus: radioUI({
      title: 'Select the status of your employment',
      labels: employmentStatusOptions,
    }),
    describeEmployment: textareaUI('Describe your employment situation'),
  },
  schema: {
    type: 'object',
    properties: {
      employmentStatus: radioSchema(Object.keys(employmentStatusOptions)),
      describeEmployment: textareaSchema,
    },
    required: ['employmentStatus', 'describeEmployment'],
  },
};
