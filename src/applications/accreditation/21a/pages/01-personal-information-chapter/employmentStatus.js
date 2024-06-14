import {
  radioSchema,
  radioUI,
  textareaSchema,
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const employmentStatusOptions = {
  EMPLOYED: 'Employed',
  UNEMPLOYED: 'Unemployed',
  SELF_EMPLOYED: 'Self-employed',
  STUDENT: 'Student',
  RETIRED: 'Retired',
  OTHER: 'Other',
};

const requiresDescription = ['UNEMPLOYED', 'SELF_EMPLOYED', 'OTHER'];

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
    describeEmployment: {
      ...textareaUI('Describe your employment situation'),
      'ui:options': {
        hideIf: formData =>
          !requiresDescription.includes(formData.employmentStatus),
      },
      'ui:required': formData =>
        requiresDescription.includes(formData.employmentStatus),
    },
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
